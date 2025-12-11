import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LineChart, Activity } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement
} from 'chart.js';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { analyzeReading } from '../utils/glucoseLogic';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement);

interface Reading {
    id: string;
    value: number;
    period: string;
    timestamp: string;
    notes?: string;
}

interface StatisticsPageProps {
    readings: Reading[];
}

export default function StatisticsPage({ readings }: StatisticsPageProps) {
    const totalReadings = readings.length;

    // Calculate average glucose
    const averageGlucose = totalReadings > 0
        ? Math.round(readings.reduce((acc, curr) => acc + curr.value, 0) / totalReadings)
        : 0;

    // Count readings by category (low, normal, high)
    const counts = { low: 0, normal: 0, high: 0 };
    readings.forEach(r => {
        if (r.value < 70) counts.low++;
        else if (r.value <= 144) counts.normal++;
        else counts.high++;
    });

    // Data for Line Chart (last 15 readings)
    const chartReadings = [...readings].slice(0, 15).reverse();
    const lineChartData = {
        labels: chartReadings.map(r => format(parseISO(r.timestamp), 'dd/MM HH:mm', { locale: ptBR })),
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
                    label: (ctx: any) => `${ctx.raw} mg/dL`,
                    title: (ctx: any) => ctx[0].label
                }
            }
        },
        scales: {
            y: { display: false },
            x: { display: false }
        },
        interaction: { intersect: false, mode: 'index' },
    };

    // Data for Doughnut Chart
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
                hoverOffset: 4
            },
        ],
    };

    // Analysis for the average glucose
    const averageAnalysis = analyzeReading(averageGlucose);

    return (
        <div className="pb-32 px-5 pt-6 max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-95">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Estatísticas</h1>
                <div className="w-10 h-10"></div> {/* Placeholder for alignment */}
            </div>

            {totalReadings === 0 ? (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <LineChart size={64} className="text-slate-300 mb-6" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhuma estatística disponível</h3>
                    <p className="text-slate-500 text-sm max-w-xs">Adicione medições para ver suas estatísticas e tendências aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 mb-8">
                    {/* Average Glucose Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
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
                        <div className="w-32 h-32 relative flex-shrink-0">
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
                                                label: (context: any) => {
                                                    const label = context.label || '';
                                                    const value = context.raw || 0;
                                                    return ` ${label}: ${value}`;
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Activity size={20} className="text-slate-300 mb-1" />
                            </div>
                        </div>
                    </div>

                    {/* Timeline Chart */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-end mb-4 relative z-10">
                            <div>
                                <h3 className="font-bold text-slate-700 text-lg">Evolução Recente</h3>
                                <p className="text-xs text-slate-400 font-medium">Últimos 15 registros</p>
                            </div>
                        </div>
                        <div className="h-40 w-full">
                            {readings.length > 1 ? (
                                <Line data={lineChartData} options={lineChartOptions} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                                    Dados insuficientes para o gráfico de linha
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analysis of Average Glucose */}
                    <div className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl transition-all duration-500 ${averageAnalysis.bgColor.replace('bg-', 'bg-opacity-40 ')} border ${averageAnalysis.borderColor}`}>
                        <div className="relative z-10">
                            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">Análise da Média Geral</h3>
                            <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                                {averageAnalysis.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}