import React, { useState } from 'react';
import { Lightbulb, Apple, Droplet, Activity, Heart, ListTodo } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { healthTips, HealthTip } from '../utils/healthTipsData';

// Helper to get Lucide icon by name
const getLucideIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || Lightbulb; // Fallback to Lightbulb if not found
};

export default function HealthTipsPage() {
    const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Alimentação' | 'Exercícios' | 'Cuidados' | 'Geral'>('Todos');

    const filteredTips = selectedCategory === 'Todos'
        ? healthTips
        : healthTips.filter(tip => tip.category === selectedCategory);

    const categories = [
        { name: 'Todos', icon: ListTodo },
        { name: 'Alimentação', icon: Apple },
        { name: 'Exercícios', icon: Activity },
        { name: 'Cuidados', icon: Droplet },
        { name: 'Geral', icon: Heart },
    ];

    return (
        <div className="pb-32 px-5 pt-6 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-100/50">
                    <Lightbulb size={32} className="text-yellow-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Dicas de Saúde</h1>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Orientações sobre alimentação e cuidados com diabetes</p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pb-4 mb-6"> {/* Removed overflow-x-auto and no-scrollbar, added flex-wrap and justify-center */}
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                        <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                isSelected
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <category.icon size={18} />
                            {category.name}
                        </button>
                    );
                })}
            </div>

            {/* Tips List */}
            <h3 className="font-bold text-slate-700 mb-4 px-2 text-lg">{filteredTips.length} dicas encontradas</h3>
            <div className="space-y-4">
                {filteredTips.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Nenhuma dica encontrada para esta categoria.</p>
                    </div>
                ) : (
                    filteredTips.map((tip) => {
                        const IconComponent = getLucideIcon(tip.icon);
                        return (
                            <div key={tip.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tip.bgColor}`}>
                                    <IconComponent size={24} className={tip.textColor} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-slate-800 text-base">{tip.title}</h4>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${tip.bgColor.replace('-50', '-100')} ${tip.textColor}`}>
                                            {tip.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{tip.description}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}