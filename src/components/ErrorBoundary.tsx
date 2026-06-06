import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "./DofusIcons";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// Catches render errors anywhere below it so one broken component never blanks
// the whole window — it shows a recoverable message instead.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-glow-ember" />
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Une erreur est survenue</h2>
            <p className="mt-1 max-w-md text-sm text-slate-400">{this.state.error.message}</p>
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            className="no-drag rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
