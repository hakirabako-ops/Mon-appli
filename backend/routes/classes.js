const express = require('express');
const classesService = require('../services/classesService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json(await classesService.findAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await classesService.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Classe introuvable' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/etudiants', async (req, res) => {
  try {
    res.json(await classesService.getEtudiants(req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const created = await classesService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await classesService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Classe introuvable' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await classesService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Classe introuvable' });
    res.json({ message: 'Classe supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/etudiants', async (req, res) => {
  try {
    const { etudiant_id, date_affectation } = req.body;
    await classesService.addEtudiant(req.params.id, etudiant_id, date_affectation);
    res.status(201).json({ message: 'Étudiant ajouté à la classe' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:classeId/etudiants/:etudiantId', async (req, res) => {
  try {
    const deleted = await classesService.removeEtudiant(req.params.classeId, req.params.etudiantId);
    if (!deleted) return res.status(404).json({ message: 'Étudiant non trouvé dans cette classe' });
    res.json({ message: 'Étudiant retiré de la classe' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;