// src/hooks/useCollection.js

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config/api';

export const useCollection = () => {
  const { token } = useContext(AuthContext);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer la collection avec les détails des cartes
  const fetchCollection = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/collections/me/detailed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCollection(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError('Failed to fetch collection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [token]);

  // Ajouter une carte à la collection
  const addCard = async (cardId, quantity = 1, source = 'Pack') => {
    try {
      const response = await fetch(`${API_URL}/collections/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cardId, quantity, source })
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollection(); // Rafraîchir la collection
        return { success: true, message: `Added ${quantity}x card to collection` };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error adding card:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Retirer une carte de la collection
  const removeCard = async (cardId, quantity = 1) => {
    try {
      const normalizedId = cardId.toUpperCase();
      const response = await fetch(`${API_URL}/collections/cards/${normalizedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollection(); // Rafraîchir la collection
        return { success: true, message: `Removed ${quantity}x card from collection` };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error removing card:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Marquer/démarquer comme favori
  const toggleFavorite = async (cardId, isFavorite) => {
    try {
      const normalizedId = cardId.toUpperCase();
      const response = await fetch(`${API_URL}/collections/cards/${normalizedId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isFavorite })
      });

      const data = await response.json();

      if (data.success) {
        await fetchCollection();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Vérifier si une carte est possédée
  const hasCard = (cardId) => {
    if (!collection || !collection.cards) return false;
    const normalizedId = cardId.toUpperCase();
    const card = collection.cards.find(c => c.cardId === normalizedId);
    return card && card.quantity > 0;
  };

  // Obtenir la quantité d'une carte
  const getCardQuantity = (cardId) => {
    if (!collection || !collection.cards) return 0;

    const normalizedId = cardId.toUpperCase();
    const card = collection.cards.find(c => c.cardId === normalizedId);
    return card ? card.quantity : 0;
  };

  // Mettre à jour la quantité d'une carte
  const updateQuantity = async (cardId, newQuantity) => {
    const normalizedCardId = cardId.toUpperCase();
    if (newQuantity <= 0) {
      return await removeCard(cardId);
    }

    try {
      const currentQuantity = getCardQuantity(cardId);
      const difference = newQuantity - currentQuantity;

      if (difference > 0) {
        return await addCard(cardId, difference);
      } else if (difference < 0) {
        return await removeCard(cardId, Math.abs(difference));
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Obtenir les statistiques de la collection
  const getStats = () => {
    if (!collection || !collection.cards) {
      return {
        totalCards: 0,
        uniqueCards: 0,
        rarityCount: {},
        typeCount: {}
      };
    }

    const stats = {
      totalCards: 0,
      uniqueCards: collection.cards.length,
      rarityCount: {},
      typeCount: {}
    };

    collection.cards.forEach(card => {
      stats.totalCards += card.quantity || 1;

      if (card.rarity) {
        stats.rarityCount[card.rarity] = (stats.rarityCount[card.rarity] || 0) + card.quantity;
      }

      if (card.type) {
        stats.typeCount[card.type] = (stats.typeCount[card.type] || 0) + card.quantity;
      }
    });

    return stats;
  };

  return {
    collection,
    loading,
    error,
    addCard,
    removeCard,
    toggleFavorite,
    hasCard,
    getCardQuantity,
    updateQuantity,
    getStats,
    refetch: fetchCollection
  };
};
