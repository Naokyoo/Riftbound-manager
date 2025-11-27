// src/hooks/useCards.js

import { useState, useEffect } from 'react';
import API_URL from '../config/api';

export const useCards = (filters = {}) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les query params
      const params = new URLSearchParams();
      if (filters.faction) params.append('faction', filters.faction);
      if (filters.rarity) params.append('rarity', filters.rarity);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const url = `${API_URL}/cards${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setCards(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError('Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [filters.faction, filters.rarity, filters.type, filters.search, filters.sort]);

  // Récupérer une carte spécifique
  const getCard = async (cardId) => {
    try {
      const response = await fetch(`${API_URL}/cards/${cardId}`);
      const data = await response.json();

      if (data.success) {
        return { success: true, card: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error fetching card:', error);
      return { success: false, error: 'Network error' };
    }
  };

  return {
    cards,
    loading,
    error,
    getCard,
    refetch: fetchCards
  };
};
