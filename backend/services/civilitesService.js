const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'civilites',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'abreviation' },
  ],
});
