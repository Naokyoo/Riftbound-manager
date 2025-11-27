import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || 'Erreur lors de la connexion');
                return;
            }
            navigate('/collection');
        } catch (err) {
            setError(err.message || 'Erreur lors de la connexion');
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
                        Connexion
                    </h2>
                    <p className="text-gray-400">
                        Accédez à votre collection Riftbound
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

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700/50 border border-amber-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>

                        {/* Lien vers inscription */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                Pas encore de compte ?{' '}
                                <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-semibold">
                                    S'inscrire
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Compte de démonstration */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-amber-500/10 p-4">
                    <p className="text-gray-400 text-xs text-center mb-2">
                        💡 Compte de test
                    </p>
                    <div className="text-center space-y-1">
                        <p className="text-gray-500 text-xs">Email: demo@riftbound.com</p>
                        <p className="text-gray-500 text-xs">Mot de passe: demo123</p>
                    </div>
                    <button
                        onClick={() => {
                            setEmail('demo@riftbound.com');
                            setPassword('demo123');
                        }}
                        className="w-full mt-3 text-amber-400 hover:text-amber-300 text-xs font-semibold"
                    >
                        Utiliser le compte de test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
