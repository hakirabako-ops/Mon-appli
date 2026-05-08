const db = require('../db');

const pool = db.promise();

function mapPayload(payload) {
  return {
    libelle: payload.libelle?.trim(),
    adresse: payload.adresse?.trim() || null,
    telephone: (payload.telephone || payload.contact)?.trim() || null,
    email: payload.email?.trim() || null,
    code: payload.code?.trim() || null,
  };
}

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, libelle, adresse, telephone, email, code FROM ecoles ORDER BY libelle ASC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, libelle, adresse, telephone, email, code FROM ecoles WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create(payload) {
  const data = mapPayload(payload);

  if (!data.libelle) {
    const error = new Error('Le libelle est obligatoire.');
    error.status = 400;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO ecoles (libelle, adresse, telephone, email, code) VALUES (?, ?, ?, ?, ?)',
    [data.libelle, data.adresse, data.telephone, data.email, data.code]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  const data = mapPayload(payload);

  if (!data.libelle) {
    const error = new Error('Le libelle est obligatoire.');
    error.status = 400;
    throw error;
  }

  const [result] = await pool.query(
    'UPDATE ecoles SET libelle = ?, adresse = ?, telephone = ?, email = ?, code = ? WHERE id = ?',
    [data.libelle, data.adresse, data.telephone, data.email, data.code, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM ecoles WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
