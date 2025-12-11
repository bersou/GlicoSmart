import React, { useState } from 'react';
import { ChevronRight, Upload, Camera, LogIn } from 'lucide-react';

interface UserProfileFormData {
    name: string;
    age: string;
    weight: string;
    photo: string | null; // Base64 string
}

interface OnboardingProps {
    onComplete: (formData: Omit<UserProfileFormData, 'avatarId'>) => void;
    onLogin?: () => void; // Optional for existing user login flow
}

export default function Onboarding({ onComplete, onLogin }: OnboardingProps) {
    const [formData, setFormData] = useState<UserProfileFormData>({
        name: '',
        age: '',
        weight: '',
        photo: null // Base64 string
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [existingUser, setExistingUser] = useState<UserProfileFormData | null>(null);

    React.useEffect(() => {
        const stored = localStorage.getItem('glicosmart_users');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed['default_user']) {
                setExistingUser(parsed['default_user'].profile);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 10MB limit
            if (file.size > 10 * 1024 * 1024) {
                alert("A imagem deve ter menos de 10MB");
                return;
            }

            try {
                const compressedBase64 = await compressImage(file);
                setFormData({ ...formData, photo: compressedBase64 });
                setPreviewUrl(compressedBase64);
            } catch (error) {
                console.error("Erro ao comprimir imagem:", error);
                alert("Erro ao processar imagem. Tente outra.");
            }
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to JPEG with 0.7 quality
                    } else {
                        reject(new Error("Could not get 2D context for canvas"));
                    }
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        onComplete(formData);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-sm bg-white/80 backdrop-blur-lg rounded-[2.5rem] p-8 shadow-2xl border border-white/50 z-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                        {existingUser ? `Olá, ${existingUser.name}!` : 'Bem-vindo(a)'}
                    </h1>
                    <p className="text-slate-500">
                        {existingUser ? 'Que bom te ver de novo' : 'Configure seu perfil para começar'}
                    </p>
                </div>

                {existingUser ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-emerald-500 shadow-xl mb-6">
                            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-slate-100 flex items-center justify-center">
                                {existingUser.photo ? (
                                    <img src={existingUser.photo} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-slate-400">{existingUser.name.charAt(0)}</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onLogin}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            Entrar
                            <LogIn size={20} />
                        </button>

                        <button
                            onClick={() => setExistingUser(null)}
                            className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                        >
                            Não é você? Criar novo perfil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleNext} className="space-y-6">

                        {/* Photo Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ${previewUrl ? 'bg-black' : 'bg-slate-100'}`}>
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={40} className="text-slate-300" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 cursor-pointer transition-transform hover:scale-110 active:scale-95">
                                    <Upload size={16} />
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                            <span className="text-xs text-slate-400 mt-2 font-medium">Toque para adicionar foto</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Seu Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Bernardo"
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Idade</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="00"
                                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 ml-1 mb-2">Peso (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="00.0"
                                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            Entrar no App
                            <ChevronRight size={20} />
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    {/* Simplified: No login link needed */}
                </div>

            </div>
        </div>
    );
}