const createCrudRouter = require('./createCrudRouter');
const service = require('../services/anneesAcademiquesService');

module.exports = createCrudRouter(service, { label: 'Annee academique', duplicateMessage: 'Une annee academique avec ce libelle existe deja.' });
