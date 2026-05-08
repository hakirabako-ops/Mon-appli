const createCrudRouter = require('./createCrudRouter');
const service = require('../services/decisionsService');

module.exports = createCrudRouter(service, { label: 'Decision', duplicateMessage: 'Une decision avec ce libelle existe deja.' });
