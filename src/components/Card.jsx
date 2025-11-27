import React from 'react';

const Card = ({ card, onClick }) => {
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

    // Couleurs de recyclage selon le domaine
    const domainRecycleColors = {
        Fury: 'from-red-600 to-red-500',
        Mind: 'from-blue-600 to-blue-500',
        Order: 'from-yellow-500 to-yellow-400',
        Calm: 'from-green-600 to-green-500',
        Body: 'from-orange-600 to-orange-500',
        Chaos: 'from-purple-600 to-purple-500',
        Spirit: 'from-cyan-600 to-cyan-500'
    };

    const rarity = card.rarity?.label || 'Common';
    const cardType = card.cardType?.[0]?.label || 'Unknown';
    const imageUrl = card.cardImage?.url || '';
    const energy = card.energy || 0;
    const recycleCost = card.power;
    const domains = card.domains || [];

    // Déterminer la couleur du recyclage selon le premier domaine
    const primaryDomain = domains[0]?.label || 'Calm';
    const recycleColor = domainRecycleColors[primaryDomain] || 'from-gray-600 to-gray-500';

    const cleanText = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/:\w+:/g, '')
            .replace(/\n/g, ' ')
            .trim();
    };

    return (
        <div
            onClick={() => onClick && onClick(card)}
            className={`bg-slate-800/90 rounded-xl overflow-hidden border-2 ${rarityBorders[rarity]} hover:scale-105 transition-transform cursor-pointer shadow-xl`}
        >
            <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
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

                <div className="absolute top-2 left-2 flex flex-col items-center gap-1">
                    {/* Energy - GRIS */}
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {energy}
                    </div>

                    {/* Coût de recyclage - COULEUR SELON LE DOMAINE */}
                    {recycleCost !== null && recycleCost !== undefined && (
                        <div className={`w-8 h-8 bg-gradient-to-br ${recycleColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                            {recycleCost}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{card.name}</h3>

                <div className="flex gap-2 mb-3 flex-wrap">
          <span className="text-xs px-2 py-1 bg-slate-700 text-amber-400 rounded">
            {cardType}
          </span>
                    {domains.length > 0 && (
                        <span className="text-xs px-2 py-1 bg-slate-700 text-blue-400 rounded">
              {domains.map(d => d.label).join(', ')}
            </span>
                    )}
                </div>

                {/* Texte de la carte (traduit en français) */}
                <p className="text-sm text-gray-300 italic mb-3 line-clamp-3">
                    {cleanText(card.text)}
                </p>

                {/* Extension */}
                <div className="text-xs text-gray-500 border-t border-slate-700 pt-2">
                    {card.setName} • {card.collectorNumber}
                </div>
            </div>
        </div>
    );
};

export default Card;