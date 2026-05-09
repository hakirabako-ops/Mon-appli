import { useEffect, useMemo, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faClipboardList,
  faGraduationCap,
  faHand,
  faSchool,
  faUsers,
  faMoneyBillWave,
  faFileAlt,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import Spinner from '../components/Spinner';

const quickLinks = [
  { label: 'Gerer les ecoles', to: '/ressources/ecole' },
  { label: 'Voir les etudiants', to: '/ressources/etudiants' },
  { label: 'Ajouter un etudiant', to: '/gestion-etudiants/ajouter-etudiants' },
  { label: 'Listes etudiants', to: '/gestion-etudiants/listes-etudiants' },
  { label: 'Inscriptions', to: '/ressources/inscriptions' },
  { label: 'Annees academiques', to: '/ressources/annees-academiques' },
  { label: 'Gerer les classes', to: '/ressources/classes' },
  { label: 'Notes et évaluations', to: '/ressources/notes' },
  { label: 'Suivi des paiements', to: '/ressources/paiements' },
];

const numberFormatter = new Intl.NumberFormat('fr-FR');

function formatNumber(value) {
  return numberFormatter.format(Number(value || 0));
}

function formatMoney(value) {
  return `${formatNumber(value)} FCFA`;
}

function formatDate(value) {
  if (!value) {
    return 'Recent';
  }

  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function HorizontalBars({ items, emptyText }) {
  const maxValue = Math.max(1, ...items.map((item) => item.total));

  if (items.length === 0) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="dashboard-chart">
      {items.map((item) => (
        <div key={item.label} className="chart-row">
          <span className="chart-label" title={item.label}>{item.label}</span>
          <div className="chart-track">
            <div className="chart-bar" style={{ width: `${Math.max(6, (item.total / maxValue) * 100)}%` }} />
          </div>
          <span className="chart-value">{formatNumber(item.total)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [activeYearId, setActiveYearId] = useState('');
  const [charts, setCharts] = useState({
    inscriptionsParAnnee: [],
    paiements: [],
    topFilieres: [],
    repartitionCycles: [],
  });
  const [loading, setLoading] = useState(true);
  const [savingYear, setSavingYear] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');
      const [statsData, inscriptionsData, chartsData, yearsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getChartData(),
        dashboardService.getAcademicYears(),
      ]);

      setStats(statsData);
      setInscriptions(Array.isArray(inscriptionsData) ? inscriptionsData : []);
      setCharts(chartsData || {});
      setAcademicYears(Array.isArray(yearsData) ? yearsData : []);
      setActiveYearId(statsData?.anneeAcademique?.id ? String(statsData.anneeAcademique.id) : '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleActiveYearSave() {
    if (!activeYearId) {
      setError('Selectionnez une annee academique.');
      return;
    }

    try {
      setSavingYear(true);
      setError('');
      setMessage('');
      await dashboardService.setActiveAcademicYear(activeYearId);
      await loadDashboard();
      setMessage('Annee academique active mise a jour.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingYear(false);
    }
  }

  const statCards = useMemo(() => {
    const yearLabel = stats?.anneeAcademique?.libelle || 'Toutes annees';

    return [
      { label: 'Étudiants',      value: stats?.etudiants,         sub: 'Total étudiants',     iconClass: 'stat-icon-blue',   icon: faGraduationCap, to: '/ressources/etudiants' },
      { label: 'Écoles',         value: stats?.ecoles,            sub: 'Établissements',       iconClass: 'stat-icon-amber',  icon: faSchool,        to: '/ressources/ecole' },
      { label: 'Filières',       value: stats?.filieres,          sub: 'Programmes',           iconClass: 'stat-icon-green',  icon: faBookOpen,      to: '/ressources/filieres' },
      { label: 'Inscriptions',   value: stats?.inscriptions,      sub: yearLabel,              iconClass: 'stat-icon-red',    icon: faClipboardList, to: '/ressources/inscriptions' },
      { label: 'Classes',        value: stats?.classes || 0,      sub: "Groupes d'étudiants",  iconClass: 'stat-icon-purple', icon: faUsers,         to: '/ressources/classes' },
      { label: 'Notes',          value: stats?.notes || 0,        sub: 'Évaluations saisies',  iconClass: 'stat-icon-teal',   icon: faFileAlt,       to: '/ressources/notes' },
      { label: 'Total encaissé', value: stats?.montantPaye || 0,  sub: yearLabel,              iconClass: 'stat-icon-green',  icon: faMoneyBillWave, to: '/ressources/paiements', isMoney: true },
    ];
  }, [stats]);

  const inscriptionsParAnnee = charts.inscriptionsParAnnee || [];
  const topFilieres = charts.topFilieres || [];
  const repartitionCycles = charts.repartitionCycles || [];
  const paiements = charts.paiements || [];
  const cycleTotal = repartitionCycles.reduce((sum, item) => sum + item.total, 0);

  // Format value with money if needed
  const formatStatValue = (card) => {
    if (loading) return '...';
    if (card.isMoney) return formatMoney(card.value);
    return formatNumber(card.value);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Tableau de bord</p>
          <h1 className="page-title">
            Bonjour, {user?.nom?.split(' ')[0] || 'Admin'} <FontAwesomeIcon icon={faHand} aria-hidden="true" />
          </h1>
          <p className="page-desc">Bienvenue sur la plateforme de gestion academique 2IE.</p>
        </div>

        <div className="active-year-panel">
          <span className="active-year-label">Annee active</span>
          <div className="active-year-value">{stats?.anneeAcademique?.libelle || 'Non definie'}</div>
          <div className="active-year-controls">
            <select value={activeYearId} onChange={(event) => setActiveYearId(event.target.value)} disabled={loading || savingYear}>
              <option value="">Choisir une annee</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>{year.libelle}</option>
              ))}
            </select>
            <button type="button" className="btn-primary" onClick={handleActiveYearSave} disabled={loading || savingYear || !activeYearId}>
              {savingYear ? 'Mise a jour...' : 'Activer'}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="feedback feedback-error">{error}</div>}
      {message && <div className="feedback feedback-success">{message}</div>}

      <div className="dashboard-stats">
        {statCards.map((s) => (
          <Link key={s.label} to={s.to} className="stat-card-link">
            <div className="stat-card">
              <div className={`stat-card-icon ${s.iconClass}`}>
                <FontAwesomeIcon icon={s.icon} aria-hidden="true" />
              </div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{formatStatValue(s)}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-main">
        <div className="card">
          <div className="card-title">
            <FontAwesomeIcon icon={faChartLine} aria-hidden="true" />
            Inscriptions par annee academique
          </div>
          {loading ? <div className="empty-state"><Spinner size="sm" text="Chargement..." /></div> : (
            <HorizontalBars items={inscriptionsParAnnee} emptyText="Aucune inscription disponible." />
          )}
        </div>

        <div className="card">
          <div className="card-title">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
            Top 5 filieres demandees
          </div>
          {loading ? <div className="empty-state"><Spinner size="sm" text="Chargement..." /></div> : (
            <HorizontalBars items={topFilieres} emptyText="Aucune filiere demandee." />
          )}
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-main">
        <div className="card">
          <div className="card-title">
            <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" />
            Repartition etudiants par cycle
          </div>
          {loading ? (
            <div className="empty-state"><Spinner size="sm" text="Chargement..." /></div>
          ) : repartitionCycles.length === 0 ? (
            <div className="empty-state">Aucune repartition disponible.</div>
          ) : (
            <div className="cycle-chart">
              <HorizontalBars items={repartitionCycles} emptyText="Aucune repartition disponible." />
              <div className="cycle-total">
                <span>Total</span>
                <strong>{formatNumber(cycleTotal)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">
            <FontAwesomeIcon icon={faMoneyBillWave} aria-hidden="true" />
            Statut des paiements
          </div>
          {loading ? <div className="empty-state"><Spinner size="sm" text="Chargement..." /></div> : (
            <div className="payment-list">
              {paiements.length === 0 ? (
                <div className="empty-state">Aucune donnee disponible.</div>
              ) : paiements.map((item) => (
                <div key={item.label} className="payment-item">
                  <span>{item.label}</span>
                  <strong>{formatNumber(item.total)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">5 dernieres inscriptions</div>
          {loading ? (
            <div className="empty-state"><Spinner size="sm" text="Chargement..." /></div>
          ) : inscriptions.length === 0 ? (
            <div className="empty-state">Aucune inscription recente.</div>
          ) : (
            <div className="recent-inscriptions">
              {inscriptions.map((item) => (
                <div key={item.id} className="recent-inscription-item">
                  <div>
                    <div className="recent-inscription-name">{item.etudiant}</div>
                    <div className="recent-inscription-meta">{item.parcours} - {item.annee}</div>
                  </div>
                  <div className="recent-inscription-side">
                    <span>{formatDate(item.time)}</span>
                    <strong>{formatMoney(item.montantPaye)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Acces rapides</div>
          <div className="quick-link-grid">
            {quickLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="quick-link">
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}