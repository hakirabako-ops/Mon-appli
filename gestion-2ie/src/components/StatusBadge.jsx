const STATUSES = {
  'payé':       { label: 'Payé',       cls: 'badge-success' },
  'impayé':     { label: 'Impayé',     cls: 'badge-danger'  },
  'partiel':    { label: 'Partiel',    cls: 'badge-warning' },
  'valide':     { label: 'Validé',     cls: 'badge-success' },
  'validé':     { label: 'Validé',     cls: 'badge-success' },
  'annulé':     { label: 'Annulé',     cls: 'badge-danger'  },
  'annule':     { label: 'Annulé',     cls: 'badge-danger'  },
  'en_attente': { label: 'En attente', cls: 'badge-warning' },
  'active':     { label: 'Active',     cls: 'badge-success' },
  'inactive':   { label: 'Inactive',   cls: 'badge-neutral' },
  'oui':        { label: 'Oui',        cls: 'badge-success' },
  'non':        { label: 'Non',        cls: 'badge-neutral' },
};

export default function StatusBadge({ value }) {
  const key = String(value ?? '').toLowerCase().trim();
  const cfg = STATUSES[key] || { label: value ?? '—', cls: 'badge-neutral' };
  return <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>;
}
