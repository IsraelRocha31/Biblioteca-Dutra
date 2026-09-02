import type { Livro } from '../types';

interface Props {
  livro: Livro;
  onVerDetalhes: (id: number) => void;
  onEditar: (id: number) => void;
  onDeletar: (id: number, nome: string) => void;
  isAdmin: boolean;
}

export default function BookCard({ livro, onVerDetalhes, onEditar, onDeletar, isAdmin }: Props) {
  return (
    <article className="card-livro">
      <div className={`card-capa ${livro.foto_capa ? '' : 'is-empty'}`.trim()}>
        {livro.foto_capa ? (
          <img src={livro.foto_capa} alt={`Capa de ${livro.nome}`} />
        ) : (
          <span className="sr-only">Livro sem capa cadastrada</span>
        )}
      </div>
      <div className="card-body">
        <h2>{livro.nome}</h2>
        <p className="autor">{livro.autor}</p>
        <span className="isbn">ISBN: {livro.isbn}</span>
        <div className="card-acoes">
          <button type="button" className="btn-detalhes" onClick={() => onVerDetalhes(livro.id)} aria-label={`Detalhes de ${livro.nome}`}>Detalhes</button>
          {isAdmin && (
            <>
              <button type="button" className="btn-editar" onClick={() => onEditar(livro.id)} aria-label={`Editar ${livro.nome}`}>Editar</button>
              <button type="button" className="btn-deletar" onClick={() => onDeletar(livro.id, livro.nome)} aria-label={`Excluir ${livro.nome}`}>Excluir</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
