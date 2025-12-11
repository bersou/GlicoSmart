export interface HealthTip {
    id: string;
    title: string;
    description: string;
    category: 'Alimentação' | 'Exercícios' | 'Cuidados' | 'Geral';
    icon: string; // Lucide icon name
    bgColor: string;
    textColor: string;
}

export const healthTips: HealthTip[] = [
    {
        id: '1',
        title: 'Controle de Carboidratos',
        description: 'Monitore a quantidade de carboidratos em cada refeição. Prefira carboidratos complexos como grãos integrais, que liberam glicose mais lentamente.',
        category: 'Alimentação',
        icon: 'Apple',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
    },
    {
        id: '2',
        title: 'Hidratação Adequada',
        description: 'Beba pelo menos 2 litros de água por dia. A hidratação adequada ajuda os rins a eliminar o excesso de açúcar no sangue.',
        category: 'Cuidados',
        icon: 'Droplet',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
    },
    {
        id: '3',
        title: 'Atividade Física Regular',
        description: 'Pratique exercícios por pelo menos 30 minutos na maioria dos dias da semana. Isso melhora a sensibilidade à insulina e ajuda a controlar a glicemia.',
        category: 'Exercícios',
        icon: 'Activity',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
    },
    {
        id: '4',
        title: 'Evite Açúcares Refinados',
        description: 'Doces, refrigerantes e alimentos processados com alto teor de açúcar causam picos rápidos de glicose. Opte por alternativas naturais.',
        category: 'Alimentação',
        icon: 'Candy',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
    },
    {
        id: '5',
        title: 'Monitore Regularmente',
        description: 'Verifique sua glicemia nos horários recomendados pelo seu médico. O monitoramento constante é chave para entender e controlar o diabetes.',
        category: 'Cuidados',
        icon: 'Gauge',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
    },
    {
        id: '6',
        title: 'Gerencie o Estresse',
        description: 'O estresse pode elevar os níveis de glicose. Pratique técnicas de relaxamento como meditação, yoga ou hobbies que você goste.',
        category: 'Cuidados',
        icon: 'CloudRain',
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-700',
    },
    {
        id: '7',
        title: 'Fibras na Dieta',
        description: 'Alimentos ricos em fibras (vegetais, frutas, leguminosas) ajudam a retardar a absorção de açúcar, mantendo a glicemia mais estável.',
        category: 'Alimentação',
        icon: 'Salad',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
    },
    {
        id: '8',
        title: 'Sono de Qualidade',
        description: 'Durma de 7 a 9 horas por noite. A privação do sono pode afetar a sensibilidade à insulina e o controle da glicemia.',
        category: 'Cuidados',
        icon: 'Moon',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
    },
    {
        id: '9',
        title: 'Consulte um Nutricionista',
        description: 'Um profissional pode criar um plano alimentar personalizado para suas necessidades, auxiliando no controle do diabetes.',
        category: 'Geral',
        icon: 'UserCog',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
    },
    {
        id: '10',
        title: 'Caminhada Pós-Refeição',
        description: 'Uma caminhada leve de 15-20 minutos após as refeições pode ajudar a reduzir os picos de glicemia pós-prandiais.',
        category: 'Exercícios',
        icon: 'Walk',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
    },
];