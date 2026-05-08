import { useState, useEffect } from 'react';
import CertificateTemplate from '../components/CertificateTemplate';
import Spinner from '../components/Spinner';
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

        // Créer des maps pour accès rapide
        setStudents(Object.fromEntries(studentsData?.map(s => [s.id, s]) || []));
        setParcours(Object.fromEntries(parcoursData?.map(p => [p.id, p]) || []));
        setAnnees(Object.fromEntries(anneeData?.map(a => [a.id, a]) || []));
        
        if (Array.isArray(ecoleData) && ecoleData.length > 0) {
          setEcole(ecoleData[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <Spinner size="md" text="Chargement des inscriptions..." />
    </div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Erreur: {error}</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Gestion Etudiants</p>
          <h1 className="page-title">Certificats d'Inscription</h1>
          <p className="page-desc">Générez et téléchargez les certificats d'inscription des étudiants.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', minHeight: 'calc(100vh - 200px)' }}>
        {/* Liste des inscriptions */}
        <div className="table-card" style={{ flex: '0 0 350px', maxHeight: '600px', overflowY: 'auto' }}>
          <div className="table-card-header">
            <span className="table-card-title">Inscriptions</span>
            <span className="badge-count">{inscriptions.length}</span>
          </div>

          {inscriptions.length === 0 ? (
            <div className="empty-state">Aucune inscription trouvée.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
              {inscriptions.map((inscription) => {
                const student = students[inscription.etudiants_id];
                const isSelected = selectedInscription?.id === inscription.id;

                return (
                  <button
                    key={inscription.id}
                    onClick={() => setSelectedInscription(inscription)}
                    style={{
                      padding: '12px',
                      border: isSelected ? '2px solid #4a90e2' : '1px solid #ddd',
                      borderRadius: '4px',
                      background: isSelected ? '#f0f7ff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '13px' }}>
                      {student?.prenoms} {student?.nom}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {inscription.date_inscription}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificat */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          {selectedInscription ? (
            <div style={{ width: '100%', maxWidth: '1200px', overflowY: 'auto', maxHeight: '90vh' }}>
              
         <CertificateTemplate
         student={students[selectedInscription.etudiants_id]}
         inscription={selectedInscription}
         parcours={parcours[selectedInscription.parcours_id]}
         anneeAcademique={annees[selectedInscription.annee_academique_id]}
         ecole={ecole}
         />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#999' }}>
              <p>Sélectionnez une inscription pour afficher le certificat</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
