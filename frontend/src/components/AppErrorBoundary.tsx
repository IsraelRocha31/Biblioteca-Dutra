import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro não tratado na interface:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-fatal-error" role="alert">
          <h1>Biblioteca indisponível</h1>
          <p>Ocorreu um erro ao carregar a interface. Atualize a página ou tente novamente.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
