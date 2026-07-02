import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bgPrimary)',
            color: 'var(--color-textPrimary)',
            fontFamily: 'var(--font-inter)',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '28px',
              marginBottom: '16px',
            }}
          >
            Terminal Error
          </h2>
          <p style={{ color: 'var(--color-textSecondary)', marginBottom: '32px' }}>
            Something went wrong. Please restart the terminal.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            aria-label="Restart terminal"
            style={{
              height: '64px',
              padding: '0 32px',
              background: 'var(--color-accent)',
              color: 'var(--color-textOnAccent)',
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: '18px',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
