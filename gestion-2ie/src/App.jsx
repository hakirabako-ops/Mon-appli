import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './components/SidebarLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EcolePage from './pages/EcolePage';
import FilieresPage from './pages/FilieresPage';
import CyclesPage from './pages/CyclesPage';
import SpecialitesPage from './pages/SpecialitesPage';
import NiveauxPage from './pages/NiveauxPage';
import PaysPage from './pages/PaysPage';
import AnneesAcademiquesPage from './pages/AnneesAcademiquesPage';
import ParcoursPage from './pages/ParcoursPage';
import EtudiantsPage from './pages/EtudiantsPage';
import InscriptionsPage from './pages/InscriptionsPage';
import CivilitesPage from './pages/CivilitesPage';
import DecisionsPage from './pages/DecisionsPage';
import CertificatInscriptionPage from './pages/CertificatInscriptionPage';
import ClassePage from './pages/ClassePage';
import NotesPage from './pages/NotesPage';
import PaiementsPage from './pages/PaiementsPage';
import AjoutEtudiantPage from './pages/AjoutEtudiantPage';
import ListesEtudiantsPage from './pages/ListesEtudiantsPage';
import InscrireEtudiantPage from './pages/InscrireEtudiantPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<SidebarLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/ressources/ecole" element={<EcolePage />} />
              <Route path="/ressources/filieres" element={<FilieresPage />} />
              <Route path="/ressources/cycles" element={<CyclesPage />} />
              <Route path="/ressources/specialites" element={<SpecialitesPage />} />
              <Route path="/ressources/niveaux" element={<NiveauxPage />} />
              <Route path="/ressources/pays" element={<PaysPage />} />
              <Route path="/ressources/annees-academiques" element={<AnneesAcademiquesPage />} />
              <Route path="/ressources/parcours" element={<ParcoursPage />} />
              <Route path="/ressources/etudiants" element={<EtudiantsPage />} />
              <Route path="/ressources/inscriptions" element={<InscriptionsPage />} />
              <Route path="/ressources/civilites" element={<CivilitesPage />} />
              <Route path="/ressources/decisions" element={<DecisionsPage />} />
              <Route path="/ressources/classes" element={<ClassePage />} />
              <Route path="/ressources/notes" element={<NotesPage />} />
              <Route path="/ressources/paiements" element={<PaiementsPage />} />

              <Route path="/gestion-etudiants/ajouter-etudiants" element={<AjoutEtudiantPage />} />
              <Route path="/gestion-etudiants/inscrire-etudiants" element={<InscrireEtudiantPage />} />
              <Route path="/gestion-etudiants/listes-etudiants" element={<ListesEtudiantsPage />} />
              <Route path="/gestion-etudiants/editer-certificat-inscription" element={<CertificatInscriptionPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
