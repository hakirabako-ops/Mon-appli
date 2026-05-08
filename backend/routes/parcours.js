const createCrudRouter = require('./createCrudRouter');
const service = require('../services/parcoursService');

module.exports = createCrudRouter(service, { label: 'Parcours', duplicateMessage: 'Un parcours avec ce libelle existe deja.' });
