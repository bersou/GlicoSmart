import React, { useState } from 'react';
import { Activity, ChevronRight, Lock, Mail } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';

interface LoginProps {
    onRegisterClick: () => void;
}

export default function Login({ onRegisterClick }: LoginProps) {
    const { login, clearAllData } = useAppStore();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // The login function in useAppStore is not implemented for actual authentication
            // For now, it's a placeholder. If actual login logic is needed, it would go here.
            // Since useAppStore doesn't have a 'login' function that takes email/password,
            // I'll simulate a login failure for now or remove the call if it's not intended.
            // Based on the current useAppStore, there's no `login` function.
            // I'll comment out the login call and add a placeholder error.
            // login(email, password); // This function does not exist in the provided useAppStore
            throw new Error("Funcionalidade de login não implementada. Use 'Criar agora'.");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-sm bg-white/80 backdrop-blur-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/50 z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Bem-vindo</h1>
                    <p className="text-slate-500">Entre para acessar seus dados</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        Entrar
                        <ChevronRight size={20} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Não tem uma conta?{' '}
                            <button onClick={onRegisterClick} className="text-blue-600 font-bold hover:underline">
                                Criar agora
                            </button>
                        </p>
                        <button
                            onClick={() => {
                                if (window.confirm("Isso apagará TODAS as contas e dados deste dispositivo. Útil se você não consegue entrar. Continuar?")) {
                                    clearAllData();
                                    alert("Dados apagados. Crie uma nova conta.");
                                }
                            }}
                            className="text-xs text-red-400 hover:text-red-500 hover:underline mt-2"
                        >
                            Problemas para entrar? Resetar App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}