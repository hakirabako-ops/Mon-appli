import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function SectionPage({ title, category, description }) {
  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{category}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-desc">{description}</p>
        </div>
      </div>
      <div className="section-placeholder">
        <div className="section-placeholder-icon">
          <FontAwesomeIcon icon={faTriangleExclamation} aria-hidden="true" />
        </div>
        <div className="section-placeholder-title">Module en cours de développement</div>
        <div className="section-placeholder-desc">Cette section sera disponible prochainement.</div>
      </div>
    </>
  );
}
