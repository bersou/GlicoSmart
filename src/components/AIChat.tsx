import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Stethoscope, User, Sparkles } from 'lucide-react';

// Definindo as interfaces para as props e tipos de dados
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

interface Message {
    id: string | number;
    text: string;
    sender: 'user' | 'ai';
}

interface AIChatProps {
    userProfile: UserProfile | null;
    lastReading: Reading | null;
}

export default function AIChat({ userProfile, lastReading }: AIChatProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial greeting based on profile
        if (userProfile && messages.length === 0) {
            setMessages([{
                id: 'init',
                text: `Olá ${userProfile.name}! Sou sua assistente virtual. Estou monitorando sua glicemia e aqui para ajudar.`,
                sender: 'ai'
            }]);
        }
    }, [userProfile, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, isOpen]);

    // Context-aware proactive messaging
    useEffect(() => {
        if (lastReading && userProfile) {
            handleNewReading(lastReading);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastReading, userProfile]); // Added userProfile to dependencies

    const handleNewReading = (reading: Reading) => {
        const val = reading.value;
        setIsTyping(true);

        setTimeout(() => {
            let advice = "";

            if (!userProfile) { // Ensure userProfile exists before accessing its properties
                advice = "Olá! Por favor, complete seu perfil para que eu possa te dar conselhos personalizados.";
            } else if (val > 250) {
                advice = `🚨 ALERTA CRÍTICO, ${userProfile.name}!\n\nGlicemia muito alta: ${val} mg/dL\n\nAções imediatas:\n• Beba 2-3 copos de água agora\n• Evite qualquer carboidrato\n• Faça uma caminhada leve (se possível)\n• Monitore a cada 2 horas\n• Se > 300 ou sintomas graves, procure atendimento médico`;
            } else if (val > 180) {
                advice = `⚠️ ${userProfile.name}, glicemia elevada: ${val} mg/dL\n\nRecomendações:\n• Beba água (meta: ${Math.round(parseFloat(userProfile.weight) * 35)}ml/dia)\n• Evite carboidratos nas próximas 3-4 horas\n• Faça atividade leve (caminhada de 15 min)\n• Próxima refeição: priorize vegetais e proteínas`;
            } else if (val >= 145 && val <= 180) {
                advice = `🟡 Atenção, ${userProfile.name}. Glicemia em ${val} mg/dL (pré-diabetes).\n\nDicas:\n• Evite doces e carboidratos refinados\n• Aumente consumo de fibras e vegetais\n• Exercícios regulares ajudam muito\n• Continue monitorando!`;
            } else if (val < 70) {
                advice = `🚨 HIPOGLICEMIA DETECTADA!\n\n${userProfile.name}, sua glicemia está em ${val} mg/dL!\n\nAÇÃO IMEDIATA:\n1. Coma 15g de carboidrato rápido AGORA:\n   • 1 colher de sopa de mel, OU\n   • Meio copo de suco, OU\n   • 3-4 balas\n2. Aguarde 15 minutos\n3. Meça novamente\n4. Se ainda < 70, repita\n\n⚠️ Não dirija ou opere máquinas!`;
            } else if (val >= 70 && val < 90) {
                advice = `⚠️ ${userProfile.name}, glicemia baixa: ${val} mg/dL\n\nNão é hipoglicemia ainda, mas está próximo!\n• Faça um lanche leve (fruta + castanhas)\n• Evite exercícios intensos agora\n• Monitore em 1-2 horas`;
            } else if (val >= 90 && val <= 144) {
                const encouragement = [
                    `✨ Perfeito, ${userProfile.name}! Glicemia ideal: ${val} mg/dL. Você está fazendo um excelente trabalho! Continue com essa rotina saudável. 💚`,
                    `🎉 Ótima notícia! ${val} mg/dL está na faixa ideal. Mantenha essa alimentação e exercícios. Seu corpo agradece!`,
                    `👏 Excelente controle, ${userProfile.name}! ${val} mg/dL é perfeito. Continue assim e você terá ótimos resultados a longo prazo!`
                ];
                advice = encouragement[Math.floor(Math.random() * encouragement.length)];
            }

            // Avoid duplicates roughly
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.text === advice) return prev;
                return [...prev, { id: Date.now(), text: advice, sender: 'ai' }]
            });
            setIsTyping(false);
        }, 2000);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        if (!userProfile) {
            setMessages(prev => [...prev, { id: Date.now(), text: "Por favor, complete seu perfil para que eu possa te ajudar.", sender: 'ai' }]);
            setInputText("");
            return;
        }

        const userMsg = inputText;
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setInputText("");
        setIsTyping(true);

        // Enhanced context-aware response logic
        setTimeout(() => {
            const lowerText = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let response = "";
            const currentGlucose = lastReading?.value || null;

            // EXERCÍCIO & ATIVIDADE FÍSICA
            if (lowerText.includes("exercicio") || lowerText.includes("treino") || lowerText.includes("academia") || lowerText.includes("caminhada") || lowerText.includes("corrida")) {
                const exerciseAdvice = [
                    `💪 Excelente, ${userProfile.name}! Exercícios são fundamentais para o controle glicêmico. Dicas importantes:\n\n• Meça sua glicemia antes e depois do treino\n• Se < 100 mg/dL: faça um lanche com carboidrato + proteína (ex: banana + pasta de amendoim)\n• Se > 250 mg/dL: evite exercícios intensos até normalizar\n• Hidrate-se bem durante toda a atividade`,
                    `🏃‍♂️ Atividade física regular melhora a sensibilidade à insulina! Recomendo:\n\n• Aeróbico: 110-150 min/semana (caminhada, natação, ciclismo)\n• Musculação: 2-3x/semana para aumentar massa muscular\n• Horário ideal: 30-60 min após refeições (ajuda a reduzir picos)\n• Sempre carregue uma fonte de glicose rápida (suco, balas)`,
                    `⚡ O exercício pode baixar sua glicemia por até 24h! Por isso:\n\n• Monitore mais frequentemente nos dias de treino\n• Evite treinar em jejum se sua glicemia estiver < 90 mg/dL\n• Após treinos intensos, faça um lanche com proteína\n• Se sentir tremores, tontura ou suor frio, pare e meça imediatamente`
                ];
                response = exerciseAdvice[Math.floor(Math.random() * exerciseAdvice.length)];
            }

            // ALIMENTOS PREJUDICIAIS (detectar primeiro para dar avisos específicos)
            else if (lowerText.includes("bolacha") || lowerText.includes("balacha") || lowerText.includes("bilacha") ||
                lowerText.includes("biscoito") || lowerText.includes("doce") || lowerText.includes("acucar") ||
                lowerText.includes("refrigerante") || lowerText.includes("salgadinho") || lowerText.includes("chocolate") ||
                lowerText.includes("bolo") || lowerText.includes("sorvete") || lowerText.includes("pizza")) {
                response = `⚠️ Cuidado, ${userProfile.name}! Esses alimentos causam picos de glicemia!\n\n🚫 Alimentos que você deve EVITAR:\n• Bolachas/biscoitos (mesmo os "sem açúcar" têm farinha refinada)\n• Doces, chocolates, balas\n• Refrigerantes e sucos industrializados\n• Pão branco, bolos, massas refinadas\n• Salgadinhos e frituras\n\n💡 Alternativas mais saudáveis:\n• Castanhas, nozes, amêndoas\n• Frutas com baixo índice glicêmico (morango, maçã com casca)\n• Iogurte natural sem açúcar\n• Pipoca caseira (sem açúcar)\n• Chocolate 70% cacau (pequena porção)`;
            }

            // ALIMENTAÇÃO & NUTRIÇÃO (geral)
            else if (lowerText.includes("alimentacao") || lowerText.includes("dieta") || lowerText.includes("comer") || lowerText.includes("comida") || lowerText.includes("refeicao") ||
                lowerText.includes("pao") || lowerText.includes("massa") || lowerText.includes("arroz") || lowerText.includes("fruta") ||
                lowerText.includes("carne") || lowerText.includes("salada") || lowerText.includes("legume") || lowerText.includes("verdura")) {
                const nutritionAdvice = [
                    `🥗 Alimentação é 70% do controle glicêmico! Regra de ouro:\n\n• Evite: açúcar, refrigerantes, pão branco, massas refinadas, doces\n• Priorize: vegetais, proteínas magras, gorduras boas (abacate, azeite, castanhas)\n• Carboidratos: prefira integrais e sempre combine com proteína/fibra\n• Método do prato: 50% vegetais, 25% proteína, 25% carboidrato`,
                    `🍽️ Dicas práticas para suas refeições:\n\n• Coma a cada 3-4 horas (evita hipoglicemia)\n• Comece pela salada (fibras reduzem absorção de glicose)\n• Mastigue devagar (melhora saciedade e digestão)\n• Evite sucos (mesmo naturais, têm muito açúcar sem fibra)\n• Leia rótulos: evite produtos com açúcar nos 3 primeiros ingredientes`,
                    `🥑 Alimentos que ajudam no controle:\n\n• Canela (melhora sensibilidade à insulina)\n• Aveia (fibra solúvel, libera glicose lentamente)\n• Peixes (ômega-3 reduz inflamação)\n• Leguminosas (feijão, lentilha - baixo índice glicêmico)\n• Vegetais verde-escuros (magnésio auxilia metabolismo da glicose)`
                ];
                response = nutritionAdvice[Math.floor(Math.random() * nutritionAdvice.length)];
            }

            // ÁGUA & HIDRATAÇÃO
            else if (lowerText.includes("agua") || lowerText.includes("hidratar") || lowerText.includes("hidratacao") || lowerText.includes("sede") || lowerText.includes("beber")) {
                response = `💧 Hidratação é ESSENCIAL! A desidratação concentra o açúcar no sangue.\n\n• Meta diária: ${Math.round(parseFloat(userProfile.weight) * 35)}ml (baseado no seu peso de ${userProfile.weight}kg)\n• Beba água mesmo sem sede\n• Se glicemia > 180: aumente a ingestão de água\n• Evite: refrigerantes, sucos industrializados, bebidas açucaradas\n• Pode adicionar: limão, hortelã, gengibre (sem açúcar)`;
            }

            // SINTOMAS & EMERGÊNCIAS
            else if (lowerText.includes("tontura") || lowerText.includes("tremor") || lowerText.includes("suor") || lowerText.includes("fraqueza") || lowerText.includes("mal")) {
                response = `🚨 ATENÇÃO - Possível Hipoglicemia!\n\nFaça AGORA:\n1. Meça sua glicemia imediatamente\n2. Se < 70 mg/dL: coma 15g de carboidrato rápido (1 colher de mel, meio copo de suco, 3 balas)\n3. Aguarde 15 minutos e meça novamente\n4. Se ainda < 70: repita o passo 2\n5. Após normalizar, faça um lanche com proteína\n\n⚠️ Se não melhorar ou piorar, procure ajuda médica!`;
            }

            // SONO & ESTRESSE
            else if (lowerText.includes("sono") || lowerText.includes("dormir") || lowerText.includes("cansaco") || lowerText.includes("estresse") || lowerText.includes("ansiedade")) {
                response = `😴 Sono e estresse afetam MUITO a glicemia!\n\nSono:\n• Durma 7-9h por noite (falta de sono aumenta resistência à insulina)\n• Evite telas 1h antes de dormir\n• Mantenha horários regulares\n\nEstresse:\n• Cortisol (hormônio do estresse) eleva a glicemia\n• Pratique: meditação, respiração profunda, yoga\n• Exercícios ajudam a reduzir estresse e glicemia`;
            }

            // RESULTADOS & INTERPRETAÇÃO
            else if (lowerText.includes("resultado") || lowerText.includes("valor") || lowerText.includes("normal") || lowerText.includes("alto") || lowerText.includes("baixo")) {
                response = `📊 Entendendo seus resultados:\n\n🟢 Normal (70-144 mg/dL): Parabéns! Continue assim\n🟡 Pré-diabetes (145-180 mg/dL): Atenção! Ajuste alimentação e exercícios\n🔴 Alto (>180 mg/dL): Evite carboidratos, beba água, monitore de perto\n⚠️ Baixo (<70 mg/dL): HIPOGLICEMIA - ação imediata necessária!\n\n${currentGlucose ? `Sua última leitura: ${currentGlucose} mg/dL` : 'Faça uma medição para análise personalizada'}`;
            }

            // MÉDIA, HISTÓRICO & ESTATÍSTICAS
            else if (lowerText.includes("media") || lowerText.includes("historico") || lowerText.includes("estatistica") ||
                lowerText.includes("tendencia") || lowerText.includes("evolucao") || lowerText.includes("progresso")) {
                response = `📈 Análise do seu histórico:\n\n${currentGlucose ? `Sua última medição foi ${currentGlucose} mg/dL - ${currentGlucose >= 70 && currentGlucose <= 144 ? '🟢 Excelente!' : currentGlucose > 180 ? '🔴 Atenção, está alto!' : currentGlucose < 70 ? '⚠️ Baixo demais!' : '🟡 Fique atento'}` : ''}\n\n💡 Dicas para melhorar sua média:\n• Monitore em diferentes horários (jejum, pós-refeições)\n• Identifique padrões: quais alimentos elevam mais sua glicemia?\n• Mantenha consistência na alimentação e exercícios\n• Registre tudo aqui no GlicoSmart para acompanhar sua evolução\n\nContinue registrando suas medições! Quanto mais dados, melhor posso te orientar.`;
            }

            // HEMOGLOBINA GLICADA (A1C)
            else if (lowerText.includes("a1c") || lowerText.includes("hemoglobina") || lowerText.includes("glicada")) {
                response = `🔬 Hemoglobina Glicada (A1C) - Média de 3 meses:\n\n• < 5.7%: Normal\n• 5.7-6.4%: Pré-diabetes\n• ≥ 6.5%: Diabetes\n• Meta para diabéticos: < 7%\n\nA1C mostra seu controle a longo prazo. Suas medições diárias me ajudam a estimar sua tendência!`;
            }

            // MEDICAMENTOS
            else if (lowerText.includes("remedio") || lowerText.includes("medicamento") || lowerText.includes("insulina") || lowerText.includes("metformina")) {
                response = `💊 Sobre medicamentos:\n\n⚠️ IMPORTANTE: Nunca altere doses sem orientação médica!\n\n• Tome sempre nos horários corretos\n• Não pule doses\n• Alguns medicamentos podem causar hipoglicemia - monitore mais\n• Anote efeitos colaterais para relatar ao médico\n• Combine sempre com alimentação saudável e exercícios`;
            }

            // DICAS GERAIS & MOTIVAÇÃO
            else if (lowerText.includes("dica") || lowerText.includes("ajuda") || lowerText.includes("conselho")) {
                const tips = [
                    `✨ Dica de Ouro: Monitore sua glicemia em horários variados (jejum, pós-refeições, antes de dormir). Isso ajuda a identificar padrões e ajustar sua rotina!`,
                    `🎯 Foco no progresso: Pequenas mudanças consistentes são melhores que mudanças drásticas temporárias. Celebre cada vitória!`,
                    `📱 Continue registrando suas medições aqui no GlicoSmart. Quanto mais dados, melhor posso te orientar e você pode mostrar ao seu médico!`,
                    `🌟 Você está no controle! Diabetes é gerenciável com disciplina. Cada escolha saudável conta!`
                ];
                response = tips[Math.floor(Math.random() * tips.length)];
            }

            // RESPOSTA PADRÃO INTELIGENTE
            else {
                const contextualResponses = currentGlucose
                    ? [
                        `Entendi, ${userProfile.name}. Com sua glicemia atual em ${currentGlucose} mg/dL, ${currentGlucose > 144 ? 'recomendo evitar carboidratos e beber bastante água' : currentGlucose < 70 ? '⚠️ ATENÇÃO! Você precisa comer algo doce AGORA' : 'você está em ótimo controle! Continue assim'}. Como posso ajudar mais?`,
                        `Interessante! Você sabia que manter um diário das suas refeições junto com as medições ajuda a identificar quais alimentos afetam mais sua glicemia?`,
                        `${userProfile.name}, estou aqui para te ajudar! Pode me perguntar sobre: exercícios, alimentação, interpretação de resultados, sintomas, ou dicas de controle glicêmico.`
                    ]
                    : [
                        `Olá, ${userProfile.name}! Estou aqui para te ajudar com dúvidas sobre glicemia, alimentação, exercícios e saúde. O que você gostaria de saber?`,
                        `Posso te ajudar com informações sobre controle glicêmico, dicas de alimentação saudável, exercícios recomendados e muito mais. Qual sua dúvida?`,
                        `Estou monitorando sua saúde! Faça uma nova medição para análises mais precisas, ou me pergunte sobre qualquer aspecto do controle da glicemia.`
                    ];
                response = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all z-40 ${isOpen ? 'hidden' : 'flex'} items-center gap-2`}
            >
                <MessageCircle size={26} fill="currentColor" className="text-white/20" />
                <span className="font-bold pr-1">Nutri AI</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[600px] z-50 flex flex-col bg-white sm:rounded-[2rem] sm:shadow-2xl overflow-hidden font-sans animation-slide-up">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white shadow-lg shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Nutri AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                        <span className="text-xs font-medium tracking-wide">Monitorando em tempo real</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        {lastReading && (
                            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border border-white/10">
                                <Sparkles size={14} className="text-yellow-300" />
                                <span className="text-white">Última leitura: {lastReading.value} mg/dL</span>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-emerald-500'}`}>
                                    {msg.sender === 'user' ? (
                                        <span className="text-[10px] font-extrabold tracking-tight">
                                            {userProfile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                                        </span>
                                    ) : (
                                        <Stethoscope size={14} />
                                    )}
                                </div>
                                <div
                                    className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                        : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 px-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                                    <Stethoscope size={14} />
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex gap-1.5 items-center w-fit">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                        <form onSubmit={handleSend} className="flex gap-2 items-center bg-slate-50 border border-slate-200 p-1.5 rounded-full focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Digite sua dúvida..."
                                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-slate-700 placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-90"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}