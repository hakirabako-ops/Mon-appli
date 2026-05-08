const db = require('../db');
const pool = db.promise();

async function findAll() {
  const [rows] = await pool.query(`
    SELECT c.*, p.libelle as parcours_libelle, a.libelle as annee_libelle
    FROM classes c
    JOIN parcours p ON p.id = c.parcours_id
    JOIN annee_academique a ON a.id = c.annee_academique_id
    ORDER BY c.libelle ASC
  `);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`
    SELECT c.*, p.libelle as parcours_libelle, a.libelle as annee_libelle
    FROM classes c
    JOIN parcours p ON p.id = c.parcours_id
    JOIN annee_academique a ON a.id = c.annee_academique_id
    WHERE c.id = ?
  `, [id]);
  return rows[0] || null;
}

async function getEtudiants(classeId) {
  const [rows] = await pool.query(`
    SELECT e.*, ce.date_affectation, ce.statut
    FROM classes_etudiants ce
    JOIN etudiants e ON e.id = ce.etudiant_id
    WHERE ce.classe_id = ? AND ce.statut = 'actif'
  `, [classeId]);
  return rows;
}

async function addEtudiant(classeId, etudiantId, dateAffectation) {
  const [existing] = await pool.query(
    'SELECT id FROM classes_etudiants WHERE classe_id = ? AND etudiant_id = ?',
    [classeId, etudiantId]
  );
  
  if (existing.length > 0) {
    throw new Error('Cet étudiant est déjà dans cette classe');
  }
  
  const [result] = await pool.query(
    'INSERT INTO classes_etudiants (classe_id, etudiant_id, date_affectation) VALUES (?, ?, ?)',
    [classeId, etudiantId, dateAffectation]
  );
  
  await pool.query('UPDATE classes SET effectif_actuel = effectif_actuel + 1 WHERE id = ?', [classeId]);
  
  return result;
}

async function removeEtudiant(classeId, etudiantId) {
  const [result] = await pool.query(
    'DELETE FROM classes_etudiants WHERE classe_id = ? AND etudiant_id = ?',
    [classeId, etudiantId]
  );
  
  if (result.affectedRows > 0) {
    await pool.query('UPDATE classes SET effectif_actuel = effectif_actuel - 1 WHERE id = ?', [classeId]);
  }
  
  return result.affectedRows > 0;
}

async function create(data) {
  const { libelle, code, parcours_id, annee_academique_id, capacite_max, description } = data;
  
  const [result] = await pool.query(
    `INSERT INTO classes (libelle, code, parcours_id, annee_academique_id, capacite_max, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [libelle, code, parcours_id, annee_academique_id, capacite_max || 30, description]
  );
  
  return findById(result.insertId);
}

async function update(id, data) {
  const { libelle, code, parcours_id, annee_academique_id, capacite_max, description } = data;
  
  const [result] = await pool.query(
    `UPDATE classes 
     SET libelle = ?, code = ?, parcours_id = ?, annee_academique_id = ?, capacite_max = ?, description = ?
     WHERE id = ?`,
    [libelle, code, parcours_id, annee_academique_id, capacite_max, description, id]
  );
  
  if (result.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM classes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll, findById, create, update, remove,
  getEtudiants, addEtudiant, removeEtudiant
};