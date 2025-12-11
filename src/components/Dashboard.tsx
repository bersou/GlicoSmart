import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement } from 'chart.js';
import { Trash2, Plus, X, Camera, LogOut, Activity, Pencil, Check, History, Upload, User, Calendar, Weight, Settings } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatsCard from './StatsCard';
import { analyzeReading } from '../utils/glucoseLogic';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement);

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

interface DashboardProps {
  userProfile: UserProfile;
  readings: Reading[];
  addReading: (value: number, period?: string, notes?: string, timestamp?: string | null) => void;
  updateReading: (id: string, newValues: Partial<Reading>) => void;
  deleteReading: (id: string) => void;
  onLogout: () => void;
}

// Helper function to map analysis color to hex for Chart.js
const getPointColor = (value: number) => {
  const analysis = analyzeReading(value);
  switch (analysis.color) {
    case 'text-red-700': return '#ef4444'; // Red-500
    case 'text-emerald-700': return '#10b981'; // Emerald-500
    case 'text-orange-700': return '#f97316'; // Orange-500
    default: return '#64748b'; // Slate-500 (default)
  }
};

export default function Dashboard({ userProfile, readings, addReading, updateReading, deleteReading, onLogout }: DashboardProps) {
  const { updateProfile } = useAppStore();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [period, setPeriod] = useState<string>('random');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [showPhotoEdit, setShowPhotoEdit] = useState<boolean>(false);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    name: userProfile.name,
    age: userProfile.age,
    weight: userProfile.weight
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    let timestamp = new Date().toISOString();
    if (date && time) {
      timestamp = new Date(`${date}T${time}`).toISOString();
    }
    if (editingId) {
      updateReading(editingId, { value: Number(inputValue), period, timestamp });
      setEditingId(null);
    } else {
      addReading(Number(inputValue), period, '', timestamp);
    }
    setInputValue('');
    setPeriod('random');
    setDate('');
    setTime('');
    setShowInput(false);
  };

  const handleEdit = (reading: Reading) => {
    setEditingId(reading.id);
    setInputValue(reading.value.toString());
    setPeriod(reading.period);
    const d = new Date(reading.timestamp);
    setDate(d.toISOString().split('T')[0]);
    setTime(d.toTimeString().slice(0, 5));
    setShowInput(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInputValue('');
    setPeriod('random');
    setDate('');
    setTime('');
    setShowInput(false);
  };

  const openInput = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(now.toTimeString().slice(0, 5));
    setShowInput(true);
  };

  const handleLogout = () => {
    if (window.confirm("Deseja sair da sua conta?")) {
      onLogout();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        alert("A imagem deve ter menos de 10MB");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setNewPhoto(compressedBase64);
        setShowPhotoEdit(true);
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

  const savePhoto = () => {
    if (newPhoto) {
      updateProfile({ photo: newPhoto });
      setShowPhotoEdit(false);
      setNewPhoto(null);
    }
  };

  const cancelPhotoEdit = () => {
    setShowPhotoEdit(false);
    setNewPhoto(null);
  };

  const openProfileEdit = () => {
    setProfileData({
      name: userProfile.name,
      age: userProfile.age,
      weight: userProfile.weight
    });
    setShowProfileEdit(true);
  };

  const saveProfile = () => {
    updateProfile({
      name: profileData.name,
      age: profileData.age,
      weight: profileData.weight
    });
    setShowProfileEdit(false);
  };

  const cancelProfileEdit = () => {
    setShowProfileEdit(false);
    setProfileData({
      name: userProfile.name,
      age: userProfile.age,
      weight: userProfile.weight
    });
  };

  const lastReading = readings[0];

  // --- Chart 1: Timeline (Line Chart) ---
  const chartReadings = [...readings].slice(0, 15).reverse();
  const lineChartData = {
    labels: chartReadings.map(r => format(parseISO(r.timestamp), 'dd/MM HH:mm')),
    datasets: [
      {
        fill: true,
        data: chartReadings.map(r => r.value),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        tension: 0.4,
        pointBackgroundColor: chartReadings.map(r => getPointColor(r.value)), // Dynamic color
        pointBorderColor: chartReadings.map(r => getPointColor(r.value)), // Dynamic color
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx: any) => `${ctx.raw} mg/dL`,
          title: (ctx: any) => ctx[0].label
        }
      }
    },
    scales: {
      y: {
        display: false
      },
      x: {
        display: false
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // --- Chart 2: General Average (Doughnut) ---
  const totalReadings = readings.length;
  const averageGlucose = totalReadings > 0 ? Math.round(readings.reduce((acc, curr) => acc + curr.value, 0) / totalReadings) : 0;

  // Count readings by category
  const counts = {
    low: 0,
    normal: 0,
    high: 0
  };
  readings.forEach(r => {
    if (r.value < 70) counts.low++;
    else if (r.value <= 144) counts.normal++;
    else counts.high++;
  });

  const doughnutData = {
    labels: ['Baixa', 'Normal', 'Alta'],
    datasets: [
      {
        data: totalReadings > 0 ? [counts.low, counts.normal, counts.high] : [0, 1, 0], // Fallback if empty
        backgroundColor: [
          '#ef4444', // Red (Low)
          '#10b981', // Emerald (Normal)
          '#f97316', // Orange (High)
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="pb-32 px-5 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full p-[3px] bg-gradient-to-tr from-blue-500 to-emerald-500 shadow-lg shadow-blue-500/20 relative group">
            <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
              {userProfile.photo ? (
                <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-slate-700 bg-slate-100 w-full h-full flex items-center justify-center">
                  {userProfile.name.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload size={20} className="text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Olá,</p>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{userProfile.name}</h2>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={openProfileEdit} 
                className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-95"
                title="Editar Perfil"
            >
                <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95">
                <LogOut size={20} />
            </button>
        </div>
      </div>

      {/* Photo Edit Modal */}
      {showPhotoEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Alterar Foto de Perfil</h3>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                {newPhoto ? (
                  <img src={newPhoto} alt="New profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <Camera size={32} className="text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={cancelPhotoEdit}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Cancelar
              </button>
              <button 
                onClick={savePhoto}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-lg mb-4">Editar Perfil</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Idade</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                      placeholder="00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Peso (kg)</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                      placeholder="00.0"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={cancelProfileEdit}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Cancelar
              </button>
              <button 
                onClick={saveProfile}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Card */}
      <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-300">
        <StatsCard latestReading={lastReading} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Timeline Chart */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <h3 className="font-bold text-slate-700 text-lg">Evolução</h3>
              <p className="text-xs text-slate-400 font-medium">Últimos registros</p>
            </div>
          </div>
          <div className="h-40 w-full">
            {readings.length > 1 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                Dados insuficientes
              </div>
            )}
          </div>
        </div>

        {/* General Average & Distribution */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
          {/* Text Info */}
          <div className="z-10">
            <h3 className="font-bold text-slate-700 text-lg mb-1">Média Geral</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">
                {averageGlucose}
              </span>
              <span className="text-sm font-bold text-slate-400">mg/dL</span>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Normal ({counts.normal})
              </div>
              <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Alerta ({counts.high})
              </div>
              <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Baixo ({counts.low})
              </div>
            </div>
          </div>

          {/* Doughnut Chart */}
          <div className="w-32 h-32 relative flex-shrink-0">
            {totalReadings > 0 ? (
              <Doughnut data={doughnutData} options={{
                cutout: '75%',
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: '#0f172a',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                      label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return ` ${label}: ${value}`;
                      }
                    }
                  }
                }
              }} />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-slate-100 flex items-center justify-center text-slate-300">
                <Activity size={24} />
              </div>
            )}
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Activity size={20} className="text-slate-300 mb-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mb-8 relative z-20">
        {showInput ? (
          <form onSubmit={handleAdd} className="w-full bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700 text-lg">
                {editingId ? 'Editar Leitura' : 'Nova Leitura'}
              </h3>
              <button type="button" onClick={cancelEdit} className="bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {/* Glucose Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Glicemia (mg/dL)</label>
                <input
                  type="number"
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="000"
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-4xl font-black text-slate-800 px-5 py-5 outline-none transition-all placeholder:text-slate-300 text-center"
                />
              </div>

              {/* Period Select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Período</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-lg font-bold text-slate-700 px-5 py-4 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="jejum">Jejum (Manhã)</option>
                  <option value="pos-almoco">Pós-Almoço</option>
                  <option value="noite">Noite</option>
                  <option value="random">Aleatório</option>
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold text-slate-700 px-4 py-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm font-bold text-slate-700 px-4 py-4 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-5 font-bold text-lg shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 mt-2"
              >
                {editingId ? (
                  <>
                    <Check size={24} strokeWidth={3} />
                    <span>Salvar Alterações</span>
                  </>
                ) : (
                  <>
                    <Plus size={24} strokeWidth={3} />
                    <span>Adicionar Leitura</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={openInput}
            className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="bg-white/20 p-1.5 rounded-full">
              <Plus size={20} strokeWidth={3} />
            </div>
            Registrar
          </button>
        )}
      </div>

      {/* Link to History Page */}
      <div className="flex justify-center mb-8 relative z-20">
        <Link
          to="/history"
          className="w-full py-4 bg-blue-600 text-white rounded-3xl font-bold text-lg shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            <History size={20} strokeWidth={3} />
          </div>
          Ver Histórico Completo
        </Link>
      </div>
    </div>
  );
}