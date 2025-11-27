import React from 'react';

const HomePage = () => {
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
                            <button className="bg-gradient-to-r from-blue-600 to-amber-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-amber-600 transition transform hover:scale-105">
                                Commencer gratuitement
                            </button>
                            <button className="bg-slate-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-700/50 transition border border-amber-500/30">
                                Voir la démo
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                        {[
                            { value: '500+', label: 'Cartes disponibles' },
                            { value: '1000+', label: 'Joueurs actifs' },
                            { value: '50+', label: 'Decks partagés' },
                            { value: '100%', label: 'Gratuit' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Fonctionnalités puissantes</h2>
                        <p className="text-gray-400 text-lg">Tout ce dont vous avez besoin pour gérer votre collection</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '📚',
                                title: 'Gestion de collection',
                                description: 'Organisez votre collection de cartes avec un système intuitif de suivi et de recherche.'
                            },
                            {
                                icon: '🎴',
                                title: 'Construction de decks',
                                description: 'Créez et optimisez vos decks avec des outils avancés d\'analyse et de synergies.'
                            },
                            {
                                icon: '🔍',
                                title: 'Base de données complète',
                                description: 'Accédez à toutes les cartes Riftbound avec statistiques, images et détails.'
                            },
                            {
                                icon: '📊',
                                title: 'Statistiques avancées',
                                description: 'Analysez votre collection avec des graphiques et métriques détaillés.'
                            },
                            {
                                icon: '🎯',
                                title: 'Filtres intelligents',
                                description: 'Trouvez rapidement les cartes dont vous avez besoin avec des filtres puissants.'
                            },
                            {
                                icon: '💾',
                                title: 'Sauvegarde cloud',
                                description: 'Synchronisez vos données sur tous vos appareils en toute sécurité.'
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/50 transition transform hover:scale-105"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Comment ça marche ?</h2>
                        <p className="text-gray-400 text-lg">Commencez en quelques étapes simples</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Créez votre compte',
                                description: 'Inscrivez-vous gratuitement en quelques secondes'
                            },
                            {
                                step: '02',
                                title: 'Ajoutez vos cartes',
                                description: 'Importez ou saisissez votre collection'
                            },
                            {
                                step: '03',
                                title: 'Construisez vos decks',
                                description: 'Créez des decks compétitifs et dominez'
                            },
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-8xl font-bold text-amber-500/10 absolute -top-8 -left-4">
                                    {step.step}
                                </div>
                                <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
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
                    <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:from-amber-400 hover:to-yellow-400 transition transform hover:scale-105">
                        Commencer maintenant
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900/80 border-t border-amber-500/20 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">R</span>
                                </div>
                                <span className="text-white font-bold">Riftbound Manager</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                L'outil ultime pour gérer votre collection Riftbound
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Produit</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Fonctionnalités</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Tarifs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Guide</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Ressources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Légal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Confidentialité</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Conditions</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-amber-500/20 mt-12 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; 2025 Riftbound Manager. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;