const db = require('../db');
const pool = db.promise();

async function findAll() {
  const [rows] = await pool.query(`
    SELECT n.*, e.nom, e.prenoms, a.libelle as annee_libelle
    FROM notes n
    JOIN etudiants e ON e.id = n.etudiant_id
    JOIN annee_academique a ON a.id = n.annee_academique_id
    ORDER BY n.date_saisie DESC
  `);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`
    SELECT n.*, e.nom, e.prenoms, a.libelle as annee_libelle
    FROM notes n
    JOIN etudiants e ON e.id = n.etudiant_id
    JOIN annee_academique a ON a.id = n.annee_academique_id
    WHERE n.id = ?
  `, [id]);
  return rows[0] || null;
}

async function getNotesByEtudiant(etudiantId, anneeAcademiqueId = null) {
  let query = `
    SELECT n.*, a.libelle as annee_libelle
    FROM notes n
    JOIN annee_academique a ON a.id = n.annee_academique_id
    WHERE n.etudiant_id = ?
  `;
  const params = [etudiantId];
  
  if (anneeAcademiqueId) {
    query += ' AND n.annee_academique_id = ?';
    params.push(anneeAcademiqueId);
  }
  
  query += ' ORDER BY n.semestre, n.matiere';
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function getMoyenneByEtudiant(etudiantId, anneeAcademiqueId) {
  const [rows] = await pool.query(`
    SELECT 
      SUM(n.note * n.coefficient) / SUM(n.coefficient) as moyenne,
      SUM(n.coefficient) as total_coefficients
    FROM notes n
    WHERE n.etudiant_id = ? AND n.annee_academique_id = ?
  `, [etudiantId, anneeAcademiqueId]);
  
  return rows[0]?.moyenne ? parseFloat(rows[0].moyenne).toFixed(2) : null;
}

async function create(data) {
  const { etudiant_id, matiere, note, note_max, coefficient, type_note, semestre, annee_academique_id, commentaire } = data;
  
  const [result] = await pool.query(
    `INSERT INTO notes (etudiant_id, matiere, note, note_max, coefficient, type_note, semestre, annee_academique_id, commentaire)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [etudiant_id, matiere, note, note_max || 20, coefficient || 1, type_note || 'devoir', semestre, annee_academique_id, commentaire]
  );
  
  return findById(result.insertId);
}

async function update(id, data) {
  const { matiere, note, note_max, coefficient, type_note, semestre, commentaire } = data;
  
  const [result] = await pool.query(
    `UPDATE notes 
     SET matiere = ?, note = ?, note_max = ?, coefficient = ?, type_note = ?, semestre = ?, commentaire = ?
     WHERE id = ?`,
    [matiere, note, note_max, coefficient, type_note, semestre, commentaire, id]
  );
  
  if (result.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll, findById, create, update, remove,
  getNotesByEtudiant, getMoyenneByEtudiant
};