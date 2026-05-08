import { createCrudService } from './createCrudService';

export const notesService = createCrudService('notes', 'la note');

export const getNotesByEtudiant = async (etudiantId, anneeId = null) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  let url = `${API_BASE_URL}/api/notes/etudiant/${etudiantId}`;
  if (anneeId) url += `?annee_id=${anneeId}`;
  
  const response = await fetch(url, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error('Erreur chargement notes');
  return response.json();
};

export const getMoyenneEtudiant = async (etudiantId, anneeId) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/api/notes/etudiant/${etudiantId}/moyenne?annee_id=${anneeId}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error('Erreur chargement moyenne');
  return response.json();
};