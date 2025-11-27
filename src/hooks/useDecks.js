// src/hooks/useDecks.js

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../config/api';

import cardsData from '../data/cards.json';

export const useDecks = () => {
  const { token } = useContext(AuthContext);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les decks
  const fetchDecks = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/decks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Enrichir chaque deck avec les données de la légende
        const enrichedDecks = data.data.map(deck => {
          if (deck.legendId) {
            const legend = cardsData.find(c => c.id === deck.legendId);
            if (legend) {
              return { ...deck, legend };
            }
          }
          return deck;
        });
        setDecks(enrichedDecks);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching decks:', err);
      setError('Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les decks sans montrer le loading (pour les mises à jour)
  const refreshDecks = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/decks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Enrichir chaque deck avec les données de la légende
        const enrichedDecks = data.data.map(deck => {
          if (deck.legendId) {
            const legend = cardsData.find(c => c.id === deck.legendId);
            if (legend) {
              return { ...deck, legend };
            }
          }
          return deck;
        });
        setDecks(enrichedDecks);
      }
    } catch (err) {
      console.error('Error refreshing decks:', err);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [token]);

  // Helper pour obtenir un deck depuis l'état local avec enrichissement des données
  const getDeck = (deckId) => {
    const rawDeck = decks.find(d => d.id === deckId || d._id === deckId);
    if (!rawDeck) {
      return null;
    }

    // Enrichir et structurer le deck
    const enrichedDeck = { ...rawDeck, cards: [], runes: [], battlefields: [] };

    // Récupérer la légende si legendId existe
    if (rawDeck.legendId) {
      const legend = cardsData.find(c => c.id === rawDeck.legendId);
      if (legend) {
        enrichedDeck.legend = legend;
      }
    } else if (rawDeck.legend) {
      // Fallback si l'objet legend est déjà là (anciens decks ou autre structure)
      enrichedDeck.legend = rawDeck.legend;
    }

    if (rawDeck.cards && Array.isArray(rawDeck.cards)) {
      rawDeck.cards.forEach(deckCard => {
        // Trouver les détails de la carte dans le JSON local
        // Note: deckCard.cardId est l'ID stocké en base (normalement uppercase)
        // cardsData contient les cartes avec leurs IDs
        const cardDetails = cardsData.find(c => c.id.toUpperCase() === deckCard.cardId?.toUpperCase());

        if (cardDetails) {
          const fullCard = { ...cardDetails, ...deckCard, id: cardDetails.id }; // Garder l'ID original du JSON
          const type = cardDetails.cardType?.[0]?.label;

          if (type === 'Rune') {
            enrichedDeck.runes.push(fullCard);
          } else if (type === 'Battlefield') {
            enrichedDeck.battlefields.push(fullCard);
          } else {
            enrichedDeck.cards.push(fullCard);
          }
        } else {
          console.warn('Card not found in cardsData:', deckCard.cardId);
        }
      });
    }

    return enrichedDeck;
  };

  // Récupérer un deck spécifique avec les détails des cartes (API)
  const getDeckDetailed = async (deckId) => {
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}/detailed`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, deck: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error fetching deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Créer un nouveau deck
  const createDeck = async (name, legend) => {
    try {
      // Mapping des domaines vers les factions du backend
      const domainMapping = {
        'Fury': 'Fire',
        'Mind': 'Water',
        'Calm': 'Earth',
        'Spirit': 'Air',
        'Chaos': 'Dark',
        'Order': 'Light',
        'Body': 'Neutral'
      };

      const legendDomain = legend.domains?.[0]?.label;
      const mainFaction = domainMapping[legendDomain] || 'Neutral';

      const response = await fetch(`${API_URL}/decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          mainFaction, // Faction mappée
          legendId: legend.id, // On envoie l'ID de la légende
          description: `Deck créé avec ${legend.name}`
        })
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return data.data; // Retourne le deck créé
      } else {
        console.error('Error creating deck:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating deck:', error);
      return null;
    }
  };

  // Dupliquer un deck
  const duplicateDeck = async (deckId) => {
    const deckToDuplicate = getDeck(deckId);
    if (!deckToDuplicate) return null;

    try {
      // Créer un nouveau deck avec le même nom (copie) et la même légende
      // Note: Idéalement, le backend devrait avoir une route de duplication, 
      // mais on peut le simuler en créant un deck et en ajoutant les cartes.
      // Pour l'instant, on fait une création simple.
      const newName = `${deckToDuplicate.name} (Copy)`;
      // On a besoin de l'objet légende complet ou au moins l'ID et la faction
      // Si deckToDuplicate.legend est peuplé :
      const legend = deckToDuplicate.legend;

      if (!legend) {
        console.error("Cannot duplicate: Legend data missing");
        return null;
      }

      const newDeck = await createDeck(newName, legend);

      if (newDeck) {
        // Copier les cartes du deck original vers le nouveau deck
        if (deckToDuplicate.cards && deckToDuplicate.cards.length > 0) {
          // On utilise une boucle séquentielle pour éviter de surcharger le backend
          // ou Promise.all si le backend peut gérer la charge
          for (const card of deckToDuplicate.cards) {
            // card est { cardId: "...", quantity: N }
            // On doit récupérer l'objet carte complet pour addCardToDeck car il attend un objet carte avec un id
            // Heureusement addCardToDeck utilise juste card.id
            await addCardToDeck(newDeck._id || newDeck.id, { id: card.cardId }, card.quantity);
          }
        }
        return newDeck;
      }
      return null;

    } catch (error) {
      console.error('Error duplicating deck:', error);
      return null;
    }
  };

  // Mettre à jour un deck
  const updateDeck = async (deckId, updates) => {
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true, deck: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error updating deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const updateDeckName = async (deckId, name) => {
    return updateDeck(deckId, { name });
  };

  // Supprimer un deck
  const deleteDeck = async (deckId) => {
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Ajouter une carte à un deck
  const addCardToDeck = async (deckId, card, quantity = 1) => {
    try {
      const normalizedId = card.id.toUpperCase();
      const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cardId: normalizedId, quantity })
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true, deck: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error adding card to deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Retirer une carte d'un deck
  const removeCardFromDeck = async (deckId, cardId, type, quantity = 1) => {
    try {
      const normalizedId = cardId.toUpperCase();
      const response = await fetch(`${API_URL}/decks/${deckId}/cards/${normalizedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true, deck: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error removing card from deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const deleteCardFromDeck = async (deckId, cardId, type) => {
    // Remove all copies (max 3 usually)
    return removeCardFromDeck(deckId, cardId, type, 3);
  };

  // Valider un deck
  const validateDeck = async (deckId) => {
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true, isValid: data.isValid, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error validating deck:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Enregistrer un résultat de partie
  const recordGameResult = async (deckId, won) => {
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}/game-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ won })
      });

      const data = await response.json();

      if (data.success) {
        await refreshDecks();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error recording game result:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Calculer les stats d'un deck (localement)
  const getDeckStats = (deckId) => {
    const deck = getDeck(deckId);
    if (!deck) return null;

    const totalCards = (deck.cards?.reduce((sum, c) => sum + c.quantity, 0) || 0);
    const totalRunes = (deck.runes?.reduce((sum, c) => sum + c.quantity, 0) || 0);
    const totalBattlefields = (deck.battlefields?.reduce((sum, c) => sum + c.quantity, 0) || 0);

    return {
      totalCards,
      totalRunes,
      totalBattlefields,
      totalDeckSize: totalCards + totalRunes + totalBattlefields,
      isValid: deck.isValid // Use backend validation flag
    };
  };

  // Vérifier si une carte est autorisée dans le deck
  const isCardAllowed = (deck, card) => {
    if (!deck || !card) return false;

    // Récupérer les domaines de la légende
    const legendDomains = deck.legend?.domains?.map(d => d.id.toLowerCase()) || [];
    if (legendDomains.length === 0) return true; // Si pas de légende, autoriser tout

    // Récupérer le(s) domaine(s) de la carte
    const cardDomains = card.domains?.map(d => d.id.toLowerCase()) || [];

    // Autoriser les cartes sans domaine (neutres)
    if (cardDomains.length === 0) return true;

    // Autoriser si tous les domaines de la carte sont inclus dans les domaines de la légende
    return cardDomains.every(domain => legendDomains.includes(domain));
  };

  return {
    decks,
    loading,
    error,
    getDeck,
    getDeckDetailed,
    getDeckStats,
    createDeck,
    duplicateDeck,
    updateDeck,
    updateDeckName,
    deleteDeck,
    addCardToDeck,
    removeCardFromDeck,
    deleteCardFromDeck,
    isCardAllowed,
    validateDeck,
    recordGameResult,
    refetch: fetchDecks
  };
};
