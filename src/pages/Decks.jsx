import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecks } from '../hooks/useDecks';
import cardsData from '../data/cards.json';

const Decks = () => {
    const navigate = useNavigate();
    const { decks, createDeck, deleteDeck, duplicateDeck, getDeckStats } = useDecks();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [selectedLegend, setSelectedLegend] = useState(null);
    const [searchLegend, setSearchLegend] = useState('');

    // États pour la modale de suppression
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState(null);

    const legends = cardsData.filter(card =>
        card.cardType?.some(type => type.label === 'Legend')
    );

    const filteredLegends = legends.filter(legend =>
        legend.name.toLowerCase().includes(searchLegend.toLowerCase())
    );

    const handleCreateDeck = async () => {
        if (!selectedLegend) {
            alert('Veuillez sélectionner une légende');
            return;
        }

        const name = deckName.trim() || `Deck ${selectedLegend.name}`;
        const newDeck = await createDeck(name, selectedLegend);

        if (newDeck) {
            setShowCreateModal(false);
            setDeckName('');
            setSelectedLegend(null);
            setSearchLegend('');
            const newDeckId = newDeck._id || newDeck.id;
            navigate(`/deck-builder/${newDeckId}`);
        }
    };

    const handleDeleteDeck = (deckId) => {
        setDeckToDelete(deckId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deckToDelete) {
            const result = await deleteDeck(deckToDelete);
            if (result && !result.success) {
                alert(`Erreur lors de la suppression: ${result.error || 'Erreur inconnue'}`);
            }
            setShowDeleteModal(false);
            setDeckToDelete(null);
        }
    };

    const handleDuplicateDeck = async (deckId) => {
        const newDeck = await duplicateDeck(deckId);
        if (newDeck) {
            const newDeckId = newDeck._id || newDeck.id;
            navigate(`/deck-builder/${newDeckId}`);
        }
    };

    const getDomainColors = (domains) => {
        const colors = {
            Fury: 'text-red-400',
            Mind: 'text-blue-400',
            Order: 'text-yellow-400',
            Calm: 'text-green-400',
            Body: 'text-orange-400',
            Chaos: 'text-purple-400',
            Spirit: 'text-cyan-400'
        };
        return domains?.map(d => colors[d.label] || 'text-gray-400') || [];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">🃏 Mes Decks</h1>
                    <p className="text-xl text-gray-300">Créez et gérez vos decks compétitifs</p>
                </div>

                <div className="mb-8 text-center">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105 shadow-lg"
                    >
                        ➕ Créer un nouveau deck
                    </button>
                </div>

                {decks.length === 0 ? (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-12 rounded-xl border border-amber-500/20 text-center">
                        <div className="text-6xl mb-6">🎴</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Aucun deck créé</h2>
                        <p className="text-gray-400 mb-6">Construisez votre premier deck et dominez l'arène !</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map(deck => {
                            const deckId = deck._id || deck.id;
                            const stats = getDeckStats(deckId);
                            return (
                                <div key={deckId} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 overflow-hidden hover:border-amber-500/50 transition group">
                                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                                        {deck.legend?.cardImage?.url && (
                                            <img src={deck.legend.cardImage.url} alt={deck.legend.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white mb-1">{deck.name}</h3>
                                            <p className="text-sm text-gray-300">{deck.legend?.name}</p>
                                        </div>
                                        {stats?.isValid && (
                                            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">✓ Valide</div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {deck.domains?.map((domain, index) => (
                                                <span key={index} className={`text-xs px-2 py-1 bg-slate-700 rounded ${getDomainColors(deck.domains)[index]}`}>{domain.label}</span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                                <div className={`text-lg font-bold ${stats?.totalCards === 40 ? 'text-green-400' : 'text-amber-400'}`}>{stats?.totalCards || 0}</div>
                                                <div className="text-xs text-gray-400">Cartes</div>
                                            </div>
                                            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                                <div className={`text-lg font-bold ${stats?.totalRunes === 12 ? 'text-green-400' : 'text-purple-400'}`}>{stats?.totalRunes || 0}</div>
                                                <div className="text-xs text-gray-400">Runes</div>
                                            </div>
                                            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                                                <div className={`text-lg font-bold ${stats?.totalBattlefields === 3 ? 'text-green-400' : 'text-blue-400'}`}>{stats?.totalBattlefields || 0}</div>
                                                <div className="text-xs text-gray-400">Champs</div>
                                            </div>
                                        </div>

                                        <div className="text-center text-sm mb-4">
                                            <span className="text-gray-400">Total: </span>
                                            <span className={`font-bold ${stats?.totalDeckSize === 56 ? 'text-green-400' : 'text-white'}`}>{stats?.totalDeckSize || 0}/56</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => navigate(`/deck-builder/${deckId}`)} className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">✏️ Éditer</button>
                                            <button onClick={() => handleDuplicateDeck(deckId)} className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold">📋 Copier</button>
                                        </div>
                                        <button onClick={() => handleDeleteDeck(deckId)} className="w-full mt-2 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30 transition text-sm font-semibold">🗑️ Supprimer</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-amber-500/50" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Créer un nouveau deck</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nom du deck</label>
                                <input type="text" placeholder="Ex: Aggro Viktor, Control Mind..." value={deckName} onChange={(e) => setDeckName(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Choisir une légende</label>
                                <input type="text" placeholder="Rechercher une légende..." value={searchLegend} onChange={(e) => setSearchLegend(e.target.value)} className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 mb-4" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredLegends.map(legend => (
                                    <div key={legend.id} onClick={() => setSelectedLegend(legend)} className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${selectedLegend?.id === legend.id ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-slate-600 hover:border-amber-500/50'}`}>
                                        <div className="relative h-40 bg-slate-700">
                                            {legend.cardImage?.url && (<img src={legend.cardImage.url} alt={legend.name} className="w-full h-full object-cover" />)}
                                            {selectedLegend?.id === legend.id && (
                                                <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                                    <div className="bg-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">✓</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 bg-slate-800">
                                            <p className="text-white text-sm font-semibold truncate">{legend.name}</p>
                                            <div className="flex gap-1 mt-1">
                                                {legend.domains?.map((domain, index) => (
                                                    <span key={index} className={`text-xs ${getDomainColors(legend.domains)[index]}`}>{domain.label}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredLegends.length === 0 && (
                                <div className="text-center py-8 text-gray-400">Aucune légende trouvée</div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                            <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition">Annuler</button>
                            <button onClick={handleCreateDeck} disabled={!selectedLegend} className={`px-6 py-2 rounded-lg font-semibold transition ${selectedLegend ? 'bg-gradient-to-r from-blue-600 to-amber-500 text-white hover:from-blue-700 hover:to-amber-600' : 'bg-slate-700 text-gray-400 cursor-not-allowed'}`}>Créer le deck</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-slate-800 rounded-xl max-w-md w-full border-2 border-red-500/50 p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Supprimer le deck ?</h3>
                        <p className="text-gray-300 mb-6">Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Decks;