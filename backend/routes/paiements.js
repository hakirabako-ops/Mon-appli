const express = require('express');
const paiementsService = require('../services/paiementsService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json(await paiementsService.findAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await paiementsService.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Paiement introuvable' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/inscription/:inscriptionId', async (req, res) => {
  try {
    res.json(await paiementsService.getPaiementsByInscription(req.params.inscriptionId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await paiementsService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await paiementsService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Paiement introuvable' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await paiementsService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Paiement introuvable' });
    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;