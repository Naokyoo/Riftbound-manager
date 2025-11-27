import React, { useEffect } from 'react';

const CardNotification = ({ card, quantity, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border-2 border-amber-500/50 overflow-hidden max-w-sm backdrop-blur-xl">
                <div className="flex items-center gap-4 p-4">
                    {/* Image de la carte */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-28 rounded-lg overflow-hidden shadow-lg border-2 border-amber-400/30 transform hover:scale-105 transition-transform">
                            <img
                                src={card.cardImage?.url}
                                alt={card.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Badge de quantité */}
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">
                            +{quantity}
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-base truncate">
                                    {card.name}
                                </p>
                                <p className="text-amber-400 text-xs">
                                    {card.rarity?.label}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition flex-shrink-0"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
                            <p className="text-green-400 text-sm font-semibold flex items-center gap-2">
                                <span className="text-lg">✓</span>
                                Ajoutée à votre collection !
                            </p>
                        </div>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="h-1 bg-slate-700">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 animate-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default CardNotification;
