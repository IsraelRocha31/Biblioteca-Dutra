import { useRef } from 'react';
import AccessibleModal from './AccessibleModal';

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
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  if (!aberto) return null;

  return (
    <AccessibleModal
      onFechar={onCancelar}
      labelledBy="confirm-title"
      describedBy="confirm-message"
      role="alertdialog"
      className="modal-box--compact"
      initialFocusRef={cancelButtonRef}
    >
      <div className="modal-header">
        <h2 id="confirm-title">{titulo}</h2>
        <button type="button" className="btn-fechar" onClick={onCancelar} aria-label="Fechar" disabled={confirmando}>&times;</button>
      </div>
      <div className="confirm-body">
        <p id="confirm-message">{mensagem}</p>
        <div className="modal-botoes">
          <button ref={cancelButtonRef} type="button" onClick={onCancelar} className="btn-cancelar" disabled={confirmando}>Cancelar</button>
          <button type="button" onClick={onConfirmar} className="btn-danger" disabled={confirmando}>
            {confirmando ? 'Excluindo…' : 'Excluir livro'}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
}
