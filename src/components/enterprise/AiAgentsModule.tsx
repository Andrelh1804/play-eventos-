import React, { useState } from "react";
import { 
  Cpu, Sparkles, Send, Brain, Shield, FileText, Database, ArrowRight, CheckCircle2, 
  HelpCircle, RefreshCw, BarChart3, LineChart, Code, Smartphone, Zap, Flame, Terminal
} from "lucide-react";

interface AiAgentsModuleProps {
  activeEvent: any;
}

export default function AiAgentsModule({ activeEvent }: AiAgentsModuleProps) {
  // Agent selection state
  const [selectedAgent, setSelectedAgent] = useState<string>("finances");
  const [agentOutput, setAgentOutput] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState<boolean>(false);

  // Predictive ML Forecast state
  const [ticketSalesForecast, setTicketSalesForecast] = useState<string>("Tendência Linear Alta (Check-out em 92%)");
  const [fraudRisk, setFraudRisk] = useState<string>("Baixo Risco (Detectado 0.2% anomalias)");
  const [weatherImpactModel, setWeatherImpactModel] = useState<string>("Sem impacto severo planejado para Q3");

  // App Marketplace State
  const [installedPlugins, setInstalledPlugins] = useState<string[]>(["ticket-sync", "whatsapp-alert"]);

  // Agent catalog definitions
  const agents = {
    finances: {
      name: "Agente Financeiro",
      role: "Otimização Tributária, ROI & Forecast",
      prompt: "Olá! Sou o Agente Financeiro do EventOS. Analisei os custos diretos orçados de materiais, serviços e segurança de sua planilha. Com base na capacidade de seu evento ativo, prevejo um ROI líquido de 18.2% após compensação municipal de ISS. Recomendo aumentar o valor do ingresso VIP em R$ 15 para captar maior prêmio de margem.",
      icon: "💰"
    },
    comercial: {
      name: "Agente Comercial",
      role: "Matchmaking & Captação de Patrocínios",
      prompt: "Olá! Sou o Agente Comercial. Recomendo direcionar a cota Master Platina do seu evento para empresas do ramo de isotônicos e tecnologia móvel, pois nossa IA detectou que 82% dos inscritos declaram forte interesse em esportes e gadgets de monitoramento físico.",
      icon: "🤝"
    },
    juridico: {
      name: "Agente Jurídico",
      role: "Licenciamento, Contratos & Alvarás",
      prompt: "Olá! Como Agente Jurídico da PLAY+, verifiquei que o evento ativo exige o alvará sanitário municipal tipo II por conta do Food Park integrado. Recomendo anexar a apólice de seguros coletiva contra terceiros (Bradesco Seguros) na pasta de petição em até 48 horas.",
      icon: "⚖️"
    },
    operacional: {
      name: "Agente Operacional",
      role: "Escalas de Campo, Clima & Ambulâncias",
      prompt: "Olá! Agente de Operações no comando. Monitorando a velocidade dos ventos na arena ativa. Caso os ventos excedam 35 km/h, meu motor de regras agendará o acionamento preventivo da brigada de apoio para ancoragem de estruturas elevadas de som e LED.",
      icon: "⚙️"
    },
    marketing: {
      name: "Agente Marketing",
      role: "Estratégia de Campanhas & Audiência",
      prompt: "Olá! Recomendo disparar campanhas geo-direcionadas pelo Instagram/WhatsApp focando em ciclistas em um raio de 30km do local do evento. A taxa de conversão esperada é de 3.8% devido à escassez de ingressos no lote final.",
      icon: "📢"
    },
    producao: {
      name: "Agente Produção",
      role: "Montagem de Palcos & Credenciamento",
      prompt: "Olá! Cronograma de montagem revisado. Todos os geradores Heimer 500 foram posicionados. Recomendo antecipar a calibração dos leitores RFID nos portais em 30 minutos para evitar picos de gargalo no credenciamento inicial.",
      icon: "🔨"
    },
    rh: {
      name: "Agente RH & Voluntários",
      role: "Escalabilidade de Staff, XP & Certificados",
      prompt: "Olá! Atualmente temos 14 voluntários qualificados no módulo LMS. Sugiro remanejar 2 staffs do Setor Leste para o Setor Sul para dar apoio ao grande fluxo no Food Park.",
      icon: "👥"
    },
    atendimento: {
      name: "Agente Atendimento",
      role: "Suporte do Participante & SAC Integrado",
      prompt: "Olá! Monitorando o chat interno dos participantes. 92% das dúvidas estão relacionadas ao local de retirada do kit de atleta. Atualizei a resposta automática do Bot no app mobile.",
      icon: "💬"
    },
    analytics: {
      name: "Agente Analytics",
      role: "Machine Learning, Predição & Gráficos",
      prompt: "Olá! Gerando forecasts preditivos. O pico de público dentro da arena ativa ocorrerá às 10:30 da manhã. O fator de lotação das arquibancadas atingirá 88% da capacidade nominal.",
      icon: "📈"
    }
  };

  const activeAgentData = (agents as any)[selectedAgent] || agents.finances;

  // Run interactive agent generation using real Gemini API
  const handleConsultAgent = async () => {
    setIsConsulting(true);
    setAgentOutput(null);

    try {
      const agentRole = activeAgentData.role;
      const agentPrompt = activeAgentData.prompt;
      const response = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Aja como o ${activeAgentData.name} (${agentRole}). O usuário está solicitando uma análise de IA para o evento ativo. O prompt base do agente é: "${agentPrompt}". Gere uma resposta realística, customizada e altamente profissional em português do Brasil considerando o contexto do seguinte evento: Nome: "${activeEvent?.name || 'Evento'}"; Capacidade: ${activeEvent?.capacity || 5000} Pax; Local: "${activeEvent?.venue || 'Arena Central'}".`,
          eventContext: activeEvent ? {
            name: activeEvent.name,
            category: activeEvent.category,
            venue: activeEvent.venue,
            date: activeEvent.date,
            capacity: activeEvent.capacity,
            description: activeEvent.description
          } : null
        })
      });

      const json = await response.json();
      if (json.text) {
        setAgentOutput(json.text);
      } else {
        setAgentOutput("Não foi possível gerar a resposta do agente. Tente novamente.");
      }
    } catch (error) {
      console.error("Error consulting AI agent:", error);
      setAgentOutput("Erro ao estabelecer conexão com o servidor PLAY+COGNITIVE.");
    } finally {
      setIsConsulting(false);
    }
  };

  const togglePlugin = (pluginId: string) => {
    if (installedPlugins.includes(pluginId)) {
      setInstalledPlugins(prev => prev.filter(p => p !== pluginId));
    } else {
      setInstalledPlugins(prev => [...prev, pluginId]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="ai-agents-module-container">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL A: SPECIALIST IA AGENT LAB (Col-Span-2) */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-cyan-400" />
              IA Corporativa (Ecosystem Agent Lab)
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-1.5 rounded animate-pulse">
              9 AGENTES COGNITIVOS
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Selecione um agente especialista treinado nos POPs da PLAY+ para gerar planos, análises de custos, campanhas e estratégias personalizadas para o evento ativo:
          </p>

          {/* Grid selector of 9 agents */}
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(agents).map((key) => {
              const item = (agents as any)[key];
              const isSelected = selectedAgent === key;
              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedAgent(key);
                    setAgentOutput(null);
                  }}
                  className={`p-2.5 rounded-lg border cursor-pointer select-none text-center transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' 
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <span className="font-bold text-[10px] block leading-tight">{item.name}</span>
                  <span className="text-[8px] text-slate-500 block truncate mt-0.5" title={item.role}>
                    {item.role}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Consultation panel */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-xs text-slate-200 font-sans block">Consultar {activeAgentData.name}</strong>
                <span className="text-[10px] font-mono text-slate-500">{activeAgentData.role}</span>
              </div>

              <button
                onClick={handleConsultAgent}
                disabled={isConsulting}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isConsulting ? "Analisando Contexto..." : "Executar IA Specialist Agent"}
              </button>
            </div>

            {agentOutput && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs leading-relaxed space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-400 uppercase">
                  <Terminal className="h-3 w-3" />
                  <span>Cognitive Output • Play+ LLM Enterprise Node</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap">{agentOutput}</p>
              </div>
            )}
          </div>

        </div>

        {/* PANEL B: PREDICTIVE ML FORECASTS & MARKETPLACE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          
          {/* Predictive ML Forecasts */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <LineChart className="h-4 w-4 text-cyan-400" />
              Laboratório de IA & Modelos Preditivos
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-slate-500 text-[9px] uppercase block">Previsão Final de Vendas:</span>
                <strong className="text-slate-200">{ticketSalesForecast}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-slate-500 text-[9px] uppercase block">Detecção de Fraudes (Voucher-Audit):</span>
                <strong className="text-emerald-400">{fraudRisk}</strong>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                <span className="text-slate-500 text-[9px] uppercase block">Análise de Impacto Climático:</span>
                <strong className="text-slate-300">{weatherImpactModel}</strong>
              </div>
            </div>
          </div>

          {/* App Marketplace */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-cyan-400" />
              App Marketplace (Extensões SDK & APIs)
            </h4>
            <p className="text-[11px] text-slate-400">Instale integrações de terceiros ou acesse as chaves da API pública:</p>

            <div className="space-y-2">
              {[
                { id: "ticket-sync", name: "Sincronizador Automático Sympla", desc: "Sincroniza ingressos e check-in", category: "Vendas" },
                { id: "whatsapp-alert", name: "Disparador de Alertas WhatsApp", desc: "Envia alertas de pânico por rádio", category: "Comunicação" },
                { id: "lora-telemetry", name: "Gateway LoRaWAN Sensores", desc: "Integra antenas IoT sem internet", category: "Infraestrutura" },
              ].map((p) => {
                const isInstalled = installedPlugins.includes(p.id);
                return (
                  <div key={p.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block text-[11px]">{p.name}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight">{p.desc}</span>
                    </div>

                    <button
                      onClick={() => {
                        togglePlugin(p.id);
                      }}
                      className={`text-[9px] font-mono font-bold px-2 py-1 rounded border transition-colors shrink-0 ${
                        isInstalled 
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-500/25' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isInstalled ? "Instalado" : "Instalar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
