const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'inscriptions',
  orderBy: 'date_inscription DESC',
  fields: [
    { name: 'etudiants_id', required: true, label: 'Etudiant' },
    { name: 'parcours_id', required: true, label: 'Parcours' },
    { name: 'annee_academique_id', required: true, label: 'Annee academique' },
    { name: 'decisions_id', required: true, label: 'Decision' },
    { name: 'date_inscription', required: true, label: 'Date inscription' },
    { name: 'montant_paye' },
    { name: 'statut_paiement' },
  ],
});
