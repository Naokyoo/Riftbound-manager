import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollection } from '../hooks/useCollection';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { getStats } = useCollection();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Récupérer les statistiques de collection
    const stats = getStats();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
        }
    }, [user]);

    const handleSaveProfile = () => {
        if (username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return;
        }

        try {
            updateProfile({ username, avatar: username.charAt(0).toUpperCase() });
            setSuccess('Profil mis à jour avec succès !');
            setError('');
            setIsEditing(false);

            // Effacer le message de succès après 3 secondes
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateCompletionPercentage = () => {
        // Supposons qu'il y a 500 cartes au total (tu peux ajuster selon ta base)
        const totalCardsInGame = 500;
        return Math.round((stats.uniqueCards / totalCardsInGame) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Mon Profil
                    </h1>
                    <p className="text-xl text-gray-300">
                        Gérez vos informations et consultez vos statistiques
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                        <p className="text-red-400 text-center">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                        <p className="text-green-400 text-center">{success}</p>
                    </div>
                )}

                {/* Informations du profil */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20 mb-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-4xl">{user?.avatar}</span>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            ✓ Enregistrer
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setUsername(user.username);
                                                setError('');
                                            }}
                                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                                        >
                                            ✕ Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-amber-400 hover:text-amber-300 text-sm"
                                        >
                                            ✏️ Modifier
                                        </button>
                                    </div>
                                    <p className="text-gray-400">{user?.email}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Membre depuis {formatDate(user?.createdAt)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badge de niveau */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Niveau de collection</span>
                            <span className="text-amber-400 font-bold">{calculateCompletionPercentage()}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-blue-600 to-amber-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${calculateCompletionPercentage()}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Statistiques détaillées */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-lg">Statistiques de collection</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-amber-500/10">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                    {stats.totalCards}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">Cartes totales</div>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-amber-500/10">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                    {stats.uniqueCards}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">Cartes uniques</div>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-amber-500/10">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                    {Object.keys(stats.rarityCount).length}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">Raretés</div>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-amber-500/10">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                    {calculateCompletionPercentage()}%
                                </div>
                                <div className="text-gray-400 text-sm mt-1">Complétion</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Répartition par rareté */}
                {Object.keys(stats.rarityCount).length > 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20 mb-8">
                        <h3 className="text-white font-semibold mb-4 text-lg">Répartition par rareté</h3>
                        <div className="space-y-3">
                            {Object.entries(stats.rarityCount)
                                .sort((a, b) => b[1] - a[1])
                                .map(([rarity, count]) => (
                                    <div key={rarity}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300">{rarity}</span>
                                            <span className="text-amber-400 font-semibold">{count} cartes</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-600 to-amber-500 h-2 rounded-full"
                                                style={{ width: `${(count / stats.totalCards) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Répartition par type */}
                {Object.keys(stats.typeCount).length > 0 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
                        <h3 className="text-white font-semibold mb-4 text-lg">Répartition par type</h3>
                        <div className="space-y-3">
                            {Object.entries(stats.typeCount)
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, count]) => (
                                    <div key={type}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-300">{type}</span>
                                            <span className="text-amber-400 font-semibold">{count} cartes</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-600 to-amber-500 h-2 rounded-full"
                                                style={{ width: `${(count / stats.totalCards) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
