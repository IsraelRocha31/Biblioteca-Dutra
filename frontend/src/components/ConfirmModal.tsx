interface Props {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  confirmando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  aberto,
  titulo,
  mensagem,
  confirmando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onCancelar()}>
      <div className="modal-box modal-box--compact" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <div className="modal-header">
          <h3 id="confirm-title">{titulo}</h3>
          <button type="button" className="btn-fechar" onClick={onCancelar} aria-label="Fechar">&times;</button>
        </div>
        <div className="confirm-body">
          <p id="confirm-message">{mensagem}</p>
          <div className="modal-botoes">
            <button type="button" onClick={onCancelar} className="btn-cancelar" disabled={confirmando}>Cancelar</button>
            <button type="button" onClick={onConfirmar} className="btn-danger" disabled={confirmando}>
              {confirmando ? 'Excluindo...' : 'Excluir livro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
