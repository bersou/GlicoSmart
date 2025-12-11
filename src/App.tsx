import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './hooks/useAppStore';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import AIChat from './components/AIChat';
import Intro from './components/Intro'; // Updated import
import HistoryPage from './pages/HistoryPage';
import HealthTipsPage from './pages/HealthTipsPage';
import StatisticsPage from './pages/StatisticsPage';
import BottomNavigationBar from './components/BottomNavigationBar';

// Definindo as interfaces para os tipos de dados
interface UserProfile {
    name: string;
    age: string;
    weight: string;
    photo: string | null;
    email: string;
}

interface Reading {
    id: string;
    value: number;
    period: string;
    timestamp: string;
    notes?: string;
}

export default function App() {
    const { userProfile, readings, addReading, updateReading, deleteReading, logout, register } = useAppStore();
    const [showIntro, setShowIntro] = useState<boolean>(() => {
        return !sessionStorage.getItem('glicosmart_intro_seen');
    });

    const handleStart = () => {
        sessionStorage.setItem('glicosmart_intro_seen', 'true');
        setShowIntro(false);
    };

    const handleRegister = (formData: Omit<UserProfile, 'email'>) => {
        try {
            register(formData);
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (showIntro) {
        return <Intro onStart={handleStart} />;
    }

    // Se o perfil do usuário existe, renderiza o aplicativo principal
    if (userProfile) {
        return (
            <Router>
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/20">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard
                                    userProfile={userProfile as UserProfile}
                                    readings={readings as Reading[]}
                                    addReading={addReading}
                                    updateReading={updateReading}
                                    deleteReading={deleteReading}
                                    onLogout={logout}
                                />
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <HistoryPage
                                    readings={readings as Reading[]}
                                    deleteReading={deleteReading}
                                    updateReading={updateReading}
                                />
                            }
                        />
                        <Route
                            path="/statistics"
                            element={<StatisticsPage readings={readings as Reading[]} />}
                        />
                        <Route
                            path="/tips"
                            element={<HealthTipsPage />}
                        />
                    </Routes>
                    <AIChat userProfile={userProfile as UserProfile} lastReading={readings[0] as Reading} />
                    <BottomNavigationBar />
                </div>
            </Router>
        );
    }

    // Se não há perfil, mostra o Onboarding para registro
    return <Onboarding onComplete={handleRegister} />;
}