const express = require('express');
const dashboardService = require('../services/dashboardService');

const router = express.Router();

function handleError(res, err) {
  res.status(err.status || 500).json({
    message: 'Impossible de charger les indicateurs du tableau de bord.',
    erreur: err.status ? undefined : err.message,
  });
}

router.get('/stats', async (req, res) => {
  try {
    res.json(await dashboardService.getStats());
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/activities', async (req, res) => {
  try {
    res.json(await dashboardService.getRecentActivities());
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/charts', async (req, res) => {
  try {
    res.json(await dashboardService.getChartData());
  } catch (err) {
    handleError(res, err);
  }
});

router.get('/academic-years', async (req, res) => {
  try {
    res.json(await dashboardService.getAcademicYears());
  } catch (err) {
    handleError(res, err);
  }
});

router.patch('/active-year', async (req, res) => {
  try {
    res.json(await dashboardService.setActiveAcademicYear(req.body.id));
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
