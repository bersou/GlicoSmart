import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#FEF2F2', height: '100vh', color: '#991B1B' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Algo deu errado.</h1>
                    <p>Ocorreu um erro ao carregar a aplicação.</p>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #FCA5A5' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Ver detalhes do erro</summary>
                        <br />
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '2rem', padding: '1rem 2rem', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Tentar Novamente
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        style={{ marginTop: '1rem', marginLeft: '1rem', padding: '1rem 2rem', backgroundColor: '#fff', color: '#DC2626', border: '1px solid #DC2626', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Resetar Tudo (Limpar Dados)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;