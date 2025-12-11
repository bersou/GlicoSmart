import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Trash2, Pencil, CalendarDays, Clock, X, Activity } from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { analyzeReading } from '../utils/glucoseLogic';
import * as XLSX from 'xlsx';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement);

interface Reading {
    id: string;
    value: number;
    period: string;
    timestamp: string;
    notes?: string;
}

interface HistoryPageProps {
    readings: Reading[];
    deleteReading: (id: string) => void;
    updateReading: (id: string, newValues: Partial<Reading>) => void;
}

export default function HistoryPage({ readings, deleteReading, updateReading }: HistoryPageProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editPeriod, setEditPeriod] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');

    const filteredReadings = readings.filter(reading => {
        const readingDate = parseISO(reading.timestamp);
        const matchesPeriod = selectedPeriod === 'all' || reading.period === selectedPeriod;

        let matchesDateRange = true;
        if (startDate && endDate) {
            const start = startOfDay(parseISO(startDate));
            const end = endOfDay(parseISO(endDate));
            matchesDateRange = isWithinInterval(readingDate, { start, end });
        } else if (startDate) {
            const start = startOfDay(parseISO(startDate));
            matchesDateRange = readingDate >= start;
        } else if (endDate) {
            const end = endOfDay(parseISO(endDate));
            matchesDateRange = readingDate <= end;
        }

        return matchesPeriod && matchesDateRange;
    });

    const handleDownloadExcel = () => {
        const data = filteredReadings.map(r => {
            const analysis = analyzeReading(r.value);
            return {
                Valor: r.value,
                Periodo: r.period,
                Data: format(parseISO(r.timestamp), "dd/MM/yyyy", { locale: ptBR }),
                Horario: format(parseISO(r.timestamp), "HH:mm", { locale: ptBR }),
                Status: analysis.status,
                Mensagem: analysis.message // Use the analysis message here
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Historico Glicemia");
        XLSX.writeFile(wb, "historico_glicemia.xlsx");
    };

    const startEditing = (reading: Reading) => {
        setEditingId(reading.id);
        setEditValue(reading.value.toString());
        setEditPeriod(reading.period);
        const d = parseISO(reading.timestamp);
        setEditDate(format(d, 'yyyy-MM-dd'));
        setEditTime(format(d, 'HH:mm'));
    };

    const saveEdit = (id: string) => {
        const newTimestamp = new Date(`${editDate}T${editTime}`).toISOString();
        updateReading(id, {
            value: Number(editValue),
            period: editPeriod,
            timestamp: newTimestamp
        });
        cancelEditing();
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValue('');
        setEditPeriod('');
        setEditDate('');
        setEditTime('');
    };

    // --- Chart 1: Timeline (Line Chart) ---
    const chartReadings = [...filteredReadings].slice(0, 15).reverse();
    const lineChartData = {
        labels: chartReadings.map(r => format(parseISO(r.timestamp), 'dd/MM HH:mm')),
        datasets: [
            {
                fill: true,
                data: chartReadings.map(r => r.value),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                    return gradient;
                },
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgb(16, 185, 129)',
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
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (ctx) => `${ctx.raw} mg/dL`,
                    title: (ctx) => ctx[0].label
                }
            }
        },
        scales: {
            y: { display: false },
            x: { display: false }
        },
        interaction: { intersect: false, mode: 'index' },
    };

    // --- Chart 2: General Average (Doughnut) ---
    const totalFilteredReadings = filteredReadings.length;
    const averageGlucose = totalFilteredReadings > 0
        ? Math.round(filteredReadings.reduce((acc, curr) => acc + curr.value, 0) / totalFilteredReadings)
        : 0;

    // Count readings by category
    const counts = { low: 0, normal: 0, high: 0 };
    filteredReadings.forEach(r => {
        if (r.value < 70) counts.low++;
        else if (r.value <= 144) counts.normal++;
        else counts.high++;
    });

    const doughnutData = {
        labels: ['Baixa', 'Normal', 'Alta'],
        datasets: [
            {
                data: totalFilteredReadings > 0 ? [counts.low, counts.normal, counts.high] : [0, 1, 0], // Fallback if empty
                backgroundColor: [
                    '#ef4444', // Red (Low)
                    '#10b981', // Emerald (Normal)
                    '#f97316', // Orange (High)
                ],
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    return (
        <div className="pb-32 px-5 pt-6 max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-95">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Histórico</h1>
                <button
                    onClick={handleDownloadExcel}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-95"
                    title="Baixar como Excel"
                >
                    <Download size={20} />
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8">
                <h3 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                    <Filter size={20} className="text-slate-400" />
                    Filtrar Histórico
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">De</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-bold text-slate-700 px-4 py-3 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Até</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-bold text-slate-700 px-4 py-3 outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Período</label>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-bold text-slate-700 px-4 py-3 outline-none transition-all cursor-pointer appearance-none"
                    >
                        <option value="all">Todos</option>
                        <option value="jejum">Jejum (Manhã)</option>
                        <option value="pos-almoco">Pós-Almoço</option>
                        <option value="noite">Noite</option>
                        <option value="random">Aleatório</option>
                    </select>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 mb-8">

                {/* Timeline Chart */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-4 relative z-10">
                        <div>
                            <h3 className="font-bold text-slate-700 text-lg">Evolução</h3>
                            <p className="text-xs text-slate-400 font-medium">Últimos registros filtrados</p>
                        </div>
                    </div>
                    <div className="h-40 w-full">
                        {filteredReadings.length > 1 ? (
                            <Line data={lineChartData} options={lineChartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                                Dados insuficientes para o gráfico de linha
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
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Normal ({counts.normal})
                            </div>
                            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Alerta ({counts.high})
                            </div>
                            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Baixo ({counts.low})
                            </div>
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div className="w-32 h-32 relative flex-shrink-0">
                        {totalFilteredReadings > 0 ? (
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    cutout: '75%',
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            enabled: true,
                                            backgroundColor: '#0f172a',
                                            padding: 12,
                                            cornerRadius: 8,
                                            displayColors: true,
                                            callbacks: {
                                                label: (context) => {
                                                    const label = context.label || '';
                                                    const value = context.raw || 0;
                                                    return ` ${label}: ${value}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
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

            {/* History List */}
            <h3 className="font-bold text-slate-700 mb-4 px-2 text-lg">Registros ({filteredReadings.length})</h3>
            <div className="space-y-3">
                {filteredReadings.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Nenhum registro encontrado para os filtros aplicados.</p>
                    </div>
                ) : (
                    filteredReadings.map((reading) => {
                        const analysis = analyzeReading(reading.value);
                        const isEditing = editingId === reading.id;

                        return (
                            <div key={reading.id} className="group bg-white p-4 pl-5 rounded-3xl border border-slate-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-all">
                                {isEditing ? (
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-20 bg-slate-50 border border-slate-200 rounded-lg text-center py-2 text-lg font-bold"
                                            />
                                            <select
                                                value={editPeriod}
                                                onChange={(e) => setEditPeriod(e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 text-sm font-medium"
                                            >
                                                <option value="jejum">Jejum</option>
                                                <option value="pos-almoco">Pós-Almoço</option>
                                                <option value="noite">Noite</option>
                                                <option value="random">Aleatório</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="date"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 text-sm font-medium"
                                            />
                                            <input
                                                type="time"
                                                value={editTime}
                                                onChange={(e) => setEditTime(e.target.value)}
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 text-sm font-medium"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 mt-3">
                                            <button
                                                onClick={() => saveEdit(reading.id)}
                                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition"
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300 transition"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-5 mb-3 sm:mb-0">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${analysis.bgColor} ${analysis.color}`}>
                                                <span className="font-black text-xl tracking-tight">{reading.value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${analysis.color}`}>{analysis.status}</span>
                                                <span className="text-sm text-slate-400 font-medium lowercase first-letter:uppercase">
                                                    {format(parseISO(reading.timestamp), "d 'de' MMMM', às' HH:mm", { locale: ptBR })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all self-end sm:self-auto">
                                            <button
                                                onClick={() => startEditing(reading)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-blue-50 hover:text-blue-500 transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteReading(reading.id)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}