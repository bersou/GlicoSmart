interface GlucoseAnalysis {
    status: string;
    color: string;
    bgColor: string;
    borderColor: string;
    message: string;
}

export const analyzeReading = (value: number): GlucoseAnalysis => {
    const numValue = Number(value);
    if (numValue < 70) {
        return {
            status: "Hipoglicemia",
            color: "text-red-700",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            message: "Atenção: Seu nível de açúcar está muito baixo! Coma algo doce imediatamente."
        };
    } else if (numValue >= 70 && numValue <= 144) {
        return {
            status: "Normal",
            color: "text-emerald-700",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            message: "Ótimo! Sua glicemia está dentro do esperado."
        };
    } else if (numValue >= 145 && numValue <= 200) {
        return {
            status: "Alerta",
            color: "text-orange-700",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            message: "Cuidado: Nível um pouco alto. Beba água e evite doces."
        };
    } else {
        return {
            status: "Hiperglicemia",
            color: "text-red-700",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            message: "Perigo: Glicemia muito alta. Recomendado consultar um médico."
        };
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};