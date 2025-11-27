import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        // Validation du nom d'utilisateur
        if (formData.username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez entrer un email valide');
            return false;
        }

        // Validation du mot de passe
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        // Vérification de la confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData.username, formData.email, formData.password);
            if (!result.success) {
                setError(result.error || 'Erreur lors de l\'inscription');
                return;
            }
            navigate('/collection');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo et titre */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-3xl">R</span>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Inscription
                    </h2>
                    <p className="text-gray-400">
                        Créez votre compte et commencez votre collection
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Message d'erreur */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Nom d'utilisateur */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                                placeholder="JoueurRiftbound"
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                                placeholder="votre@email.com"
                                disabled={loading}
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Minimum 6 caractères
                            </p>
                        </div>

                        {/* Confirmation du mot de passe */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/* Bouton d'inscription */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Création...' : 'Créer mon compte'}
                        </button>

                        {/* Lien vers connexion */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                Déjà un compte ?{' '}
                                <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Avantages */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-amber-500/10 p-4">
                    <p className="text-gray-400 text-xs font-semibold mb-3 text-center">
                        Pourquoi créer un compte ?
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <p className="text-gray-400 text-xs">Sauvegarde de votre collection</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <p className="text-gray-400 text-xs">Gestion de vos decks</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <p className="text-gray-400 text-xs">Statistiques personnalisées</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-amber-400">✓</span>
                            <p className="text-gray-400 text-xs">100% gratuit</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
