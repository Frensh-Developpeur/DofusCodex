using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.Json;

namespace DofusCodex.MacroHelper;

internal static class Program
{
    private static readonly object RunLock = new();
    private static MacroConfig Config = new();
    private static IntPtr MouseHook = IntPtr.Zero;
    private static IntPtr KeyboardHook = IntPtr.Zero;
    private static readonly LowLevelMouseProc MouseProc = OnMouse;
    private static readonly LowLevelKeyboardProc KeyboardProc = OnKeyboard;
    private static readonly HashSet<int> DownKeys = new();
    private static readonly Dictionary<int, DateTime> LastFire = new();
    private static bool Running = true;

    public static int Main(string[] args)
    {
        if (!OperatingSystem.IsWindows())
        {
            WriteEvent("error", "Windows only");
            return 2;
        }

        if (args.Length < 1)
        {
            WriteEvent("error", "Missing config path");
            return 2;
        }

        try
        {
            Config = LoadConfig(args[0]);
            if (!Config.Enabled)
            {
                WriteEvent("disabled", "Config disabled");
                return 0;
            }

            MouseHook = SetHook(MouseProc);
            KeyboardHook = SetHook(KeyboardProc);
            if (MouseHook == IntPtr.Zero || KeyboardHook == IntPtr.Zero)
            {
                WriteEvent("error", $"Hook failed: {Marshal.GetLastWin32Error()}");
                return 3;
            }

            Console.CancelKeyPress += (_, e) =>
            {
                e.Cancel = true;
                Stop();
            };
            AppDomain.CurrentDomain.ProcessExit += (_, _) => Stop();
            WriteEvent("ready", $"Loaded {Config.Macros.Count(m => m.Enabled)} macro(s)");

            while (Running && GetMessage(out MSG msg, IntPtr.Zero, 0, 0))
            {
                TranslateMessage(ref msg);
                DispatchMessage(ref msg);
            }
        }
        catch (Exception ex)
        {
            WriteEvent("error", ex.Message);
            return 1;
        }
        finally
        {
            Stop();
        }

        return 0;
    }

    private static MacroConfig LoadConfig(string path)
    {
        var json = File.ReadAllText(path);
        var cfg = JsonSerializer.Deserialize<MacroConfig>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            ReadCommentHandling = JsonCommentHandling.Skip,
        }) ?? new MacroConfig();
        cfg.Macros = cfg.Macros.Where(m => !string.IsNullOrWhiteSpace(m.Hotkey)).ToList();
        return cfg;
    }

    private static IntPtr SetHook(Delegate proc)
    {
        using var curProcess = Process.GetCurrentProcess();
        using var curModule = curProcess.MainModule;
        var module = curModule?.ModuleName ?? string.Empty;
        if (proc is LowLevelMouseProc mp)
        {
            return SetWindowsHookEx(WH_MOUSE_LL, mp, GetModuleHandle(module), 0);
        }
        return SetWindowsHookEx(WH_KEYBOARD_LL, (LowLevelKeyboardProc)proc, GetModuleHandle(module), 0);
    }

    private static IntPtr OnMouse(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0)
        {
            var evt = wParam.ToInt32();
            var hook = Marshal.PtrToStructure<MSLLHOOKSTRUCT>(lParam);
            var hotkey = evt switch
            {
                WM_MBUTTONDOWN => "MButton",
                WM_XBUTTONDOWN when HiWord(hook.mouseData) == 1 => "XButton1",
                WM_XBUTTONDOWN when HiWord(hook.mouseData) == 2 => "XButton2",
                _ => null,
            };
            if (hotkey is not null && TryFire(hotkey))
            {
                return Config.SuppressHotkeys ? new IntPtr(1) : CallNextHookEx(MouseHook, nCode, wParam, lParam);
            }
        }
        return CallNextHookEx(MouseHook, nCode, wParam, lParam);
    }

    private static IntPtr OnKeyboard(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0)
        {
            var evt = wParam.ToInt32();
            var kb = Marshal.PtrToStructure<KBDLLHOOKSTRUCT>(lParam);
            var vk = (int)kb.vkCode;
            if (evt is WM_KEYDOWN or WM_SYSKEYDOWN)
            {
                DownKeys.Add(vk);
                foreach (var macro in Config.Macros)
                {
                    if (!macro.Enabled || IsMouseHotkey(macro.Hotkey)) continue;
                    if (KeyboardHotkeyMatches(macro.Hotkey, vk) && TryFire(macro.Hotkey))
                    {
                        return Config.SuppressHotkeys ? new IntPtr(1) : CallNextHookEx(KeyboardHook, nCode, wParam, lParam);
                    }
                }
            }
            else if (evt is WM_KEYUP or WM_SYSKEYUP)
            {
                DownKeys.Remove(vk);
            }
        }
        return CallNextHookEx(KeyboardHook, nCode, wParam, lParam);
    }

    private static bool TryFire(string hotkey)
    {
        var macro = Config.Macros.FirstOrDefault(m => m.Enabled && HotkeyEquals(m.Hotkey, hotkey));
        if (macro is null) return false;
        var now = DateTime.UtcNow;
        var id = macro.Id.GetHashCode();
        if (LastFire.TryGetValue(id, out var last) && (now - last).TotalMilliseconds < Math.Max(0, Config.DebounceMs)) return true;
        LastFire[id] = now;
        Task.Run(() => ExecuteMacro(macro));
        return true;
    }

    private static void ExecuteMacro(Macro macro)
    {
        lock (RunLock)
        {
            WriteEvent("macro", macro.Label);
            if (string.Equals(macro.Target, "dofus", StringComparison.OrdinalIgnoreCase))
            {
                if (!FocusDofusWindow())
                {
                    WriteEvent("target-missing", "Dofus window not found");
                    return;
                }
                Thread.Sleep(Math.Max(0, Math.Min(1000, Config.FocusDelayMs)));
            }
            foreach (var step in macro.Steps)
            {
                if (!Running) return;
                var repeat = Math.Max(1, step.Repeat ?? 1);
                for (var i = 0; i < repeat; i++)
                {
                    if (step.DelayMs is int delay && delay > 0) Thread.Sleep(delay);
                    if (!string.IsNullOrWhiteSpace(step.Text)) SendText(step.Text);
                    if (!string.IsNullOrWhiteSpace(step.Key)) SendChord(step.Key);
                    if (!string.IsNullOrWhiteSpace(step.Mouse)) SendMouse(step.Mouse);
                    if (step.SleepMs is int sleep && sleep > 0) Thread.Sleep(sleep);
                }
            }
        }
    }

    private static bool FocusDofusWindow()
    {
        var hwnd = FindDofusWindow();
        if (hwnd == IntPtr.Zero) return false;
        ShowWindow(hwnd, SW_RESTORE);
        return SetForegroundWindow(hwnd);
    }

    private static IntPtr FindDofusWindow()
    {
        var found = IntPtr.Zero;
        EnumWindows((hwnd, _) =>
        {
            if (found != IntPtr.Zero || !IsWindowVisible(hwnd)) return true;
            GetWindowThreadProcessId(hwnd, out var pid);
            if (pid == 0) return true;
            try
            {
                using var process = Process.GetProcessById((int)pid);
                if (process.ProcessName.Contains("dofus", StringComparison.OrdinalIgnoreCase))
                {
                    found = hwnd;
                    return false;
                }
            }
            catch
            {
                /* process disappeared */
            }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    private static bool KeyboardHotkeyMatches(string hotkey, int triggerVk)
    {
        var parts = SplitChord(hotkey);
        var key = parts.LastOrDefault();
        if (key is null) return false;
        var keyVk = KeyToVk(key);
        if (keyVk != triggerVk) return false;
        return ModifierState(parts.Take(parts.Length - 1));
    }

    private static bool ModifierState(IEnumerable<string> modifiers)
    {
        var wanted = modifiers.Select(NormalizeToken).ToHashSet(StringComparer.OrdinalIgnoreCase);
        return DownEquals(wanted.Contains("Ctrl"), VK_CONTROL, VK_LCONTROL, VK_RCONTROL)
            && DownEquals(wanted.Contains("Alt"), VK_MENU, VK_LMENU, VK_RMENU)
            && DownEquals(wanted.Contains("Shift"), VK_SHIFT, VK_LSHIFT, VK_RSHIFT)
            && DownEquals(wanted.Contains("Win"), VK_LWIN, VK_RWIN);
    }

    private static bool DownEquals(bool expected, params int[] keys)
    {
        var isDown = keys.Any(k => DownKeys.Contains(k) || (GetAsyncKeyState(k) & 0x8000) != 0);
        return expected == isDown;
    }

    private static void SendChord(string chord)
    {
        var parts = SplitChord(chord);
        if (parts.Length == 0) return;
        var mods = parts.Take(parts.Length - 1).Select(KeyToVk).Where(v => v > 0).ToArray();
        var key = KeyToVk(parts[^1]);
        if (key <= 0) return;
        var inputs = new List<INPUT>();
        foreach (var m in mods) inputs.Add(KeyInput((ushort)m, false));
        inputs.Add(KeyInput((ushort)key, false));
        inputs.Add(KeyInput((ushort)key, true));
        foreach (var m in mods.Reverse()) inputs.Add(KeyInput((ushort)m, true));
        SendInputs(inputs);
    }

    private static void SendText(string text)
    {
        var inputs = new List<INPUT>();
        foreach (var ch in text)
        {
            inputs.Add(UnicodeInput(ch, false));
            inputs.Add(UnicodeInput(ch, true));
        }
        SendInputs(inputs);
    }

    private static void SendMouse(string mouse)
    {
        var token = NormalizeToken(mouse);
        var inputs = token switch
        {
            "LeftClick" => new[] { MouseInput(MOUSEEVENTF_LEFTDOWN), MouseInput(MOUSEEVENTF_LEFTUP) },
            "RightClick" => new[] { MouseInput(MOUSEEVENTF_RIGHTDOWN), MouseInput(MOUSEEVENTF_RIGHTUP) },
            "MiddleClick" => new[] { MouseInput(MOUSEEVENTF_MIDDLEDOWN), MouseInput(MOUSEEVENTF_MIDDLEUP) },
            _ => Array.Empty<INPUT>(),
        };
        SendInputs(inputs);
    }

    private static void SendInputs(IReadOnlyCollection<INPUT> inputs)
    {
        if (inputs.Count == 0) return;
        var arr = inputs.ToArray();
        SendInput((uint)arr.Length, arr, Marshal.SizeOf<INPUT>());
    }

    private static INPUT KeyInput(ushort vk, bool up) => new()
    {
        type = INPUT_KEYBOARD,
        U = new InputUnion { ki = new KEYBDINPUT { wVk = vk, dwFlags = up ? KEYEVENTF_KEYUP : 0 } },
    };

    private static INPUT UnicodeInput(char ch, bool up) => new()
    {
        type = INPUT_KEYBOARD,
        U = new InputUnion { ki = new KEYBDINPUT { wScan = ch, dwFlags = KEYEVENTF_UNICODE | (up ? KEYEVENTF_KEYUP : 0) } },
    };

    private static INPUT MouseInput(uint flags) => new()
    {
        type = INPUT_MOUSE,
        U = new InputUnion { mi = new MOUSEINPUT { dwFlags = flags } },
    };

    private static int KeyToVk(string key)
    {
        var k = NormalizeToken(key);
        if (k.Length == 1)
        {
            var ch = char.ToUpperInvariant(k[0]);
            if (ch is >= 'A' and <= 'Z') return ch;
            if (ch is >= '0' and <= '9') return ch;
        }
        if (k.StartsWith('F') && int.TryParse(k[1..], out var f) && f is >= 1 and <= 24) return VK_F1 + f - 1;
        return k switch
        {
            "Ctrl" or "Control" => VK_CONTROL,
            "Alt" => VK_MENU,
            "Shift" => VK_SHIFT,
            "Win" => VK_LWIN,
            "Space" => VK_SPACE,
            "Enter" => VK_RETURN,
            "Escape" or "Esc" => VK_ESCAPE,
            "Delete" or "Del" => VK_DELETE,
            "Backspace" => VK_BACK,
            "Tab" => VK_TAB,
            "Up" => VK_UP,
            "Down" => VK_DOWN,
            "Left" => VK_LEFT,
            "Right" => VK_RIGHT,
            "Home" => VK_HOME,
            "End" => VK_END,
            "PageUp" => VK_PRIOR,
            "PageDown" => VK_NEXT,
            _ => 0,
        };
    }

    private static string[] SplitChord(string chord) => chord
        .Replace("^", "Ctrl+", StringComparison.Ordinal)
        .Replace("!", "Alt+", StringComparison.Ordinal)
        .Replace("+", "+", StringComparison.Ordinal)
        .Split('+', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    private static string NormalizeToken(string token)
    {
        var t = token.Trim();
        if (string.Equals(t, "Control", StringComparison.OrdinalIgnoreCase)) return "Ctrl";
        if (string.Equals(t, "Esc", StringComparison.OrdinalIgnoreCase)) return "Escape";
        return t.Length == 0 ? t : char.ToUpperInvariant(t[0]) + t[1..];
    }

    private static bool IsMouseHotkey(string hotkey) =>
        hotkey.Equals("MButton", StringComparison.OrdinalIgnoreCase)
        || hotkey.Equals("XButton1", StringComparison.OrdinalIgnoreCase)
        || hotkey.Equals("XButton2", StringComparison.OrdinalIgnoreCase);

    private static bool HotkeyEquals(string a, string b) => NormalizeHotkey(a) == NormalizeHotkey(b);

    private static string NormalizeHotkey(string hotkey) => string.Join("+", SplitChord(hotkey).Select(NormalizeToken));

    private static int HiWord(uint value) => (int)((value >> 16) & 0xffff);

    private static void Stop()
    {
        Running = false;
        if (MouseHook != IntPtr.Zero) UnhookWindowsHookEx(MouseHook);
        if (KeyboardHook != IntPtr.Zero) UnhookWindowsHookEx(KeyboardHook);
        MouseHook = IntPtr.Zero;
        KeyboardHook = IntPtr.Zero;
    }

    private static void WriteEvent(string type, string message)
    {
        var payload = JsonSerializer.Serialize(new { type, message, at = DateTimeOffset.UtcNow });
        Console.WriteLine(payload);
    }

    private sealed class MacroConfig
    {
        public bool Enabled { get; set; } = true;
        public bool SuppressHotkeys { get; set; } = true;
        public int DebounceMs { get; set; } = 180;
        public int FocusDelayMs { get; set; } = 120;
        public List<Macro> Macros { get; set; } = new();
    }

    private sealed class Macro
    {
        public string Id { get; set; } = Guid.NewGuid().ToString("N");
        public bool Enabled { get; set; } = true;
        public string Label { get; set; } = "Macro";
        public string Hotkey { get; set; } = "";
        public string Target { get; set; } = "active";
        public List<MacroStep> Steps { get; set; } = new();
    }

    private sealed class MacroStep
    {
        public string? Key { get; set; }
        public string? Text { get; set; }
        public string? Mouse { get; set; }
        public int? SleepMs { get; set; }
        public int? DelayMs { get; set; }
        public int? Repeat { get; set; }
    }

    private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);
    private delegate bool EnumWindowsProc(IntPtr hwnd, IntPtr lParam);

    private const int WH_MOUSE_LL = 14;
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private const int WM_KEYUP = 0x0101;
    private const int WM_SYSKEYDOWN = 0x0104;
    private const int WM_SYSKEYUP = 0x0105;
    private const int WM_MBUTTONDOWN = 0x0207;
    private const int WM_XBUTTONDOWN = 0x020B;
    private const int SW_RESTORE = 9;

    private const int INPUT_MOUSE = 0;
    private const int INPUT_KEYBOARD = 1;
    private const uint KEYEVENTF_KEYUP = 0x0002;
    private const uint KEYEVENTF_UNICODE = 0x0004;
    private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    private const uint MOUSEEVENTF_LEFTUP = 0x0004;
    private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    private const uint MOUSEEVENTF_RIGHTUP = 0x0010;
    private const uint MOUSEEVENTF_MIDDLEDOWN = 0x0020;
    private const uint MOUSEEVENTF_MIDDLEUP = 0x0040;

    private const int VK_BACK = 0x08;
    private const int VK_TAB = 0x09;
    private const int VK_RETURN = 0x0D;
    private const int VK_SHIFT = 0x10;
    private const int VK_CONTROL = 0x11;
    private const int VK_MENU = 0x12;
    private const int VK_ESCAPE = 0x1B;
    private const int VK_SPACE = 0x20;
    private const int VK_PRIOR = 0x21;
    private const int VK_NEXT = 0x22;
    private const int VK_END = 0x23;
    private const int VK_HOME = 0x24;
    private const int VK_LEFT = 0x25;
    private const int VK_UP = 0x26;
    private const int VK_RIGHT = 0x27;
    private const int VK_DOWN = 0x28;
    private const int VK_DELETE = 0x2E;
    private const int VK_LWIN = 0x5B;
    private const int VK_RWIN = 0x5C;
    private const int VK_F1 = 0x70;
    private const int VK_LSHIFT = 0xA0;
    private const int VK_RSHIFT = 0xA1;
    private const int VK_LCONTROL = 0xA2;
    private const int VK_RCONTROL = 0xA3;
    private const int VK_LMENU = 0xA4;
    private const int VK_RMENU = 0xA5;

    [StructLayout(LayoutKind.Sequential)]
    private struct POINT { public int x; public int y; }

    [StructLayout(LayoutKind.Sequential)]
    private struct MSLLHOOKSTRUCT
    {
        public POINT pt;
        public uint mouseData;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KBDLLHOOKSTRUCT
    {
        public uint vkCode;
        public uint scanCode;
        public uint flags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MSG
    {
        public IntPtr hwnd;
        public uint message;
        public UIntPtr wParam;
        public IntPtr lParam;
        public uint time;
        public POINT pt;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct INPUT
    {
        public int type;
        public InputUnion U;
    }

    [StructLayout(LayoutKind.Explicit)]
    private struct InputUnion
    {
        [FieldOffset(0)] public MOUSEINPUT mi;
        [FieldOffset(0)] public KEYBDINPUT ki;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct MOUSEINPUT
    {
        public int dx;
        public int dy;
        public uint mouseData;
        public uint dwFlags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct KEYBDINPUT
    {
        public ushort wVk;
        public ushort wScan;
        public uint dwFlags;
        public uint time;
        public IntPtr dwExtraInfo;
    }

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll")]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    [DllImport("user32.dll")]
    private static extern bool GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

    [DllImport("user32.dll")]
    private static extern bool TranslateMessage([In] ref MSG lpMsg);

    [DllImport("user32.dll")]
    private static extern IntPtr DispatchMessage([In] ref MSG lpmsg);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int vKey);

    [DllImport("user32.dll", SetLastError = true)]
    private static extern uint SendInput(uint nInputs, INPUT[] pInputs, int cbSize);

    [DllImport("user32.dll")]
    private static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    private static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);
}
