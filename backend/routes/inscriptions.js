const createCrudRouter = require('./createCrudRouter');
const service = require('../services/inscriptionsService');

module.exports = createCrudRouter(service, { label: 'Inscription' });
