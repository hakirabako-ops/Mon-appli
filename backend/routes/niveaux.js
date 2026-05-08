const createCrudRouter = require('./createCrudRouter');
const service = require('../services/niveauxService');

module.exports = createCrudRouter(service, { label: 'Niveau', duplicateMessage: 'Un niveau avec ce libelle existe deja.' });
