const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'cycles',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'duree_annees', required: true, label: 'Duree' },
  ],
});
