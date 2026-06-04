/// <reference types="vite/client" />

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
    onUpdate?: (cb: (p: UpdateEvent) => void) => () => void;
    installUpdate?: () => Promise<void>;
    openReleases?: () => Promise<void>;
    checkUpdate?: () => Promise<{ ok: boolean; current?: string; latest?: string | null; reason?: string }>;
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
