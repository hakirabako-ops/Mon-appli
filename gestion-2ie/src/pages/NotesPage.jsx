import CrudPage from '../components/CrudPage';
import { notesService } from '../services/notesService';
import { etudiantsService } from '../services/etudiantsService';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { studentName } from './EtudiantsPage';

const notesConfig = {
  title: 'Notes',
  category: 'Ressources',
  singular: 'note',
  description: 'Gérez les notes des étudiants par matière.',
  listTitle: 'Liste des notes',
  service: notesService,
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true,
  fields: [
    { name: 'etudiant_id',         label: 'Étudiant',          type: 'select', service: etudiantsService,         optionLabel: studentName, required: true },
    { name: 'matiere',             label: 'Matière',           required: true, placeholder: 'Mathématiques' },
    { name: 'note',                label: 'Note',              type: 'number', required: true, placeholder: '15.5', step: '0.5' },
    { name: 'note_max',            label: 'Note maximale',     type: 'number', placeholder: '20' },
    { name: 'coefficient',         label: 'Coefficient',       type: 'number', placeholder: '1', step: '0.5' },
    { name: 'type_note',           label: 'Type',              placeholder: 'Devoir' },
    { name: 'semestre',            label: 'Semestre',          placeholder: 'S1' },
    { name: 'annee_academique_id', label: 'Année académique',  type: 'select', service: anneesAcademiquesService, required: true },
    { name: 'commentaire',         label: 'Commentaire',       type: 'textarea' },
  ],
  columns: [
    { name: 'etudiant_id',         label: 'Étudiant',   optionField: 'etudiant_id', optionLabel: studentName },
    { name: 'matiere',             label: 'Matière' },
    { name: 'note',                label: 'Note',       render: (v) => v != null ? `${v}/20` : '—' },
    { name: 'coefficient',         label: 'Coeff.' },
    { name: 'type_note',           label: 'Type' },
    { name: 'semestre',            label: 'Semestre' },
    { name: 'annee_academique_id', label: 'Année',      optionField: 'annee_academique_id' },
  ],
};

export default function NotesPage() {
  return <CrudPage config={notesConfig} />;
}
