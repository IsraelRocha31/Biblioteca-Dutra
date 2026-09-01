import type { Livro } from '../types';

interface Props {
  aberto: boolean;
  livro: Livro | null;
  onFechar: () => void;
}

export default function BookDetails({ aberto, livro, onFechar }: Props) {
  if (!aberto || !livro) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>Detalhes do Livro</h3>
          <button type="button" className="btn-fechar" onClick={onFechar} aria-label="Fechar">&times;</button>
        </div>
        <div className="detalhes-body">
          <div className="detalhes-linha">
            <div className={`detalhes-foto ${livro.foto_capa ? '' : 'is-empty'}`.trim()}>
              {livro.foto_capa ? (
                <img src={livro.foto_capa} alt={`Capa de ${livro.nome}`} />
              ) : (
                <span className="sr-only">Livro sem capa cadastrada</span>
              )}
            </div>
            <div className="detalhes-info">
              <h4>{livro.nome}</h4>
              <p className="label">Autor</p>
              <p className="valor">{livro.autor}</p>
              <p className="label">ISBN</p>
              <p className="valor mono">{livro.isbn}</p>
              <p className="label">Cadastrado em</p>
              <p className="valor">{new Date(livro.criado_em).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          {livro.descricao && (
            <div className="detalhes-desc">
              <p className="label">Descrição</p>
              <p>{livro.descricao}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
