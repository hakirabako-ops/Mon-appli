const express = require('express');
const notesService = require('../services/notesService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json(await notesService.findAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await notesService.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Note introuvable' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/etudiant/:etudiantId', async (req, res) => {
  try {
    const { annee_id } = req.query;
    res.json(await notesService.getNotesByEtudiant(req.params.etudiantId, annee_id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/etudiant/:etudiantId/moyenne', async (req, res) => {
  try {
    const { annee_id } = req.query;
    const moyenne = await notesService.getMoyenneByEtudiant(req.params.etudiantId, annee_id);
    res.json({ moyenne });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await notesService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await notesService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Note introuvable' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await notesService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Note introuvable' });
    res.json({ message: 'Note supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;