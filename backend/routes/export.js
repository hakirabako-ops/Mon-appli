const express = require('express');
const db = require('../db');
const pool = db.promise();

const router = express.Router();

router.get('/etudiants/csv', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.nom, e.prenoms, c.libelle as civilite, p.libelle as pays,
             e.email, e.telephone, e.date_naissance, e.created_at
      FROM etudiants e
      JOIN civilites c ON c.id = e.civilites_id
      JOIN pays p ON p.id = e.pays_id
      ORDER BY e.nom, e.prenoms
    `);
    
    let csv = 'ID,Nom,Prénoms,Civilité,Pays,Email,Téléphone,Date naissance,Date création\n';
    
    rows.forEach(row => {
      csv += `"${row.id}","${row.nom}","${row.prenoms}","${row.civilite}","${row.pays}","${row.email || ''}","${row.telephone || ''}","${row.date_naissance || ''}","${row.created_at}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=etudiants.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/etudiants/excel', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.nom, e.prenoms, c.libelle as civilite, p.libelle as pays,
             e.email, e.telephone, e.date_naissance, e.created_at
      FROM etudiants e
      JOIN civilites c ON c.id = e.civilites_id
      JOIN pays p ON p.id = e.pays_id
      ORDER BY e.nom, e.prenoms
    `);
    
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/inscriptions/:anneeId/csv', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.id, CONCAT(e.nom, ' ', e.prenoms) as etudiant, 
             p.libelle as parcours, a.libelle as annee,
             d.libelle as decision, i.date_inscription, i.montant_paye, i.statut_paiement
      FROM inscriptions i
      JOIN etudiants e ON e.id = i.etudiants_id
      JOIN parcours p ON p.id = i.parcours_id
      JOIN annee_academique a ON a.id = i.annee_academique_id
      JOIN decisions d ON d.id = i.decisions_id
      WHERE i.annee_academique_id = ?
      ORDER BY i.date_inscription DESC
    `, [req.params.anneeId]);
    
    let csv = 'ID,Étudiant,Parcours,Année,Décision,Date inscription,Montant payé,Statut paiement\n';
    
    rows.forEach(row => {
      csv += `"${row.id}","${row.etudiant}","${row.parcours}","${row.annee}","${row.decision}","${row.date_inscription}","${row.montant_paye || 0}","${row.statut_paiement || 'impayé'}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=inscriptions.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/dashboard/stats', async (req, res) => {
  try {
    const [etudiants] = await pool.query('SELECT COUNT(*) as total FROM etudiants');
    const [inscriptions] = await pool.query('SELECT COUNT(*) as total FROM inscriptions');
    const [filieres] = await pool.query('SELECT COUNT(*) as total FROM filieres');
    const [ecoles] = await pool.query('SELECT COUNT(*) as total FROM ecoles');
    
    res.json({
      etudiants: etudiants[0].total,
      inscriptions: inscriptions[0].total,
      filieres: filieres[0].total,
      ecoles: ecoles[0].total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;