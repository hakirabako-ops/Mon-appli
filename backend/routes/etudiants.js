const createCrudRouter = require('./createCrudRouter');
const service = require('../services/etudiantsService');

module.exports = createCrudRouter(service, { label: 'Etudiant' });
