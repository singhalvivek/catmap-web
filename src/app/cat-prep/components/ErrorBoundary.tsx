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
        <div className="ed-notice" data-state="wrong" role="alert">
          <span>
            <strong style={{ fontWeight: 600 }}>
              Something went wrong loading the roadmap.
            </strong>{" "}
            Try refreshing the page.
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
