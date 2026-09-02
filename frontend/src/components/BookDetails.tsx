import { useRef } from 'react';
import type { Livro } from '../types';
import AccessibleModal from './AccessibleModal';

interface Props {
  aberto: boolean;
  livro: Livro | null;
  onFechar: () => void;
}

export default function BookDetails({ aberto, livro, onFechar }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  if (!aberto || !livro) return null;

  return (
    <AccessibleModal
      onFechar={onFechar}
      labelledBy="book-details-title"
      initialFocusRef={titleRef}
    >
      <div className="modal-header">
        <h2 id="book-details-title" ref={titleRef} tabIndex={-1}>Detalhes do Livro</h2>
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
            <h3>{livro.nome}</h3>
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
    </AccessibleModal>
  );
}
