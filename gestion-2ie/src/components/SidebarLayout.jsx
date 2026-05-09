import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faDownload, faGauge,
  faSchool, faUserGraduate, faBookOpen, faArrowsRotate,
  faFlask, faLayerGroup, faUsers, faRoute,
  faClipboardList, faMoneyBillWave, faEarthAfrica,
  faIdCard, faGavel, faCalendarDays, faFileSignature,
  faUserPlus, faPenToSquare, faListUl, faAward,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const resourceLinks = [
  { label: 'Écoles',             to: '/ressources/ecole',              icon: faSchool },
  { label: 'Étudiants',          to: '/ressources/etudiants',          icon: faUserGraduate },
  { label: 'Filières',           to: '/ressources/filieres',           icon: faBookOpen },
  { label: 'Cycles',             to: '/ressources/cycles',             icon: faArrowsRotate },
  { label: 'Spécialités',        to: '/ressources/specialites',        icon: faFlask },
  { label: 'Niveaux',            to: '/ressources/niveaux',            icon: faLayerGroup },
  { label: 'Classes',            to: '/ressources/classes',            icon: faUsers },
  { label: 'Parcours',           to: '/ressources/parcours',           icon: faRoute },
  { label: 'Notes',              to: '/ressources/notes',              icon: faClipboardList },
  { label: 'Paiements',          to: '/ressources/paiements',          icon: faMoneyBillWave },
  { label: 'Pays',               to: '/ressources/pays',               icon: faEarthAfrica },
  { label: 'Civilités',          to: '/ressources/civilites',          icon: faIdCard },
  { label: 'Décisions',          to: '/ressources/decisions',          icon: faGavel },
  { label: 'Années académiques', to: '/ressources/annees-academiques', icon: faCalendarDays },
  { label: 'Inscriptions',       to: '/ressources/inscriptions',       icon: faFileSignature },
];

const studentLinks = [
  { label: 'Ajouter un étudiant',       to: '/gestion-etudiants/ajouter-etudiants',         icon: faUserPlus },
  { label: 'Inscrire un étudiant',      to: '/gestion-etudiants/inscrire-etudiants',         icon: faPenToSquare },
  { label: 'Listes des étudiants',      to: '/gestion-etudiants/listes-etudiants',           icon: faListUl },
  { label: "Certificat d'inscription",  to: '/gestion-etudiants/editer-certificat-inscription', icon: faAward },
];

function SidebarGroup({ title, links }) {
  return (
    <div className="sidebar-group">
      <p className="sidebar-group-label">{title}</p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          {link.icon && (
            <FontAwesomeIcon icon={link.icon} className="sidebar-link-icon" aria-hidden="true" />
          )}
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function handleExport(url) {
  const token = localStorage.getItem('auth_token');
  window.open(`${API_BASE_URL}${url}?token=${token}`, '_blank');
}

export default function SidebarLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" />
          </div>
          <div>
            <div className="sidebar-brand-name">Gestion 2IE</div>
            <div className="sidebar-brand-sub">Administration</div>
          </div>
        </div>

        <div className="sidebar-body">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <FontAwesomeIcon icon={faGauge} className="sidebar-link-icon" aria-hidden="true" />
            Tableau de bord
          </NavLink>

          <SidebarGroup title="Ressources" links={resourceLinks} />
          <SidebarGroup title="Gestion Étudiants" links={studentLinks} />

          <div className="sidebar-group">
            <p className="sidebar-group-label">Exportations</p>
            <button onClick={() => handleExport('/api/export/etudiants/csv')} className="sidebar-export-btn">
              <FontAwesomeIcon icon={faDownload} className="sidebar-link-icon" aria-hidden="true" />
              Export Étudiants CSV
            </button>
            <button onClick={() => handleExport('/api/export/etudiants/excel')} className="sidebar-export-btn">
              <FontAwesomeIcon icon={faDownload} className="sidebar-link-icon" aria-hidden="true" />
              Export Étudiants Excel
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.nom)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nom || 'Utilisateur'}</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
          </div>
          <button type="button" className="sidebar-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
