const createCrudRouter = require('./createCrudRouter');
const service = require('../services/ecolesService');

module.exports = createCrudRouter(service, {
  label: 'Ecole',
  duplicateMessage: 'Une ecole avec ce libelle ou ce code existe deja.',
});
