import React, { useState } from 'react';
import Card from '../components/Card';
import CardNotification from '../components/CardNotification';
import cardsData from '../data/cards.json';
import { useCollection } from '../hooks/useCollection';

const Database = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedRarity, setSelectedRarity] = useState('All');
    const [selectedCard, setSelectedCard] = useState(null);
    const [addQuantity, setAddQuantity] = useState(1);
    const [notification, setNotification] = useState(null);

    const { addCard, hasCard, getCardQuantity, loading } = useCollection();

    // Filtrer les cartes
    const filteredCards = cardsData.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (card.text && card.text.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedType === 'All' || card.cardType?.[0]?.label === selectedType;
        const matchesRarity = selectedRarity === 'All' || card.rarity?.label === selectedRarity;

        return matchesSearch && matchesType && matchesRarity;
    });

    // Types et raretés uniques
    const types = ['All', ...new Set(cardsData.map(card => card.cardType?.[0]?.label).filter(Boolean))];
    const rarities = ['All', ...new Set(cardsData.map(card => card.rarity?.label).filter(Boolean))];

    // Nettoyer le texte HTML
    const cleanText = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/:\w+:/g, '')
            .replace(/_/g, '')
            .trim();
    };

    const handleAddToCollection = (card, quantity = 1) => {
        console.log('🎯 Tentative d\'ajout de carte:', {
            name: card.name,
            id: card.id,
            quantity: quantity
        });

        if (loading) {
            console.warn('⏳ Collection en cours de chargement');
            return;
        }

        try {
            addCard(card.id, quantity);
            // Afficher la notification avec l'image de la carte
            setNotification({ card, quantity });
            console.log('✅ Carte ajoutée avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Notification avec image de carte */}
                {notification && (
                    <CardNotification
                        card={notification.card}
                        quantity={notification.quantity}
                        onClose={() => setNotification(null)}
                    />
                )}

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Base de données Riftbound
                    </h1>
                    <p className="text-xl text-gray-300">
                        Explorez les {cardsData.length} cartes officielles
                    </p>
                </div>

                {/* Filtres */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Recherche */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rechercher
                            </label>
                            <input
                                type="text"
                                placeholder="Nom ou effet..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Rareté */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rareté
                            </label>
                            <select
                                value={selectedRarity}
                                onChange={(e) => setSelectedRarity(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition"
                            >
                                {rarities.map(rarity => (
                                    <option key={rarity} value={rarity}>{rarity}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Compteur de résultats */}
                    <div className="mt-4 text-center text-gray-400">
                        {filteredCards.length} carte(s) trouvée(s)
                    </div>
                </div>

                {/* Grille de cartes */}
                {filteredCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCards.map(card => (
                            <div key={card.id} className="relative group">
                                <Card
                                    card={card}
                                    onClick={setSelectedCard}
                                />
                                {/* Badge "Dans la collection" */}
                                {hasCard(card.id) && (
                                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold z-10 shadow-lg animate-bounce-in">
                                        ✓ x{getCardQuantity(card.id)}
                                    </div>
                                )}
                                {/* Bouton d'ajout rapide */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCollection(card, 1);
                                    }}
                                    className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-amber-500 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition opacity-0 group-hover:opacity-100 transform hover:scale-105 shadow-lg"
                                >
                                    + Ajouter
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-400">Aucune carte trouvée</p>
                    </div>
                )}
            </div>

            {/* Modal de détails de carte */}
            {selectedCard && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                    onClick={() => setSelectedCard(null)}
                >
                    <div
                        className="bg-slate-800 rounded-xl max-w-3xl w-full p-8 border-2 border-amber-500/50 max-h-[90vh] overflow-y-auto animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedCard.name}</h2>
                                <p className="text-gray-400">{selectedCard.publicCode}</p>
                                {hasCard(selectedCard.id) && (
                                    <div className="mt-2 inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                        ✓ Dans votre collection (x{getCardQuantity(selectedCard.id)})
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="text-gray-400 hover:text-white text-2xl transition hover:rotate-90 transform duration-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image */}
                            <div>
                                <img
                                    src={selectedCard.cardImage?.url}
                                    alt={selectedCard.name}
                                    className="w-full rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Détails */}
                            <div className="space-y-4">
                                <div>
                                    <span className="text-gray-400">Énergie:</span>
                                    <span className="ml-2 text-white font-bold text-xl">{selectedCard.energy}</span>
                                </div>

                                {selectedCard.power !== null && selectedCard.power !== undefined && (
                                    <div>
                                        <span className="text-gray-400">Coût de recyclage:</span>
                                        <span className="ml-2 text-green-400 font-bold text-xl">{selectedCard.power}</span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400">Type:</span>
                                    <span className="ml-2 text-white">
                                        {selectedCard.cardType?.map(t => t.label).join(', ')}
                                    </span>
                                </div>

                                {selectedCard.domains && selectedCard.domains.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Domaines:</span>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {selectedCard.domains.map((domain, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                    {domain.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400">Rareté:</span>
                                    <span className="ml-2 text-amber-400 font-bold">{selectedCard.rarity?.label}</span>
                                </div>

                                <div>
                                    <span className="text-gray-400 block mb-2">Effet:</span>
                                    <p className="text-white bg-slate-700/50 p-3 rounded text-sm leading-relaxed">
                                        {cleanText(selectedCard.text)}
                                    </p>
                                </div>

                                {selectedCard.illustrator && selectedCard.illustrator.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Artiste:</span>
                                        <span className="ml-2 text-white text-sm">{selectedCard.illustrator.join(', ')}</span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-gray-400">Extension:</span>
                                    <span className="ml-2 text-white">{selectedCard.setName}</span>
                                </div>

                                {/* Ajout à la collection */}
                                <div className="border-t border-slate-700 pt-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-gray-400 text-sm">Quantité:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={addQuantity}
                                            onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 px-3 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleAddToCollection(selectedCard, addQuantity)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105 shadow-lg"
                                    >
                                        + Ajouter à ma collection
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Database;