import { useEffect, useState } from "react";
import CodexMark from "./CodexMark";

// A slim custom title bar. On macOS we inset for the traffic lights;
// on Windows the native overlay buttons sit at the right.
export default function TitleBar() {
  const [platform, setPlatform] = useState<string>("");
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    window.dofusCodex?.getPlatform().then(setPlatform).catch(() => {});
    window.dofusCodex?.getAppVersion?.().then(setVersion).catch(() => {});
  }, []);

  const isMac = platform === "darwin";

  return (
    <div
      className="drag relative z-30 flex h-10 shrink-0 items-center border-b border-white/5 bg-void-900/60 backdrop-blur-md"
      style={{ paddingLeft: isMac ? 78 : 16, paddingRight: isMac ? 16 : 140 }}
    >
      <div className="flex items-center gap-2">
        <CodexMark className="h-4 w-4 text-glow-purple" fill="rgba(124,92,255,0.25)" />
        <span className="font-display text-sm font-bold tracking-wide text-white">
          Dofus<span className="text-gradient">Codex</span>
        </span>
        <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          Dofus 3
        </span>
        {version && (
          <span className="rounded bg-glow-purple/15 px-1.5 py-0.5 text-[10px] font-semibold text-glow-violet">
            v{version}
          </span>
        )}
      </div>
    </div>
  );
}
