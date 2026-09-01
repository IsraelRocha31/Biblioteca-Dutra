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
    <div className="card-livro">
      <div className="card-capa">
        {livro.foto_capa ? (
          <img src={livro.foto_capa} alt={livro.nome} />
        ) : (
          '📖'
        )}
      </div>
      <div className="card-body">
        <h4>{livro.nome}</h4>
        <p className="autor">{livro.autor}</p>
        <span className="isbn">ISBN: {livro.isbn}</span>
        <div className="card-acoes">
          <button className="btn-detalhes" onClick={() => onVerDetalhes(livro.id)}>Detalhes</button>
          {isAdmin && (
            <>
              <button className="btn-editar" onClick={() => onEditar(livro.id)}>Editar</button>
              <button className="btn-deletar" onClick={() => onDeletar(livro.id, livro.nome)}>Excluir</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
