const createCrudRouter = require('./createCrudRouter');
const service = require('../services/paysService');

module.exports = createCrudRouter(service, { label: 'Pays', duplicateMessage: 'Un pays avec ce libelle existe deja.' });
