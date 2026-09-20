import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "32px",
            maxWidth: "600px",
            margin: "40px auto",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            textAlign: "center"
          }}
        >
          <div style={{ display: "inline-flex", padding: "12px", background: "#FEF2F2", borderRadius: "50%", marginBottom: "16px" }}>
            <AlertTriangle size={32} color="#DC2626" />
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
            Operational Display Notice
          </h2>
          <p style={{ fontSize: "13px", color: "#475569", marginBottom: "20px", lineHeight: "1.5" }}>
            The current view encountered a runtime data inconsistency. The application safely prevented a blank screen.
          </p>
          <button
            onClick={this.handleReload}
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <RotateCcw size={15} />
            Reload Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
