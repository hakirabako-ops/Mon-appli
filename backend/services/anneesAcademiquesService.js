const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'annee_academique',
  orderBy: 'date_debut DESC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'date_debut', required: true, label: 'Date debut' },
    { name: 'date_fin', required: true, label: 'Date fin' },
    { name: 'est_active' },
  ],
});
