const db = require('../db');
const pool = db.promise();

async function findAll() {
  const [rows] = await pool.query(`
    SELECT p.*, i.etudiants_id, i.parcours_id, i.annee_academique_id,
           e.nom, e.prenoms, a.libelle as annee_libelle
    FROM paiements p
    JOIN inscriptions i ON i.id = p.inscription_id
    JOIN etudiants e ON e.id = i.etudiants_id
    JOIN annee_academique a ON a.id = i.annee_academique_id
    ORDER BY p.date_paiement DESC
  `);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`
    SELECT p.*, i.etudiants_id, i.parcours_id, i.annee_academique_id,
           e.nom, e.prenoms, a.libelle as annee_libelle
    FROM paiements p
    JOIN inscriptions i ON i.id = p.inscription_id
    JOIN etudiants e ON e.id = i.etudiants_id
    JOIN annee_academique a ON a.id = i.annee_academique_id
    WHERE p.id = ?
  `, [id]);
  return rows[0] || null;
}

async function getPaiementsByInscription(inscriptionId) {
  const [rows] = await pool.query(`
    SELECT * FROM paiements 
    WHERE inscription_id = ? 
    ORDER BY date_paiement DESC
  `, [inscriptionId]);
  return rows;
}

async function getTotalPayeByInscription(inscriptionId) {
  const [rows] = await pool.query(
    'SELECT COALESCE(SUM(montant), 0) as total FROM paiements WHERE inscription_id = ? AND statut = "valide"',
    [inscriptionId]
  );
  return parseFloat(rows[0]?.total || 0);
}

async function create(data) {
  const { inscription_id, montant, date_paiement, mode_paiement, reference, commentaire } = data;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.query(
      `INSERT INTO paiements (inscription_id, montant, date_paiement, mode_paiement, reference, commentaire)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [inscription_id, montant, date_paiement, mode_paiement || 'especes', reference, commentaire]
    );
    
    const totalPaye = await getTotalPayeByInscription(inscription_id);
    
    const [inscription] = await connection.query(
      'SELECT montant_paye, statut_paiement FROM inscriptions WHERE id = ?',
      [inscription_id]
    );
    
    const nouveauTotal = (parseFloat(inscription[0]?.montant_paye || 0) + parseFloat(montant));
    await connection.query(
      'UPDATE inscriptions SET montant_paye = ? WHERE id = ?',
      [nouveauTotal, inscription_id]
    );
    
    await connection.commit();
    return findById(result.insertId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function update(id, data) {
  const { montant, date_paiement, mode_paiement, reference, statut, commentaire } = data;
  
  const [result] = await pool.query(
    `UPDATE paiements 
     SET montant = ?, date_paiement = ?, mode_paiement = ?, reference = ?, statut = ?, commentaire = ?
     WHERE id = ?`,
    [montant, date_paiement, mode_paiement, reference, statut, commentaire, id]
  );
  
  if (result.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [paiement] = await pool.query('SELECT inscription_id, montant FROM paiements WHERE id = ?', [id]);
  
  if (paiement.length === 0) return false;
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query('DELETE FROM paiements WHERE id = ?', [id]);
    
    const totalPaye = await getTotalPayeByInscription(paiement[0].inscription_id);
    await connection.query(
      'UPDATE inscriptions SET montant_paye = ? WHERE id = ?',
      [totalPaye, paiement[0].inscription_id]
    );
    
    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  findAll, findById, create, update, remove,
  getPaiementsByInscription, getTotalPayeByInscription
};