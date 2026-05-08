import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import './ToastNotification.css';

const iconMap = {
  success: faCheckCircle,
  error: faExclamationCircle,
  info: faInfoCircle,
};

export default function ToastNotification({ show, type = 'info', message, onClose, autoClose = 3000 }) {
  useEffect(() => {
    if (!show || autoClose === false) return;

    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [show, autoClose, onClose]);

  if (!show) return null;

  return (
    <div className={`toast-notification toast-${type}`}>
      <div className="toast-content">
        <FontAwesomeIcon icon={iconMap[type]} className="toast-icon" aria-hidden="true" />
        <p className="toast-message">{message}</p>
      </div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Fermer la notification"
      >
        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
      </button>
    </div>
  );
}
