import { createCrudService } from './createCrudService';

export const paiementsService = createCrudService('paiements', 'le paiement');

export const getPaiementsByInscription = async (inscriptionId) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/api/paiements/inscription/${inscriptionId}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  
  if (!response.ok) throw new Error('Erreur chargement paiements');
  return response.json();
};