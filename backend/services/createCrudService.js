const db = require('../db');

const pool = db.promise();

function normalizePayload(payload, fields) {
  return fields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field.name)) {
      const value = payload[field.name];
      acc[field.column || field.name] = typeof value === 'string' ? value.trim() : value;
    }
    return acc;
  }, {});
}

function createCrudService(config) {
  const table = config.table;
  const primaryKey = config.primaryKey || 'id';
  const fields = config.fields || [];
  const listColumns = [primaryKey, ...fields.map((field) => field.column || field.name)];
  const orderBy = config.orderBy || primaryKey;

  async function findAll() {
    const [rows] = await pool.query(
      `SELECT ${listColumns.join(', ')} FROM ${table} ORDER BY ${orderBy}`
    );
    return rows;
  }

  async function findById(id) {
    const [rows] = await pool.query(
      `SELECT ${listColumns.join(', ')} FROM ${table} WHERE ${primaryKey} = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async function create(payload) {
    const data = normalizePayload(payload, fields);
    const required = fields.filter((field) => field.required);
    const missing = required.filter((field) => {
      const value = data[field.column || field.name];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      const labels = missing.map((field) => field.label || field.name).join(', ');
      const error = new Error(`Champs obligatoires manquants: ${labels}.`);
      error.status = 400;
      throw error;
    }

    const columns = Object.keys(data);
    const values = Object.values(data).map((value) => (value === '' ? null : value));

    const [result] = await pool.query(
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      values
    );

    return findById(result.insertId);
  }

  async function update(id, payload) {
    const data = normalizePayload(payload, fields);
    const columns = Object.keys(data);

    if (columns.length === 0) {
      return findById(id);
    }

    const values = Object.values(data).map((value) => (value === '' ? null : value));
    values.push(id);

    const [result] = await pool.query(
      `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE ${primaryKey} = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return findById(id);
  }

  async function remove(id) {
    const [result] = await pool.query(`DELETE FROM ${table} WHERE ${primaryKey} = ?`, [id]);
    return result.affectedRows > 0;
  }

  return { findAll, findById, create, update, remove };
}

module.exports = createCrudService;
