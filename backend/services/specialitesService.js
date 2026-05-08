const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'specialites',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'filieres_id', required: true, label: 'Filiere' },
    { name: 'description' },
  ],
});
