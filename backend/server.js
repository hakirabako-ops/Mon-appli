require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ecoleRoutes = require('./routes/ecole');
const filiereRoutes = require('./routes/filieres');
const cycleRoutes = require('./routes/cycles');
const specialiteRoutes = require('./routes/specialites');
const niveauRoutes = require('./routes/niveaux');
const paysRoutes = require('./routes/pays');
const anneeAcademiqueRoutes = require('./routes/anneesAcademiques');
const parcoursRoutes = require('./routes/parcours');
const etudiantRoutes = require('./routes/etudiants');
const inscriptionRoutes = require('./routes/inscriptions');
const civiliteRoutes = require('./routes/civilites');
const decisionRoutes = require('./routes/decisions');
const dashboardRoutes = require('./routes/dashboard');


const classeRoutes = require('./routes/classes');
const noteRoutes = require('./routes/notes');
const paiementRoutes = require('./routes/paiements');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ecoles', ecoleRoutes);
app.use('/api/filieres', filiereRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/specialites', specialiteRoutes);
app.use('/api/niveaux', niveauRoutes);
app.use('/api/pays', paysRoutes);
app.use('/api/annees-academiques', anneeAcademiqueRoutes);
app.use('/api/parcours', parcoursRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/civilites', civiliteRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/classes', classeRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/export', exportRoutes);

app.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});