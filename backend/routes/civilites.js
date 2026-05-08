const createCrudRouter = require('./createCrudRouter');
const service = require('../services/civilitesService');

module.exports = createCrudRouter(service, { label: 'Civilite', duplicateMessage: 'Une civilite avec ce libelle existe deja.' });
