import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Decks from './pages/Decks';
import DeckBuilder from './pages/DeckBuilder';  // ← AJOUTÉ
import Database from './pages/Database';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen">
                    <Navbar />
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<Home />} />
                        <Route path="/database" element={<Database />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Routes protégées */}
                        <Route
                            path="/collection"
                            element={
                                <ProtectedRoute>
                                    <Collection />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/decks"
                            element={
                                <ProtectedRoute>
                                    <Decks />
                                </ProtectedRoute>
                            }
                        />
                        {/* ← AJOUTÉ : Route pour l'éditeur de deck */}
                        <Route
                            path="/deck-builder/:deckId"
                            element={
                                <ProtectedRoute>
                                    <DeckBuilder />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;