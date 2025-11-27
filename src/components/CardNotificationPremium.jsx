import React, { useEffect, useState } from 'react';

/**
 * Notification Premium avec image de carte
 * Plusieurs styles disponibles: default, minimal, epic
 */

const CardNotificationPremium = ({ card, quantity, onClose, style = 'default' }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    // Style par défaut - Élégant avec image
    if (style === 'default') {
        return (
            <div className={`fixed top-20 right-4 z-50 ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
                <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl shadow-2xl border-2 border-amber-500/50 overflow-hidden max-w-sm backdrop-blur-xl animate-glow">
                    <div className="flex items-center gap-4 p-4">
                        {/* Image de la carte avec effet brillant */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-32 rounded-lg overflow-hidden shadow-xl border-2 border-amber-400/50 transform hover:scale-110 transition-transform duration-300 relative group">
                                <img
                                    src={card.cardImage?.url}
                                    alt={card.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Effet de brillance qui passe */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                            {/* Badge de quantité avec animation */}
                            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-lg border-2 border-white animate-bounce-in">
                                +{quantity}
                            </div>
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-lg truncate">
                                        {card.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-amber-400 text-xs font-semibold">
                                            {card.rarity?.label}
                                        </span>
                                        <span className="text-gray-500 text-xs">•</span>
                                        <span className="text-gray-400 text-xs">
                                            {card.cardType?.[0]?.label}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-white transition hover:rotate-90 transform duration-300 flex-shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg px-3 py-2 backdrop-blur-sm">
                                <p className="text-green-400 text-sm font-semibold flex items-center gap-2">
                                    <span className="text-lg animate-pulse">✓</span>
                                    Ajoutée à la collection !
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barre de progression animée */}
                    <div className="h-1 bg-slate-700 relative overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 animate-progress absolute inset-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Style minimal - Compact et discret
    if (style === 'minimal') {
        return (
            <div className={`fixed top-20 right-4 z-50 ${isExiting ? 'animate-fade-out' : 'animate-slide-in-right'}`}>
                <div className="bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-amber-500/30 p-3 flex items-center gap-3 max-w-xs">
                    <div className="w-12 h-16 rounded overflow-hidden shadow-lg border border-amber-400/30 flex-shrink-0">
                        <img
                            src={card.cardImage?.url}
                            alt={card.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{card.name}</p>
                        <p className="text-green-400 text-xs">✓ Ajoutée (+{quantity})</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-sm">✕</button>
                </div>
            </div>
        );
    }

    // Style epic - Grande et impressionnante
    if (style === 'epic') {
        return (
            <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${isExiting ? 'animate-scale-out' : 'animate-scale-in'}`}>
                <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-2xl border-4 border-amber-500/70 overflow-hidden backdrop-blur-xl animate-pulse-glow max-w-md">
                    <div className="relative">
                        {/* Effet de particules */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent animate-pulse"></div>
                        
                        <div className="p-8 text-center">
                            {/* Grande image de carte */}
                            <div className="relative inline-block mb-6">
                                <div className="w-48 h-64 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-400 transform hover:scale-105 transition-transform duration-300 animate-float">
                                    <img
                                        src={card.cardImage?.url}
                                        alt={card.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Badge énorme de quantité */}
                                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-900 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-white animate-bounce-in">
                                    +{quantity}
                                </div>
                                {/* Étoiles décoratives */}
                                <div className="absolute -top-2 -left-2 text-yellow-400 text-2xl animate-spin-slow">✨</div>
                                <div className="absolute -bottom-2 -right-2 text-yellow-400 text-2xl animate-spin-slow" style={{ animationDelay: '0.5s' }}>✨</div>
                            </div>

                            {/* Titre */}
                            <h3 className="text-3xl font-bold text-white mb-2 gradient-text">
                                {card.name}
                            </h3>
                            
                            {/* Rareté */}
                            <div className="inline-block px-4 py-2 bg-amber-500/20 border border-amber-500 rounded-full mb-4">
                                <span className="text-amber-400 font-bold">{card.rarity?.label}</span>
                            </div>

                            {/* Message */}
                            <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-500 rounded-xl px-6 py-4 mb-6">
                                <p className="text-green-300 text-lg font-bold flex items-center justify-center gap-2">
                                    <span className="text-2xl animate-pulse">✓</span>
                                    AJOUTÉE À VOTRE COLLECTION !
                                </p>
                            </div>

                            {/* Bouton fermer */}
                            <button
                                onClick={handleClose}
                                className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105"
                            >
                                Continuer
                            </button>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="h-2 bg-slate-700 relative overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 animate-progress absolute inset-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default CardNotificationPremium;
