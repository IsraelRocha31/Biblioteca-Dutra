import { useState, useEffect, useCallback } from 'react';
import { getLivros, getLivro, criarLivro, atualizarLivro, deletarLivro } from '../api';
import type { Livro, Admin } from '../types';
import BookCard from './BookCard';
import BookModal from './BookModal';
import BookDetails from './BookDetails';
import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';
import { appConfig } from '../config/env';

interface Props {
  admin: Admin | null;
  onLogin: (admin: Admin, token: string) => void;
  onLogout: () => void;
}

export default function Dashboard({ admin, onLogin, onLogout }: Props) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [modalLivroAberto, setModalLivroAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [livroDetalhes, setLivroDetalhes] = useState<Livro | null>(null);
  const [loginAberto, setLoginAberto] = useState(false);
  const [livroParaExcluir, setLivroParaExcluir] = useState<{ id: number; nome: string } | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregarLivros = useCallback(async (termo?: string) => {
    setCarregando(true);
    try {
      const data = await getLivros(termo);
      setLivros(data.livros);
    } catch {
      setLivros([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarLivros(); }, [carregarLivros]);

  useEffect(() => {
    const timer = setTimeout(() => { carregarLivros(busca); }, appConfig.searchDebounceMs);
    return () => clearTimeout(timer);
  }, [busca, carregarLivros]);

  const handleSalvar = async (formData: FormData) => {
    if (livroEditando) {
      await atualizarLivro(livroEditando.id, formData);
    } else {
      await criarLivro(formData);
    }
    carregarLivros(busca);
  };

  const handleEditar = async (id: number) => {
    const data = await getLivro(id);
    setLivroEditando(data.livro);
    setModalLivroAberto(true);
  };

  const handleDeletar = (id: number, nome: string) => {
    setLivroParaExcluir({ id, nome });
  };

  const confirmarExclusao = async () => {
    if (!livroParaExcluir) return;

    setExcluindo(true);
    try {
      await deletarLivro(livroParaExcluir.id);
      setLivroParaExcluir(null);
      await carregarLivros(busca);
    } finally {
      setExcluindo(false);
    }
  };

  const handleVerDetalhes = async (id: number) => {
    const data = await getLivro(id);
    setLivroDetalhes(data.livro);
    setDetalhesAberto(true);
  };

  return (
    <div className="app-shell">
      <a href="#conteudo-principal" className="skip-link">Pular para o conteúdo principal</a>
      <header className="topo">
        <div className="topo-esq">
          <span className="logo-mini" aria-hidden="true" />
          <div>
            <h1>{appConfig.name}</h1>
            <small>{appConfig.schoolName}</small>
          </div>
        </div>
        <div className="topo-dir">
          {admin ? (
            <>
              <span className="admin-badge">{admin.nome}</span>
              <button type="button" onClick={onLogout} className="btn-sair">Sair</button>
            </>
          ) : (
            <button type="button" onClick={() => setLoginAberto(true)} className="btn-restrito">
              Acesso Restrito
            </button>
          )}
        </div>
      </header>

      <main className="conteudo" id="conteudo-principal" tabIndex={-1}>
        {admin && (
          <div className="acoes-topo">
            <button type="button" onClick={() => { setLivroEditando(null); setModalLivroAberto(true); }} className="btn-primary">
              + Novo Livro
            </button>
          </div>
        )}

        <div className="campo-busca-wrap">
          <label htmlFor="book-search" className="sr-only">Buscar livros</label>
          <input
            id="book-search"
            name="busca"
            type="search"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, autor ou ISBN…"
            className="campo-busca"
          />
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {carregando
            ? 'Carregando livros…'
            : `${livros.length} ${livros.length === 1 ? 'livro encontrado' : 'livros encontrados'}.`}
        </p>

        <div className="grid-livros" aria-busy={carregando}>
          {carregando ? (
            <p className="vazio">Carregando livros…</p>
          ) : livros.length === 0 ? (
            <p className="vazio">Nenhum livro encontrado.</p>
          ) : (
            livros.map(livro => (
              <BookCard
                key={livro.id}
                livro={livro}
                isAdmin={!!admin}
                onVerDetalhes={handleVerDetalhes}
                onEditar={handleEditar}
                onDeletar={handleDeletar}
              />
            ))
          )}
        </div>
      </main>

      <LoginModal
        aberto={loginAberto}
        onLogin={onLogin}
        onFechar={() => setLoginAberto(false)}
      />
      <BookModal
        aberto={modalLivroAberto}
        livro={livroEditando}
        onFechar={() => { setModalLivroAberto(false); setLivroEditando(null); }}
        onSalvar={handleSalvar}
      />
      <BookDetails
        aberto={detalhesAberto}
        livro={livroDetalhes}
        onFechar={() => { setDetalhesAberto(false); setLivroDetalhes(null); }}
      />
      <ConfirmModal
        aberto={!!livroParaExcluir}
        titulo="Excluir livro"
        mensagem={livroParaExcluir ? `Deseja realmente excluir “${livroParaExcluir.nome}”? Esta ação não pode ser desfeita.` : ''}
        confirmando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => !excluindo && setLivroParaExcluir(null)}
      />
    </div>
  );
}
