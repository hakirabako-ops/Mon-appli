const createCrudRouter = require('./createCrudRouter');
const service = require('../services/filieresService');

module.exports = createCrudRouter(service, { label: 'Filiere', duplicateMessage: 'Une filiere avec ce libelle existe deja.' });
