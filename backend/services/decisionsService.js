const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'decisions',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'description' },
  ],
});
