// pages/PaiementsPage.jsx
import CrudPage from '../components/CrudPage';
import { paiementsService } from '../services/paiementService';
import { inscriptionsService } from '../services/inscriptionsService';

// Fonction pour formater l'affichage de l'inscription
const inscriptionLabel = (inscription) => {
  return `Inscription #${inscription.id}`;
};


const paiementsConfig = {
  title: 'Paiements',
  category: 'Ressources',
  singular: 'paiement',
  description: 'Gérez les paiements des inscriptions.',
  listTitle: 'Liste des paiements',
  service: paiementsService,
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true, // 🟢 ACTIVE LES BOUTONS CSV, EXCEL, IMPORTER
  fields: [
    { name: 'inscription_id', label: 'Inscription', type: 'select', service: inscriptionsService, optionLabel: inscriptionLabel, required: true },
    { name: 'montant', label: 'Montant (FCFA)', type: 'number', required: true, placeholder: '50000' },
    { name: 'date_paiement', label: 'Date paiement', type: 'date', required: true },
    { name: 'mode_paiement', label: 'Mode', placeholder: 'especes' },
    { name: 'reference', label: 'Référence', placeholder: 'REF-001' },
    { name: 'statut', label: 'Statut', placeholder: 'valide' },
    { name: 'commentaire', label: 'Commentaire', type: 'textarea' },
  ],
  columns: [
    { name: 'inscription_id', label: 'Inscription', optionField: 'inscription_id', optionLabel: inscriptionLabel },
    { name: 'montant', label: 'Montant', render: (value) => `${value?.toLocaleString()} FCFA` },
    { name: 'date_paiement', label: 'Date', render: (value) => String(value || '').slice(0, 10) },
    { name: 'mode_paiement', label: 'Mode' },
    { name: 'reference', label: 'Référence' },
    { name: 'statut', label: 'Statut' },
  ],
};

export default function PaiementsPage() {
  return <CrudPage config={paiementsConfig} />;
}