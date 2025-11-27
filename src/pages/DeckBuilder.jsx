import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDecks } from '../hooks/useDecks';
import cardsData from '../data/cards.json';

const DeckBuilder = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { getDeck, getDeckStats, addCardToDeck, removeCardFromDeck, deleteCardFromDeck, isCardAllowed, updateDeckName, loading, decks } = useDecks();

    const deck = getDeck(deckId);
    const stats = getDeckStats(deckId);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedRarity, setSelectedRarity] = useState('All');
    const [selectedCard, setSelectedCard] = useState(null);
    const [activeTab, setActiveTab] = useState('cards'); // 'cards', 'runes', 'battlefields'
    const [editingName, setEditingName] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');

    useEffect(() => {
        // Redirect to /decks if loading is done AND deck is still not found
        if (!loading && decks && decks.length > 0 && !deck) {
            navigate('/decks');
        }
    }, [deck, navigate, loading, decks]);

    // Afficher un écran de chargement pendant que les données se chargent
    // OR if decks array is empty (means still loading/initializing)
    if (loading || !decks || decks.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎴</div>
                    <p className="text-white text-xl">Chargement du deck...</p>
                </div>
            </div>
        );
    }

    if (!deck || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Deck introuvable</h2>
                    <p>ID: {deckId}</p>
                    <button onClick={() => navigate('/decks')} className="mt-4 bg-blue-600 px-4 py-2 rounded">Retour</button>
                </div>
            </div>
        );
    }

    // Filtrer les cartes disponibles
    const getAvailableCards = () => {
        let cards = [];

        if (activeTab === 'runes') {
            cards = cardsData.filter(card => card.cardType?.[0]?.label === 'Rune');
        } else if (activeTab === 'battlefields') {
            cards = cardsData.filter(card => card.cardType?.[0]?.label === 'Battlefield');
        } else {
            // Cartes normales (Unit, Champion, Sort, Gear) - EXCLURE les Legends
            cards = cardsData.filter(card => {
                const type = card.cardType?.[0]?.label;
                return type === 'Unit' || type === 'Champion' || type === 'Spell' || type === 'Gear';
            });
        }

        // Filtrer par domaines autorisés (sauf pour les Runes et Battlefields)
        if (activeTab === 'cards') {
            cards = cards.filter(card => isCardAllowed(deck, card));
        }

        // Filtrer par recherche, type et rareté
        return cards.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'All' || card.cardType?.[0]?.label === selectedType;
            const matchesRarity = selectedRarity === 'All' || card.rarity?.label === selectedRarity;
            return matchesSearch && matchesType && matchesRarity;
        });
    };

    const availableCards = getAvailableCards();

    // Types et raretés
    const types = ['All', 'Unit', 'Champion', 'Spell', 'Gear'];
    const rarities = ['All', ...new Set(cardsData.map(card => card.rarity?.label).filter(Boolean))];

    const getCardQuantityInDeck = (cardId) => {
        const allCards = [...deck.cards, ...deck.runes, ...deck.battlefields];
        const card = allCards.find(c => c.id === cardId);
        return card ? card.quantity : 0;
    };

    const handleAddCard = (card) => {
        addCardToDeck(deckId, card, 1);
    };

    const handleRemoveCard = (card) => {
        const type = card.cardType?.[0]?.label;
        removeCardFromDeck(deckId, card.id, type, 1);
    };

    const handleDeleteCard = (card) => {
        const type = card.cardType?.[0]?.label;
        deleteCardFromDeck(deckId, card.id, type);
    };

    const handleSaveName = () => {
        if (newDeckName.trim()) {
            updateDeckName(deckId, newDeckName.trim());
        }
        setEditingName(false);
    };

    const rarityColors = {
        Common: 'from-gray-500 to-gray-600',
        Uncommon: 'from-green-500 to-green-600',
        Rare: 'from-blue-500 to-blue-600',
        Epic: 'from-purple-500 to-purple-600',
        Legendary: 'from-amber-500 to-yellow-500',
        Showcase: 'from-pink-500 to-purple-600'
    };

    const rarityBorders = {
        Common: 'border-gray-500/50',
        Uncommon: 'border-green-500/50',
        Rare: 'border-blue-500/50',
        Epic: 'border-purple-500/50',
        Legendary: 'border-amber-500/50',
        Showcase: 'border-pink-500/50'
    };

    const cleanText = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/:\w+:/g, '')
            .replace(/\n/g, ' ')
            .trim();
    };

    const DeckCard = ({ card }) => {
        const rarity = card.rarity?.label || 'Common';
        const cardType = card.cardType?.[0]?.label || 'Unknown';
        const imageUrl = card.cardImage?.url || '';
        const quantityInDeck = getCardQuantityInDeck(card.id);

        return (
            <div className="bg-slate-800/90 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-amber-500/50 transition group">
                <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={card.name}
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Badge de rareté */}
                    <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColors[rarity]}`}>
                        {rarity}
                    </div>

                    {/* Quantité dans le deck */}
                    {quantityInDeck > 0 && (
                        <div className="absolute top-1 right-1 bg-green-600 text-white font-bold px-2 py-0.5 rounded-full text-xs">
                            x{quantityInDeck}
                        </div>
                    )}
                </div>

                <div className="p-2">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{card.name}</h3>
                    <div className="text-xs text-gray-400 mb-2">
                        {cardType} • {card.energy || 0}⚡
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleAddCard(card)}
                            className="flex-1 bg-green-600/80 text-white py-1 rounded text-xs hover:bg-green-600 transition"
                        >
                            +
                        </button>
                        {quantityInDeck > 0 && (
                            <>
                                <button
                                    onClick={() => handleRemoveCard(card)}
                                    className="flex-1 bg-red-600/80 text-white py-1 rounded text-xs hover:bg-red-600 transition"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => handleDeleteCard(card)}
                                    className="bg-red-800/80 text-white px-2 py-1 rounded text-xs hover:bg-red-800 transition"
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const DeckListCard = ({ card }) => {
        const rarity = card.rarity?.label || 'Common';
        const cardType = card.cardType?.[0]?.label || 'Unknown';

        return (
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-2 group hover:bg-slate-700 transition">
                <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
                    {card.cardImage?.url && (
                        <img
                            src={card.cardImage.url}
                            alt={card.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{card.name}</p>
                    <p className="text-xs text-gray-400">{cardType} • {rarity}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-lg">x{card.quantity}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                            onClick={() => handleAddCard(card)}
                            className="bg-green-600 text-white w-6 h-6 rounded text-xs hover:bg-green-700"
                        >
                            +
                        </button>
                        <button
                            onClick={() => handleRemoveCard(card)}
                            className="bg-red-600 text-white w-6 h-6 rounded text-xs hover:bg-red-700"
                        >
                            -
                        </button>
                        <button
                            onClick={() => handleDeleteCard(card)}
                            className="bg-red-800 text-white w-6 h-6 rounded text-xs hover:bg-red-900"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Header du Deck */}
            <div className="relative h-64 bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10" />
                {deck.legend?.cardImage?.url && (
                    <img
                        src={deck.legend.cardImage.url}
                        alt={deck.legend.name}
                        className="w-full h-full object-cover opacity-50"
                    />
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex items-end justify-between">
                    <div className="flex items-center gap-6">
                        {/* Image de la légende (Avatar) */}
                        <div className="w-24 h-24 rounded-full border-4 border-amber-500 overflow-hidden shadow-lg bg-slate-800 flex-shrink-0">
                            {deck.legend?.cardImage?.url ? (
                                <img
                                    src={deck.legend.cardImage.url}
                                    alt={deck.legend.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">👑</div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {editingName ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newDeckName}
                                            onChange={(e) => setNewDeckName(e.target.value)}
                                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => {
                                                if (newDeckName.trim()) {
                                                    updateDeckName(deckId, newDeckName);
                                                    setEditingName(false);
                                                }
                                            }}
                                            className="text-green-400 hover:text-green-300"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={() => setEditingName(false)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <h1
                                        className="text-4xl font-bold text-white cursor-pointer hover:text-amber-500 transition flex items-center gap-2"
                                        onClick={() => {
                                            setNewDeckName(deck.name);
                                            setEditingName(true);
                                        }}
                                    >
                                        {deck.name}
                                        <span className="text-sm text-gray-400 font-normal">✏️</span>
                                    </h1>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <span className="flex items-center gap-1">
                                    👑 {deck.legend?.name || 'Légende inconnue'}
                                </span>
                                <span className="flex items-center gap-1">
                                    📊 {stats.totalDeckSize}/56 cartes
                                </span>
                                {stats.isValid ? (
                                    <span className="text-green-400 font-bold flex items-center gap-1">✓ Valide</span>
                                ) : (
                                    <span className="text-amber-400 font-bold flex items-center gap-1">⚠️ Incomplet</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/decks')}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Retour
                        </button>
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition transform hover:scale-105">
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-gray-400">Légende: {deck.legend?.name}</p>
                            <div className="flex gap-2 mt-2">
                                {deck.domains?.map((domain, index) => (
                                    <span key={index} className="text-sm px-3 py-1 bg-slate-700 rounded text-blue-400">
                                        {domain.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-amber-500/20">
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className={`text-2xl font-bold ${stats.totalCards === 40 ? 'text-green-400' : 'text-amber-400'}`}>
                                        {stats.totalCards}
                                    </div>
                                    <div className="text-xs text-gray-400">Cartes</div>
                                    <div className="text-xs text-gray-500">/40</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold ${stats.totalRunes === 12 ? 'text-green-400' : 'text-purple-400'}`}>
                                        {stats.totalRunes}
                                    </div>
                                    <div className="text-xs text-gray-400">Runes</div>
                                    <div className="text-xs text-gray-500">/12</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold ${stats.totalBattlefields === 3 ? 'text-green-400' : 'text-blue-400'}`}>
                                        {stats.totalBattlefields}
                                    </div>
                                    <div className="text-xs text-gray-400">Champs</div>
                                    <div className="text-xs text-gray-500">/3</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-bold ${stats.totalDeckSize === 56 ? 'text-green-400' : 'text-white'}`}>
                                        {stats.totalDeckSize}
                                    </div>
                                    <div className="text-xs text-gray-400">Total</div>
                                    <div className="text-xs text-gray-500">/56</div>
                                </div>
                            </div>
                            {stats.isValid && (
                                <div className="mt-3 text-center text-green-400 font-bold text-sm">
                                    ✓ Deck valide !
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Liste du deck (gauche) */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4 sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto">
                            <h2 className="text-xl font-bold text-white mb-4">📋 Deck actuel</h2>

                            {/* Légende */}
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Légende</h3>
                                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-12 h-16 rounded overflow-hidden">
                                        {deck.legend?.cardImage?.url && (
                                            <img
                                                src={deck.legend.cardImage.url}
                                                alt={deck.legend.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{deck.legend?.name}</p>
                                        <p className="text-xs text-amber-400">Legend</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cartes */}
                            {deck.cards.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Cartes ({stats.totalCards}/40)
                                    </h3>
                                    <div className="space-y-2">
                                        {deck.cards.map(card => (
                                            <DeckListCard key={card.id} card={card} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Runes */}
                            {deck.runes.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Runes ({stats.totalRunes}/12)
                                    </h3>
                                    <div className="space-y-2">
                                        {deck.runes.map(card => (
                                            <DeckListCard key={card.id} card={card} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Battlefields */}
                            {deck.battlefields.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-400 mb-2">
                                        Champs de bataille ({stats.totalBattlefields}/3)
                                    </h3>
                                    <div className="space-y-2">
                                        {deck.battlefields.map(card => (
                                            <DeckListCard key={card.id} card={card} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {deck.cards.length === 0 && deck.runes.length === 0 && deck.battlefields.length === 0 && (
                                <p className="text-gray-400 text-center py-8 text-sm">
                                    Votre deck est vide.<br />Ajoutez des cartes !
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Cartes disponibles (droite) */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
                            <h2 className="text-xl font-bold text-white mb-4">🎴 Cartes disponibles</h2>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setActiveTab('cards')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'cards'
                                        ? 'bg-gradient-to-r from-blue-600 to-amber-500 text-white'
                                        : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                                        }`}
                                >
                                    Cartes ({stats.totalCards}/40)
                                </button>
                                <button
                                    onClick={() => setActiveTab('runes')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'runes'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                                        }`}
                                >
                                    Runes ({stats.totalRunes}/12)
                                </button>
                                <button
                                    onClick={() => setActiveTab('battlefields')}
                                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'battlefields'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                                        }`}
                                >
                                    Champs ({stats.totalBattlefields}/3)
                                </button>
                            </div>

                            {/* Filtres */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                                />
                                {activeTab === 'cards' && (
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="px-3 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                                    >
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                )}
                                <select
                                    value={selectedRarity}
                                    onChange={(e) => setSelectedRarity(e.target.value)}
                                    className="px-3 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                                >
                                    {rarities.map(rarity => (
                                        <option key={rarity} value={rarity}>{rarity}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Grille de cartes */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                                {availableCards.map(card => (
                                    <DeckCard key={card.id} card={card} />
                                ))}
                            </div>

                            {availableCards.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    Aucune carte disponible
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeckBuilder;