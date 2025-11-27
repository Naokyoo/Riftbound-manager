import React, { useState } from 'react';
import cardsData from '../data/cards.json';
import { useCollection } from '../hooks/useCollection';

const Collection = () => {
    const [selectedExtension, setSelectedExtension] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [ownershipFilter, setOwnershipFilter] = useState('All'); // 'All', 'Owned', 'NotOwned'

    const { collection, hasCard, getCardQuantity, addCard, updateQuantity, removeCard } = useCollection();

    // Extraire les extensions uniques
    const extensions = ['All', ...new Set(cardsData.map(card => card.setName).filter(Boolean))];

    // Filtrer et trier les cartes
    const filteredCards = cardsData
        .filter(card => {
            const matchesExtension = selectedExtension === 'All' || card.setName === selectedExtension;
            const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesOwnership =
                ownershipFilter === 'All' ||
                (ownershipFilter === 'Owned' && hasCard(card.id)) ||
                (ownershipFilter === 'NotOwned' && !hasCard(card.id));
            return matchesExtension && matchesSearch && matchesOwnership;
        })
        .sort((a, b) => {
            // Trier par extension, puis par numéro de collectionneur
            if (a.setName !== b.setName) {
                return a.setName.localeCompare(b.setName);
            }
            return a.collectorNumber - b.collectorNumber;
        });

    // Regrouper par extension pour affichage
    const cardsByExtension = filteredCards.reduce((acc, card) => {
        const ext = card.setName || 'Unknown';
        if (!acc[ext]) {
            acc[ext] = [];
        }
        acc[ext].push(card);
        return acc;
    }, {});

    // Statistiques - FIXED: use collection?.cards instead of collection directly
    const totalCards = cardsData.length;
    const ownedUniqueCards = collection?.cards?.length || 0;
    const ownedTotalCards = collection?.cards?.reduce((sum, card) => sum + (card.quantity || 0), 0) || 0;
    const completionPercentage = totalCards > 0 ? ((ownedUniqueCards / totalCards) * 100).toFixed(1) : '0.0';

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

    const CollectionCardDisplay = ({ card }) => {
        const owned = hasCard(card.id);
        const quantity = getCardQuantity(card.id);
        const rarity = card.rarity?.label || 'Common';
        const imageUrl = card.cardImage?.url || '';

        return (
            <div
                onClick={() => setSelectedCard(card)}
                className={`relative rounded-xl overflow-hidden border-2 ${rarityBorders[rarity]} hover:scale-105 transition-transform cursor-pointer shadow-xl ${!owned ? 'grayscale' : ''}`}
            >
                {/* Badge de quantité si possédée */}
                {owned && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                        x{quantity}
                    </div>
                )}

                {/* Indicateur non possédée */}
                {!owned && (
                    <div className="absolute top-2 right-2 z-10 bg-slate-700/90 text-gray-400 font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                        Non possédée
                    </div>
                )}

                <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={card.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-500 text-4xl">🎴</div>
                    )}

                    {/* Badge de rareté */}
                    <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColors[rarity]}`}>
                        {rarity}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        📚 Ma Collection
                    </h1>
                    <div className="flex justify-center gap-8 text-gray-300">
                        <div>
                            <span className="text-amber-400 font-bold text-2xl">{ownedUniqueCards}</span>
                            <span className="text-sm">/{totalCards} cartes uniques</span>
                        </div>
                        <div>
                            <span className="text-green-400 font-bold text-2xl">{ownedTotalCards}</span>
                            <span className="text-sm"> cartes totales</span>
                        </div>
                        <div>
                            <span className="text-blue-400 font-bold text-2xl">{completionPercentage}%</span>
                            <span className="text-sm"> complété</span>
                        </div>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 mb-8">
                    <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-amber-500 h-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>

                    {/* Filtres rapides */}
                    <div className="flex justify-center gap-3 mt-4">
                        <button
                            onClick={() => setOwnershipFilter('All')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${ownershipFilter === 'All'
                                ? 'bg-gradient-to-r from-blue-600 to-amber-500 text-white'
                                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            📚 Toutes
                        </button>
                        <button
                            onClick={() => setOwnershipFilter('Owned')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${ownershipFilter === 'Owned'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            ✅ Possédées
                        </button>
                        <button
                            onClick={() => setOwnershipFilter('NotOwned')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${ownershipFilter === 'NotOwned'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            ❌ Manquantes
                        </button>
                    </div>
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
                                placeholder="Nom de carte..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                            />
                        </div>

                        {/* Extension */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Extension
                            </label>
                            <select
                                value={selectedExtension}
                                onChange={(e) => setSelectedExtension(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition"
                            >
                                {extensions.map(ext => (
                                    <option key={ext} value={ext}>{ext}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre de possession */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Possession
                            </label>
                            <select
                                value={ownershipFilter}
                                onChange={(e) => setOwnershipFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition"
                            >
                                <option value="All">Toutes les cartes</option>
                                <option value="Owned">Possédées uniquement</option>
                                <option value="NotOwned">Non possédées uniquement</option>
                            </select>
                        </div>
                    </div>

                    {/* Compteur de résultats */}
                    <div className="mt-4 text-center">
                        <span className="text-gray-400">
                            {filteredCards.length} carte(s) affichée(s)
                        </span>
                        {ownershipFilter === 'Owned' && (
                            <span className="ml-2 text-green-400 font-semibold">
                                • Possédées
                            </span>
                        )}
                        {ownershipFilter === 'NotOwned' && (
                            <span className="ml-2 text-red-400 font-semibold">
                                • Non possédées
                            </span>
                        )}
                    </div>
                </div>

                {/* Cartes par extension */}
                {selectedExtension === 'All' ? (
                    // Affichage groupé par extension
                    Object.entries(cardsByExtension).map(([extensionName, cards]) => (
                        <div key={extensionName} className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-white">
                                    {extensionName}
                                </h2>
                                <div className="text-gray-400">
                                    <span className="text-amber-400 font-bold">
                                        {cards.filter(c => hasCard(c.id)).length}
                                    </span>
                                    /{cards.length} cartes
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {cards.map(card => (
                                    <CollectionCardDisplay key={card.id} card={card} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Affichage pour une extension spécifique
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">
                                {selectedExtension}
                            </h2>
                            <div className="text-gray-400">
                                <span className="text-amber-400 font-bold">
                                    {filteredCards.filter(c => hasCard(c.id)).length}
                                </span>
                                /{filteredCards.length} cartes
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCards.map(card => (
                                <CollectionCardDisplay key={card.id} card={card} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Message si aucune carte */}
                {filteredCards.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-400">Aucune carte trouvée</p>
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {selectedCard && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedCard(null)}
                >
                    <div
                        className="bg-slate-800 rounded-xl max-w-3xl w-full p-8 border-2 border-amber-500/50 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedCard.name}</h2>
                                <p className="text-gray-400">{selectedCard.publicCode}</p>
                                {hasCard(selectedCard.id) && (
                                    <div className="mt-2 inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">
                                        ✓ Dans votre collection (x{getCardQuantity(selectedCard.id)})
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="text-gray-400 hover:text-white text-2xl transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={selectedCard.cardImage?.url}
                                    alt={selectedCard.name}
                                    className="w-full rounded-lg shadow-2xl"
                                />
                            </div>

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
                                    <p className="text-white bg-slate-700/50 p-3 rounded text-sm">
                                        {cleanText(selectedCard.text)}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-gray-400">Extension:</span>
                                    <span className="ml-2 text-white">{selectedCard.setName}</span>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-slate-700 pt-4 space-y-3">
                                    {hasCard(selectedCard.id) ? (
                                        <>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateQuantity(selectedCard.id, getCardQuantity(selectedCard.id) + 1)}
                                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                                                >
                                                    + Ajouter
                                                </button>
                                                <button
                                                    onClick={() => updateQuantity(selectedCard.id, Math.max(0, getCardQuantity(selectedCard.id) - 1))}
                                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                                                >
                                                    - Retirer
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeCard(selectedCard.id)}
                                                className="w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-900 transition font-semibold"
                                            >
                                                🗑️ Supprimer de la collection
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => addCard(selectedCard.id, 1)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-amber-600 transition font-semibold"
                                        >
                                            + Ajouter à ma collection
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collection;
