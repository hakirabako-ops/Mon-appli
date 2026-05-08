const createCrudService = require('./createCrudService');

module.exports = createCrudService({
  table: 'etudiants',
  orderBy: 'nom ASC, prenoms ASC',
  fields: [
    { name: 'nom', required: true, label: 'Nom' },
    { name: 'prenoms', required: true, label: 'Prenoms' },
    { name: 'pays_id', required: true, label: 'Pays' },
    { name: 'civilites_id', required: true, label: 'Civilite' },
    { name: 'date_naissance' },
    { name: 'email' },
    { name: 'telephone' },
  ],
});
