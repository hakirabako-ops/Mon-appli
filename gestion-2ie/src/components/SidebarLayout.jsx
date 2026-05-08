// SidebarLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faDownload } from '@fortawesome/free-solid-svg-icons'; // 👈 Ajoute faDownload
import { useAuth } from '../context/AuthContext';

const resourceLinks = [
  { label: 'Ecole', to: '/ressources/ecole' },
  { label: 'Etudiants', to: '/ressources/etudiants' },
  { label: 'Filieres', to: '/ressources/filieres' },
  { label: 'Cycles', to: '/ressources/cycles' },
  { label: 'Specialites', to: '/ressources/specialites' },
  { label: 'Niveaux', to: '/ressources/niveaux' },
  { label: 'Classes', to: '/ressources/classes' },
  { label: 'Parcours', to: '/ressources/parcours' },
  { label: 'Notes', to: '/ressources/notes' },
  { label: 'Paiements', to: '/ressources/paiements' },
  { label: 'Pays', to: '/ressources/pays' },
  { label: 'Civilites', to: '/ressources/civilites' },
  { label: 'Decisions', to: '/ressources/decisions' },
  { label: 'Annees Academiques', to: '/ressources/annees-academiques' },
  { label: 'Inscriptions', to: '/ressources/inscriptions' },
];

const studentLinks = [
  { label: 'Ajouter Etudiants', to: '/gestion-etudiants/ajouter-etudiants' },
  { label: 'Inscrire Etudiants', to: '/gestion-etudiants/inscrire-etudiants' },
  { label: 'Listes Etudiants', to: '/gestion-etudiants/listes-etudiants' },
  { label: "Certificat d'Inscription", to: '/gestion-etudiants/editer-certificat-inscription' },
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
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
            Tableau de bord
          </NavLink>
          <SidebarGroup title="Ressources" links={resourceLinks} />
          <SidebarGroup title="Gestion Etudiants" links={studentLinks} />
          
          {/* 🟢 NOUVEAU : Groupe Exportations */}
          <div className="sidebar-group">
            <p className="sidebar-group-label">Exportations</p>
            <button 
              onClick={() => handleExport('/api/export/etudiants/csv')}
              className="sidebar-link"
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
              Export Étudiants CSV
            </button>
            <button 
              onClick={() => handleExport('/api/export/etudiants/excel')}
              className="sidebar-link"
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
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