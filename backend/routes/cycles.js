const createCrudRouter = require('./createCrudRouter');
const service = require('../services/cyclesService');

module.exports = createCrudRouter(service, { label: 'Cycle', duplicateMessage: 'Un cycle avec ce libelle existe deja.' });
