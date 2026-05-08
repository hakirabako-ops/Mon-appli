const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'parcours',
  orderBy: 'libelle ASC',
  fields: [
    { name: 'libelle', required: true, label: 'Libelle' },
    { name: 'specialites_id', required: true, label: 'Specialite' },
    { name: 'niveaux_id', required: true, label: 'Niveau' },
    { name: 'credits_requis' },
  ],
});
