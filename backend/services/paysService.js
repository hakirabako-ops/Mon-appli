const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'pays',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'code' },
  ],
});
