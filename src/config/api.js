// src/config/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_URL;

// Helper function pour les requêtes authentifiées
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Si le token est invalide, déconnecter l'utilisateur
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
};
