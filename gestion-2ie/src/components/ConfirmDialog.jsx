import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ConfirmDialog.css';

export default function ConfirmDialog({ show, title, message, onConfirm, onCancel, loading = false }) {
  if (!show) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          </div>
          <h2 className="confirm-dialog-title">{title}</h2>
          <button
            className="confirm-dialog-close"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        </div>

        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-footer">
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}
