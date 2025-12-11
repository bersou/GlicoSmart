import React from 'react';
import { analyzeReading } from '../utils/glucoseLogic'; // Updated import
import { ThumbsUp, AlertTriangle, Activity } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Reading {
    id: string;
    value: number;
    period: string;
    timestamp: string;
    notes?: string;
}

interface StatsCardProps {
    latestReading: Reading | undefined;
}

export default function StatsCard({ latestReading }: StatsCardProps) {
    if (!latestReading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center text-center">
                <Activity size={48} className="text-slate-300 mb-4" />
                <h3 className="text-slate-500 font-medium">Sem dados ainda</h3>
                <p className="text-slate-400 text-sm mt-1">Faça sua primeira medição</p>
            </div>
        );
    }

    const analysis = analyzeReading(latestReading.value);
    const timeAgo = formatDistanceToNow(new Date(latestReading.timestamp), { addSuffix: true, locale: ptBR });
    const exactDate = format(new Date(latestReading.timestamp), "dd 'de' MMM, HH:mm", { locale: ptBR });

    // Icon selection logic
    let StatusIcon: React.ElementType = Activity;
    if (analysis.status === 'Normal') StatusIcon = ThumbsUp;
    if (analysis.status === 'Alerta' || analysis.status === 'Hipoglicemia' || analysis.status === 'Hiperglicemia') StatusIcon = AlertTriangle;

    return (
        <div className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl transition-all duration-500 ${analysis.bgColor.replace('bg-', 'bg-opacity-40 ')} border ${analysis.borderColor}`}>
            {/* Background decoration */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 blur-2xl ${analysis.bgColor.replace('50', '300')}`}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Última Leitura</span>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-700 capitalize">{exactDate}</span>
                            <span className="text-xs font-medium text-slate-400 first-letter:uppercase">{timeAgo}</span>
                        </div>
                    </div>
                    <div className={`p-2 rounded-full ${analysis.bgColor.replace('50', '200')} ${analysis.color}`}>
                        <StatusIcon size={20} />
                    </div>
                </div>

                <div className="flex items-baseline mt-2">
                    <span className={`text-6xl font-black tracking-tighter shimmer-text ${analysis.color}`}>
                        {latestReading.value}
                    </span>
                    <span className={`ml-2 font-bold text-lg text-slate-400`}>mg/dL</span>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-sm ${analysis.bgColor.replace('50', '100')} ${analysis.color} border border-white/50`}>
                        {analysis.status}
                    </span>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                    {analysis.message}
                </p>
            </div>
        </div>
    );
}