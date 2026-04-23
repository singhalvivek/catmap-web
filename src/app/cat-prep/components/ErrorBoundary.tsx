// ErrorBoundary — catches render errors in child components and shows a fallback UI
"use client";

import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Render error caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center space-y-2">
          <p className="text-red-700 font-semibold">Something went wrong loading the roadmap.</p>
          <p className="text-sm text-red-500">Try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
