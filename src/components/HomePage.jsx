import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTQwQUYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTAgMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHpNMjYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Gérez votre collection
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                Riftbound
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            L'outil ultime pour organiser vos cartes, construire des decks compétitifs et dominer le jeu
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105"
                            >
                                Commencer gratuitement
                            </button>
                            <button
                                onClick={() => navigate('/database')}
                                className="bg-slate-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-700/50 transition border border-amber-500/30"
                            >
                                Voir la démo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-900/50 to-amber-900/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Prêt à améliorer votre jeu ?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Rejoignez des milliers de joueurs qui utilisent Riftbound Manager
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-400 hover:to-yellow-400 transition transform hover:scale-105"
                    >
                        Commencer maintenant
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/80 border-t border-amber-500/20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border-t border-amber-500/20 mt-12 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2025 Riftbound Manager. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;