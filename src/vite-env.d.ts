/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Compte cloud (Supabase) — clé anon publique, protégée par RLS côté serveur.
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface UpdateEvent {
  state: "available" | "downloading" | "downloaded";
  version?: string;
  percent?: number;
  isMac: boolean;
}

interface Window {
  dofusCodex?: {
    getPlatform: () => Promise<NodeJS.Platform>;
    getAppVersion?: () => Promise<string>;
    renderSkin?: (payload: unknown) => Promise<string | null>;
    getDofusRoomSpells?: (character: string) => Promise<unknown | null>;
    metamobRequest?: (opts: {
      method: string;
      path: string;
      apiKey: string;
      body?: unknown;
    }) => Promise<{ ok: boolean; status: number; data: unknown; error?: string }>;
    onUpdate?: (cb: (p: UpdateEvent) => void) => () => void;
    peekUpdate?: () => Promise<UpdateEvent | null>;
    onDeepLink?: (cb: (url: string) => void) => () => void;
    peekDeepLink?: () => Promise<string | null>;
    overlayOpen?: (guideId: number) => Promise<void>;
    overlayClose?: () => Promise<void>;
    overlayResize?: (size: { width: number; height: number }) => Promise<void>;
    overlaySnapMode?: (on: boolean) => Promise<void>;
    detectDofus?: () => Promise<{ running: boolean }>;
    installUpdate?: () => Promise<void>;
    openReleases?: () => Promise<void>;
    checkUpdate?: () => Promise<{ ok: boolean; current?: string; latest?: string | null; reason?: string }>;
    readGanymedeProgress?: () => Promise<{
      profileName: string;
      progresses: Array<{
        id: number;
        currentStep: number;
        steps: Record<string, { checkboxes: number[] }>;
        updatedAt?: string;
      }>;
    } | null>;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      title?: string;
      partition?: string;
      allowpopups?: string;
    };
  }
}
