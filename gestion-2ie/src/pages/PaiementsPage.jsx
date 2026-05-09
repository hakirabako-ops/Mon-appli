import CrudPage from '../components/CrudPage';
import StatusBadge from '../components/StatusBadge';
import { paiementsService } from '../services/paiementService';
import { inscriptionsService } from '../services/inscriptionsService';

const numberFmt = new Intl.NumberFormat('fr-FR');

const paiementsConfig = {
  title: 'Paiements',
  category: 'Ressources',
  singular: 'paiement',
  description: 'Gérez les paiements liés aux inscriptions.',
  listTitle: 'Liste des paiements',
  service: paiementsService,
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true,
  fields: [
    { name: 'inscription_id',  label: 'Inscription',     type: 'select', service: inscriptionsService, optionLabel: (i) => `Inscription #${i.id}`, required: true },
    { name: 'montant',         label: 'Montant (FCFA)',  type: 'number', required: true, placeholder: '50000' },
    { name: 'date_paiement',   label: 'Date de paiement', type: 'date', required: true },
    { name: 'mode_paiement',   label: 'Mode',            placeholder: 'Espèces' },
    { name: 'reference',       label: 'Référence',       placeholder: 'REF-001' },
    { name: 'statut',          label: 'Statut',          placeholder: 'valide' },
    { name: 'commentaire',     label: 'Commentaire',     type: 'textarea' },
  ],
  columns: [
    { name: 'inscription_id', label: 'Inscription', optionField: 'inscription_id', optionLabel: (i) => `Inscription #${i.id}` },
    { name: 'montant',        label: 'Montant',     render: (v) => v ? `${numberFmt.format(v)} FCFA` : '—' },
    { name: 'date_paiement',  label: 'Date',        render: (v) => String(v || '').slice(0, 10) },
    { name: 'mode_paiement',  label: 'Mode' },
    { name: 'reference',      label: 'Référence' },
    { name: 'statut',         label: 'Statut',      render: (v) => <StatusBadge value={v} />, sortable: false },
  ],
};

export default function PaiementsPage() {
  return <CrudPage config={paiementsConfig} />;
}
