const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'niveaux',
  orderBy: 'ordre ASC, libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'ordre', required: true, label: 'Ordre' },
    { name: 'cycles_id', required: true, label: 'Cycle' },
  ],
});
