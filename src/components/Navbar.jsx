import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowUserMenu(false);
    };

    const navLinks = [
        { path: '/', label: 'Accueil' },
        { path: '/collection', label: 'Ma Collection', protected: true },
        { path: '/decks', label: 'Mes Decks', protected: true },
        { path: '/database', label: 'Base de données' },
    ];

    return (
        <nav className="bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <span className="text-white text-xl font-bold">Riftbound Manager</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-1">
                        {navLinks.map((link) => {
                            // Si le lien est protégé et l'utilisateur n'est pas connecté, ne pas l'afficher
                            if (link.protected && !isAuthenticated) {
                                return null;
                            }

                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${isActive(link.path)
                                        ? 'bg-gradient-to-r from-blue-600 to-amber-500 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bouton Connexion / Menu Utilisateur */}
                    <div className="relative">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-2 rounded-lg font-semibold transition border border-amber-500/20"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {user.avatar || user.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="hidden sm:inline">{user.username}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Menu déroulant */}
                                {showUserMenu && (
                                    <>
                                        {/* Overlay pour fermer le menu */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        ></div>

                                        {/* Menu */}
                                        <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg border border-amber-500/20 shadow-xl z-20">
                                            <div className="p-4 border-b border-slate-700">
                                                <p className="text-white font-semibold">{user.username}</p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="block px-4 py-2 text-gray-300 hover:bg-slate-700/50 rounded-lg transition"
                                                >
                                                    👤 Mon profil
                                                </Link>
                                                <Link
                                                    to="/collection"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="block px-4 py-2 text-gray-300 hover:bg-slate-700/50 rounded-lg transition"
                                                >
                                                    📚 Ma collection
                                                </Link>
                                                <Link
                                                    to="/decks"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="block px-4 py-2 text-gray-300 hover:bg-slate-700/50 rounded-lg transition"
                                                >
                                                    🎴 Mes decks
                                                </Link>
                                            </div>
                                            <div className="p-2 border-t border-slate-700">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition text-left"
                                                >
                                                    🚪 Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;