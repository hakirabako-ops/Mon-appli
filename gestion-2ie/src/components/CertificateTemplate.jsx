import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './CertificateTemplate.css';

export default function CertificateTemplate({
  student,
  inscription,
  parcours,
  anneeAcademique,
  ecole = {},
}) {
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    try {
      const element = certificateRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificat_${student?.nom}_${student?.prenoms}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du certificat.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div ref={certificateRef} className="certificate-container">
        {/* En-tête */}
        <div className="certificate-header">
          <img src="/2ie.png" alt="Logo 2iE" className="certificate-logo" />
          <div className="certificate-header-text">
            <h2 className="certificate-school-name">{ecole.nom || '2iE - Institut International d\'Ingénierie'}</h2>
            <p className="certificate-tagline">Centre d'excellence en formation d'ingénieurs</p>
          </div>
        </div>

        {/* Titre du certificat */}
        <div className="certificate-title">
          <h1>CERTIFICAT D'INSCRIPTION</h1>
          <div className="certificate-divider"></div>
        </div>

        {/* Corps du certificat */}
        <div className="certificate-body">
          <p className="certificate-intro">
            Ceci certifie que
          </p>

          <div className="certificate-student-info">
            <p className="certificate-student-name">
              {student?.prenoms} {student?.nom}
            </p>
          </div>

          <p className="certificate-text">
            est dûment inscrit(e) à l'année académique {anneeAcademique?.libelle || '2025-2026'} dans le
          </p>

          <div className="certificate-program-info">
            <p className="certificate-program">{parcours?.libelle || 'Programme'}</p>
          </div>

          <p className="certificate-text">
            dans les conditions stipulées par le règlement intérieur de l'établissement.
          </p>

          {/* Détails */}
          <div className="certificate-details">
            <div className="detail-row">
              <span className="detail-label">Date d'inscription :</span>
              <span className="detail-value">{inscription?.date_inscription || new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Statut de paiement :</span>
              <span className={`detail-value ${inscription?.statut_paiement === 'payé' || inscription?.statut_paiement === 'paye' ? 'paid' : 'unpaid'}`}>
                {inscription?.statut_paiement || 'Impayé'}
              </span>
            </div>
          </div>
        </div>

        {/* Pied de page avec signatures */}
        <div className="certificate-footer">
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signature-title">Directeur(trice) des Inscriptions</p>
          </div>
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signature-title">Sceau de l'établissement</p>
          </div>
          <div className="signature-block">
            <div className="signature-line"></div>
            <p className="signature-title">Date</p>
          </div>
        </div>

        {/* Numéro de référence */}
        <div className="certificate-reference">
          <p>Référence : INS-{inscription?.id?.toString().padStart(6, '0')}</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="btn-primary"
        style={{ alignSelf: 'center', marginTop: '20px' }}
      >
        ↓ Télécharger le certificat PDF
      </button>
    </div>
  );
}