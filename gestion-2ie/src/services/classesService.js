import { createCrudService } from './createCrudService';

export const classesService = createCrudService('classes', 'la classe');

export const getClasseEtudiants = async (classeId) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/api/classes/${classeId}/etudiants`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error('Erreur chargement étudiants');
  return response.json();
};

export const addEtudiantToClasse = async (classeId, etudiantId, dateAffectation) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/api/classes/${classeId}/etudiants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ etudiant_id: etudiantId, date_affectation: dateAffectation }),
  });
  
  if (!response.ok) throw new Error('Erreur ajout étudiant');
  return response.json();
};

export const removeEtudiantFromClasse = async (classeId, etudiantId) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/api/classes/${classeId}/etudiants/${etudiantId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error('Erreur suppression étudiant');
  return response.json();
};