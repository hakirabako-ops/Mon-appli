import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheckCircle, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './Alert.css';

const iconMap = {
  info: faInfoCircle,
  success: faCheckCircle,
  warning: faExclamationCircle,
  error: faTimesCircle,
};

export default function Alert({ children, variant = 'info', onClose }) {
  return (
    <div className={`alert alert-${variant}`}>
      <div className="alert-icon">
        <FontAwesomeIcon icon={iconMap[variant]} aria-hidden="true" />
      </div>
      <div className="alert-content">
        {children}
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Fermer l'alerte">
          ×
        </button>
      )}
    </div>
  );
}
