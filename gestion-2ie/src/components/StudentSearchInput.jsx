import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

/**
 * Champ de recherche et sélection d'un étudiant.
 * - value : étudiant sélectionné (objet) ou null
 * - onChange(etudiant|null) : appelé quand la sélection change
 */
export default function StudentSearchInput({ etudiants, value, onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showList, setShowList] = useState(false);

  const filtered = etudiants.filter((e) =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSelect(etudiant) {
    onChange(etudiant);
    setShowList(false);
    setSearchTerm('');
  }

  function handleClear() {
    onChange(null);
    setSearchTerm('');
  }

  if (value) {
    return (
      <div className="selected-student">
        <div className="selected-student-info">
          <strong>{value.nom} {value.prenoms}</strong>
          <span>{value.email}</span>
        </div>
        <button type="button" className="btn-icon" onClick={handleClear} title="Désélectionner">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header-actions">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowList(true)}
          className="form-input"
          placeholder="Rechercher par nom, prénom ou email..."
          style={{ flex: 1 }}
        />
        <button type="button" className="btn-secondary" onClick={() => setShowList(!showList)}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {showList && searchTerm.length > 0 && (
        <div className="student-search-results">
          {filtered.length === 0 ? (
            <div className="empty-state">Aucun étudiant trouvé</div>
          ) : (
            filtered.map((e) => (
              <div key={e.id} className="student-result-item" onClick={() => handleSelect(e)}>
                <strong>{e.nom} {e.prenoms}</strong>
                <span className="student-result-email">{e.email}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
