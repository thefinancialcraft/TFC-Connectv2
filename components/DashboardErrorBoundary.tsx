import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Dashboard:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-red-100 p-8 text-center">
            <div>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fi fi-rr-exclamation text-2xl text-red-500"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We encountered an error while loading this section of the dashboard.
                    Please try refreshing the page.
                </p>
                <div className="text-xs text-left bg-red-50 p-4 rounded-lg overflow-auto max-w-lg mx-auto mb-6 text-red-800 font-mono">
                    {this.state.error?.message}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-bold hover:bg-[#3b27b8] transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
