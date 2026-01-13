"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-8">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-zinc-400 mb-4">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
