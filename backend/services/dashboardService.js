// backend/services/dashboardService.js
const db = require('../db');

const pool = db.promise();

async function count(table, where = '') {
  try {
    const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${table} ${where}`);
    return Number(rows[0]?.total || 0);
  } catch (err) {
    console.error(`Erreur count sur ${table}:`, err.message);
    return 0; // Retourne 0 si la table n'existe pas
  }
}

async function getActiveAcademicYear() {
  try {
    const [rows] = await pool.query(
      `SELECT id, libelle, date_debut, date_fin, est_active
       FROM annee_academique
       WHERE est_active = 1
       ORDER BY date_debut DESC
       LIMIT 1`
    );
    return rows[0] || null;
  } catch (err) {
    console.error('Erreur getActiveAcademicYear:', err.message);
    return null;
  }
}

async function getAcademicYears() {
  try {
    const [rows] = await pool.query(
      `SELECT id, libelle, date_debut, date_fin, est_active
       FROM annee_academique
       ORDER BY date_debut DESC`
    );
    return rows;
  } catch (err) {
    console.error('Erreur getAcademicYears:', err.message);
    return [];
  }
}

async function setActiveAcademicYear(id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      'SELECT id, libelle, date_debut, date_fin, est_active FROM annee_academique WHERE id = ?',
      [id]
    );

    if (!rows[0]) {
      const error = new Error('Annee academique introuvable.');
      error.status = 404;
      throw error;
    }

    await connection.query('UPDATE annee_academique SET est_active = 0');
    await connection.query('UPDATE annee_academique SET est_active = 1 WHERE id = ?', [id]);
    await connection.commit();

    return { ...rows[0], est_active: 1 };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getStats() {
  try {
    const activeYear = await getActiveAcademicYear();
    const inscriptionWhere = activeYear ? `WHERE annee_academique_id = ${Number(activeYear.id)}` : '';

    // Récupère chaque statistique individuellement pour éviter les erreurs
    const etudiants = await count('etudiants');
    const ecoles = await count('ecoles');
    const filieres = await count('filieres');
    const inscriptions = await count('inscriptions', inscriptionWhere);
    
    // Tables optionnelles (peuvent ne pas exister encore)
    let classes = 0;
    let notes = 0;
    
    try {
      classes = await count('classes');
    } catch (err) {
      console.log('Table classes non trouvée, ignore');
    }
    
    try {
      notes = await count('notes');
    } catch (err) {
      console.log('Table notes non trouvée, ignore');
    }
    
    // Montant payé
    let montantPaye = 0;
    try {
      const [montantRows] = await pool.query(`SELECT COALESCE(SUM(montant_paye), 0) AS total FROM inscriptions ${inscriptionWhere}`);
      montantPaye = Number(montantRows[0]?.total || 0);
    } catch (err) {
      console.error('Erreur calcul montant:', err.message);
    }

    return {
      etudiants,
      ecoles,
      filieres,
      inscriptions,
      classes,
      notes,
      montantPaye,
      anneeAcademique: activeYear,
    };
  } catch (err) {
    console.error('Erreur dans getStats():', err);
    throw err;
  }
}

async function getRecentActivities() {
  try {
    const [inscriptions] = await pool.query(
      `SELECT i.id, i.date_inscription, i.created_at, i.montant_paye, i.statut_paiement,
              e.nom, e.prenoms,
              a.libelle AS annee,
              p.libelle AS parcours,
              d.libelle AS decision
       FROM inscriptions i
       JOIN etudiants e ON e.id = i.etudiants_id
       JOIN annee_academique a ON a.id = i.annee_academique_id
       JOIN parcours p ON p.id = i.parcours_id
       JOIN decisions d ON d.id = i.decisions_id
       ORDER BY i.created_at DESC, i.date_inscription DESC
       LIMIT 5`
    );

    return inscriptions.map((row) => ({
      id: `inscription-${row.id}`,
      etudiant: `${row.nom} ${row.prenoms}`,
      parcours: row.parcours,
      annee: row.annee,
      decision: row.decision,
      montantPaye: Number(row.montant_paye || 0),
      statutPaiement: row.statut_paiement,
      text: `${row.nom} ${row.prenoms} inscrit en ${row.annee}`,
      time: row.date_inscription,
      type: 'inscription',
    }));
  } catch (err) {
    console.error('Erreur getRecentActivities:', err);
    return [];
  }
}

async function getChartData() {
  try {
    const activeYear = await getActiveAcademicYear();
    const activeYearFilter = activeYear ? 'WHERE i.annee_academique_id = ?' : '';
    const activeYearParams = activeYear ? [activeYear.id] : [];

    const [inscriptionsParAnnee] = await pool.query(
      `SELECT a.libelle AS label, COUNT(i.id) AS total
       FROM annee_academique a
       LEFT JOIN inscriptions i ON i.annee_academique_id = a.id
       GROUP BY a.id, a.libelle, a.date_debut
       ORDER BY a.date_debut ASC`
    );

    const [paiements] = await pool.query(
      `SELECT COALESCE(NULLIF(TRIM(statut_paiement), ''), 'Non renseigne') AS label,
              COUNT(*) AS total
       FROM inscriptions
       GROUP BY COALESCE(NULLIF(TRIM(statut_paiement), ''), 'Non renseigne')
       ORDER BY total DESC`
    );

    const [topFilieres] = await pool.query(
      `SELECT f.libelle AS label, COUNT(i.id) AS total
       FROM inscriptions i
       JOIN parcours p ON p.id = i.parcours_id
       JOIN specialites s ON s.id = p.specialites_id
       JOIN filieres f ON f.id = s.filieres_id
       ${activeYearFilter}
       GROUP BY f.id, f.libelle
       ORDER BY total DESC, f.libelle ASC
       LIMIT 5`,
      activeYearParams
    );

    const [repartitionCycles] = await pool.query(
      `SELECT c.libelle AS label, COUNT(DISTINCT i.etudiants_id) AS total
       FROM inscriptions i
       JOIN parcours p ON p.id = i.parcours_id
       JOIN niveaux n ON n.id = p.niveaux_id
       JOIN cycles c ON c.id = n.cycles_id
       ${activeYearFilter}
       GROUP BY c.id, c.libelle
       ORDER BY total DESC, c.libelle ASC`,
      activeYearParams
    );

    return {
      inscriptionsParAnnee: inscriptionsParAnnee.map((row) => ({
        label: row.label,
        total: Number(row.total || 0),
      })),
      paiements: paiements.map((row) => ({
        label: row.label,
        total: Number(row.total || 0),
      })),
      topFilieres: topFilieres.map((row) => ({
        label: row.label,
        total: Number(row.total || 0),
      })),
      repartitionCycles: repartitionCycles.map((row) => ({
        label: row.label,
        total: Number(row.total || 0),
      })),
      filtreAnneeActive: activeYear,
    };
  } catch (err) {
    console.error('Erreur getChartData:', err);
    return {
      inscriptionsParAnnee: [],
      paiements: [],
      topFilieres: [],
      repartitionCycles: [],
      filtreAnneeActive: null,
    };
  }
}

module.exports = {
  getStats,
  getRecentActivities,
  getChartData,
  getAcademicYears,
  setActiveAcademicYear,
};