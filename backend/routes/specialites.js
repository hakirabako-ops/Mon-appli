const createCrudRouter = require('./createCrudRouter');
const service = require('../services/specialitesService');

module.exports = createCrudRouter(service, { label: 'Specialite', duplicateMessage: 'Une specialite avec ce libelle existe deja.' });
