const express = require('express');

function handleError(res, err, duplicateMessage) {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: duplicateMessage || 'Cette valeur existe deja.' });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'Cet element est utilise ailleurs et ne peut pas etre supprime.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Erreur serveur.',
    erreur: err.status ? undefined : err.message,
  });
}

function createCrudRouter(service, options = {}) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      res.json(await service.findAll());
    } catch (err) {
      handleError(res, err, options.readError);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const item = await service.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: `${options.label || 'Element'} introuvable.` });
      }
      return res.json(item);
    } catch (err) {
      return handleError(res, err, options.readError);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (err) {
      handleError(res, err, options.duplicateMessage);
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updated = await service.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: `${options.label || 'Element'} introuvable.` });
      }
      return res.json(updated);
    } catch (err) {
      return handleError(res, err, options.duplicateMessage);
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await service.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: `${options.label || 'Element'} introuvable.` });
      }
      return res.json({ message: `${options.label || 'Element'} supprime avec succes.` });
    } catch (err) {
      return handleError(res, err, options.duplicateMessage);
    }
  });

  return router;
}

module.exports = createCrudRouter;
