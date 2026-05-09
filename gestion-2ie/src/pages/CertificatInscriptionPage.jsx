import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import CertificateTemplate from '../components/CertificateTemplate';
import PageLoader from '../components/PageLoader';
import { inscriptionsService } from '../services/inscriptionsService';
import { etudiantsService } from '../services/etudiantsService';
import { parcoursService } from '../services/parcoursService';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { ecoleService } from '../services/ecoleService';

export default function CertificatInscriptionPage() {
  const [inscriptions, setInscriptions] = useState([]);
  const [selectedInscription, setSelectedInscription] = useState(null);
  const [students, setStudents] = useState({});
  const [parcours, setParcours] = useState({});
  const [annees, setAnnees] = useState({});
  const [ecole, setEcole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const [inscriptionsData, studentsData, parcoursData, anneeData, ecoleData] =
          await Promise.all([
            inscriptionsService.list(),
            etudiantsService.list(),
            parcoursService.list(),
            anneesAcademiquesService.list(),
            ecoleService.list().catch(() => [{}]),
          ]);

        setInscriptions(inscriptionsData || []);
        setStudents(Object.fromEntries(studentsData?.map((s) => [s.id, s]) || []));
        setParcours(Object.fromEntries(parcoursData?.map((p) => [p.id, p]) || []));
        setAnnees(Object.fromEntries(anneeData?.map((a) => [a.id, a]) || []));
        if (Array.isArray(ecoleData) && ecoleData.length > 0) setEcole(ecoleData[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <PageLoader text="Chargement des inscriptions..." />;

  if (error) {
    return (
      <div className="cert-error">
        Erreur : {error}
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Gestion Étudiants</p>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faAward} /> Certificats d'inscription
          </h1>
          <p className="page-desc">Sélectionnez une inscription pour générer et télécharger le certificat.</p>
        </div>
      </div>

      <div className="cert-layout">
        {/* Liste des inscriptions */}
        <div className="table-card cert-list-panel">
          <div className="table-card-header">
            <span className="table-card-title">Inscriptions</span>
            <span className="badge-count">{inscriptions.length}</span>
          </div>

          {inscriptions.length === 0 ? (
            <div className="empty-state">Aucune inscription trouvée.</div>
          ) : (
            <div className="cert-list-items">
              {inscriptions.map((inscription) => {
                const student = students[inscription.etudiants_id];
                const isSelected = selectedInscription?.id === inscription.id;
                return (
                  <button
                    key={inscription.id}
                    onClick={() => setSelectedInscription(inscription)}
                    className={`cert-item${isSelected ? ' selected' : ''}`}
                  >
                    <p className="cert-item-name">
                      {student?.prenoms} {student?.nom}
                    </p>
                    <p className="cert-item-date">
                      {String(inscription.date_inscription || '').slice(0, 10)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Aperçu du certificat */}
        <div className="cert-preview-panel">
          {selectedInscription ? (
            <div className="cert-preview-inner">
              <CertificateTemplate
                student={students[selectedInscription.etudiants_id]}
                inscription={selectedInscription}
                parcours={parcours[selectedInscription.parcours_id]}
                anneeAcademique={annees[selectedInscription.annee_academique_id]}
                ecole={ecole}
              />
            </div>
          ) : (
            <div className="cert-empty-hint">
              <FontAwesomeIcon icon={faAward} style={{ fontSize: '2rem', opacity: 0.3 }} />
              <p>Sélectionnez une inscription dans la liste pour afficher le certificat.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
