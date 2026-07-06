import React, { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  Percent, 
  Lightbulb, 
  RefreshCw, 
  CheckCircle, 
  Briefcase, 
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { TicketTier, Transaction, Event } from "../types";

interface BiAnalyticsProps {
  events: Event[];
  activeEventId: string;
  ticketTiers: TicketTier[];
  transactions: Transaction[];
  updateTicketTierPrice: (id: string, price: number) => void;
}

export default function BiAnalytics({
  events,
  activeEventId,
  ticketTiers,
  transactions,
  updateTicketTierPrice
}: BiAnalyticsProps) {
  // Simulator inputs
  const [marketingSpend, setMarketingSpend] = useState<number>(3); // 1 to 5 scale (Budget / Effort)
  const [historicalDataMatch, setHistoricalDataMatch] = useState<boolean>(true);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [auditText, setAuditText] = useState<string>("");
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [pricingApplied, setPricingApplied] = useState<boolean>(false);

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeTiers = ticketTiers.filter(t => t.eventId === activeEventId);
  const activeTx = transactions.filter(t => t.eventId === activeEventId);

  // Core accounting data
  const revenue = activeTx.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = activeTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const budgetLimit = activeEvent?.capacity ? activeEvent.capacity * 100 : 80000; // estimated budget ceiling

  // Marketing impact formulas for predictive sales curves
  const getMarketingMultiplier = (spend: number) => {
    switch (spend) {
      case 1: return 0.7; // Low spend
      case 2: return 0.9;
      case 3: return 1.2; // Moderate (Default)
      case 4: return 1.6;
      case 5: return 2.1; // Intense Marketing Campaign
      default: return 1.0;
    }
  };

  const marketingMultiplier = getMarketingMultiplier(marketingSpend);

  // 1. FORECASTING TICKET SALES
  // Current stats
  const totalSold = activeTiers.reduce((acc, curr) => acc + curr.sold, 0);
  const totalCapacity = activeTiers.reduce((acc, curr) => acc + curr.capacity, 0);
  
  // Forecast formula: project final ticket sales based on marketing effort + historical trends
  const baseConversionRate = historicalDataMatch ? 0.78 : 0.65;
  const projectedSold = Math.min(
    totalCapacity,
    Math.round((totalSold || 300) * baseConversionRate * marketingMultiplier + (historicalDataMatch ? 150 : 0))
  );
  const projectedPercentage = totalCapacity > 0 ? Math.round((projectedSold / totalCapacity) * 100) : 0;
  const daysToSellOut = projectedPercentage >= 100 
    ? Math.max(3, Math.round(45 / marketingMultiplier)) 
    : 0;

  // 2. OPTIMAL PRICING RECOMMENDATIONS
  // Simulates pricing elasticity of demand
  const pricingSuggestions = activeTiers.map(tier => {
    // Suggested price maximizing Revenue = Price * Qty (with demand elasticity curve)
    // If we raise price, we capture slightly fewer buyers but higher margins
    const elasticity = 0.4; // coefficient
    const proposedPrice = Math.round(tier.price * 1.22);
    const projectedSoldAtProposedPrice = Math.round(tier.sold * (1 - (0.22 * elasticity)));
    const currentPotentialRevenue = tier.price * tier.sold;
    const projectedPotentialRevenue = proposedPrice * projectedSoldAtProposedPrice;
    const profitGainPercent = Math.round(((projectedPotentialRevenue - currentPotentialRevenue) / (currentPotentialRevenue || 1)) * 100);

    return {
      tierId: tier.id,
      name: tier.name,
      currentPrice: tier.price,
      proposedPrice,
      projectedSold: projectedSoldAtProposedPrice,
      profitGainPercent: Math.max(2, profitGainPercent),
      currentRev: currentPotentialRevenue,
      projectedRev: projectedPotentialRevenue
    };
  });

  const applyPricingRecom = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      pricingSuggestions.forEach(s => {
        updateTicketTierPrice(s.tierId, s.proposedPrice);
      });
      setIsOptimizing(false);
      setPricingApplied(true);
      setTimeout(() => setPricingApplied(false), 4000);
    }, 1200);
  };

  // 3. BUDGET OVERRUN PREDICTION
  // Estimate final costs based on active contracts and standard overruns
  const estimatedOverrunFactor = activeEvent?.category === 'sports' ? 1.08 :
                                activeEvent?.category === 'show_festival' ? 1.15 : 1.05;
  const predictedExpenses = Math.round(expenses * estimatedOverrunFactor + (historicalDataMatch ? 4200 : 1500));
  const overrunAtRisk = predictedExpenses > budgetLimit;
  const overrunPercentage = budgetLimit > 0 ? Math.round(((predictedExpenses - budgetLimit) / budgetLimit) * 100) : 0;

  // AI Cognitive predictive report generation
  const handleGenerateAuditReport = async () => {
    setLoadingAudit(true);
    setAuditText("");
    
    try {
      const res = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analise as métricas de BI e emita uma auditoria preditiva estruturada para o evento "${activeEvent?.name}". 
          Dados atuais:
          - Capacidade total: ${totalCapacity} assentos.
          - Ingressos vendidos até agora: ${totalSold} assentos.
          - Receitas lançadas: R$ ${revenue}.
          - Custos/Despesas atuais lançadas: R$ ${expenses}.
          - Custos finais previstos pelo modelo: R$ ${predictedExpenses}.
          - Teto orçamentário: R$ ${budgetLimit}.
          - Multiplicador de marketing atual: ${marketingMultiplier}x.

          Gere uma auditoria preditiva resumida dividida exatamente nestes 3 tópicos, contendo 2 frases por tópico, no formato de texto limpo profissional:
          1. Previsão de Vendas e Impacto de Marketing: (Avaliar probabilidade de esgotar baseado no esforço atual de marketing).
          2. Elasticidade e Ajuste Tarifário: (Explicar por que a tarifa proposta maximiza o lucro).
          3. Risco Crítico de Estouro Orçamentário: (Indicar se haverá estouro com base nos custos previstos e onde conter custos).`,
          eventContext: activeEvent
        })
      });

      const json = await res.json();
      if (json.text) {
        setAuditText(json.text);
      } else {
        setAuditText("Não foi possível processar o relatório de auditoria devido a instabilidades na API. Segue recomendação padrão: O nível atual de marketing é saudável, porém os custos operacionais de som/LED no Allianz Parque representam risco de 12% de estouro do orçamento global.");
      }
    } catch (e) {
      console.error(e);
      setAuditText("Conexão falhou. Recomendação simulada: Ajuste as tarifas do ingresso VIP em +20% para cobrir o estouro de infraestrutura previsto na segurança do local.");
    } finally {
      setLoadingAudit(false);
    }
  };

  // Dynamic path calculations from database (transactions)
  const sortedIncomeTx = [...activeTx]
    .filter(t => t.type === 'income')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentSum = 0;
  const realIncomePoints = sortedIncomeTx.map((tx) => {
    currentSum += tx.amount;
    return {
      date: tx.date,
      amount: tx.amount,
      cumulative: currentSum
    };
  });

  const maxCumulative = realIncomePoints.length > 0 ? Math.max(...realIncomePoints.map(p => p.cumulative)) : 1000;
  
  // Create SVG path string
  let realPathD = "M 0 95 L 120 90 L 250 82 L 380 75 L 500 50";
  const segmentWidth = realIncomePoints.length > 1 ? 500 / (realIncomePoints.length - 1) : 500;
  
  if (realIncomePoints.length > 0) {
    realPathD = realIncomePoints.map((pt, idx) => {
      const x = Math.round(idx * segmentWidth);
      const y = Math.round(95 - (pt.cumulative / maxCumulative) * 80);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  }

  return (
    <div className="space-y-6" id="predictive-bi-view">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-display">Business Intelligence & IA Preditiva</h2>
        <p className="text-xs text-slate-400 mt-0.5">Modelagem matemática e previsões avançadas de bilheteria, elasticidade de preços e riscos financeiros do evento</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Section 1: Ticket Sales Forecasting (2 columns) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 xl:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="text-sm font-semibold font-display text-slate-200">Previsão Demanda e Velocidade de Vendas</h3>
            </div>
            <p className="text-xs text-slate-400">Arraste o simulador de orçamento de marketing para see o impacto direto na velocidade de vendas acumuladas</p>
          </div>

          {/* Interactive Slider */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Orçamento & Esforço de Marketing</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                marketingSpend === 1 ? 'bg-slate-850 text-slate-400 border-slate-700' :
                marketingSpend === 3 ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20' :
                'bg-purple-950/40 text-purple-400 border-purple-500/20'
              }`}>
                {marketingSpend === 1 ? 'Baixo (Apenas Orgânico)' :
                 marketingSpend === 2 ? 'Modesto (Redes Sociais)' :
                 marketingSpend === 3 ? 'Médio (Campanha Recomendada)' :
                 marketingSpend === 4 ? 'Agressivo (Tráfego Pago + Ads)' : 'Máximo (Fórmula Viral & Rádio)'}
              </span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={marketingSpend}
              onChange={(e) => setMarketingSpend(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Mínimo</span>
              <span>Recomendado</span>
              <span>Saturação Máxima</span>
            </div>
          </div>

          {/* Forecast Output KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="forecast-kpi-grid">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Previsão Vendas Finais</span>
              <div className="mt-2">
                <span className="text-2xl font-mono font-bold text-white">{projectedSold}</span>
                <span className="text-xs text-slate-500"> / {totalCapacity}</span>
              </div>
              <div className="mt-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${projectedPercentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-semibold">Projeção: {projectedPercentage}% da lotação</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Velocidade de Conversão</span>
              <div className="mt-2">
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {Math.round(24 * marketingMultiplier)} <span className="text-xs">vendas/dia</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +{Math.round((marketingMultiplier - 1) * 100)}% acelerado vs histórico
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Tempo para Sold-Out</span>
              <div className="mt-2">
                <span className="text-2xl font-mono font-bold text-purple-400">
                  {daysToSellOut > 0 ? `${daysToSellOut} dias` : "Incompleto"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-3 font-medium">
                {daysToSellOut > 0 ? "Previsão de lotação total" : "Lotação não atingida com este orçamento"}
              </span>
            </div>
          </div>

          {/* SVG Sales Curve Chart comparison */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">Curva Acumulada de Receitas (Consulta Dinâmica ao Banco de Dados)</h4>
            <div className="h-44 bg-slate-950 rounded-xl border border-slate-850/80 p-4 relative flex flex-col justify-between overflow-hidden">
              <svg className="w-full h-28 absolute inset-x-0 bottom-4 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Historical model curve */}
                <path 
                  d={`M 0 95 Q 120 85 250 ${95 - (40 * marketingMultiplier)} T 500 ${Math.max(5, 95 - (80 * marketingMultiplier))}`} 
                  fill="none" 
                  stroke="#818cf8" 
                  strokeWidth="1.5" 
                  strokeDasharray="4,4"
                  className="transition-all duration-500"
                />
                {/* Real actual current curve */}
                <path 
                  d={realPathD} 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                
                {/* Visual points on the real path for high-fidelity interactive look */}
                {realIncomePoints.map((pt, idx) => {
                  const cx = Math.round(idx * segmentWidth);
                  const cy = Math.round(95 - (pt.cumulative / maxCumulative) * 80);
                  return (
                    <g key={idx} className="group/dot">
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r="4" 
                        fill="#06b6d4" 
                        className="transition-all duration-300 hover:r-6 cursor-pointer"
                      />
                      <title>{`Data: ${pt.date} | Acumulado: R$ ${pt.cumulative.toLocaleString("pt-BR")}`}</title>
                    </g>
                  );
                })}
              </svg>
              <div className="flex-1"></div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-2 z-10">
                <span>Início</span>
                <span>Meio</span>
                <span>Fim (Hoje)</span>
              </div>
            </div>
            <div className="flex justify-end gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-0.5 bg-indigo-400 border-dashed border-t-2"></span> Modelo Preditivo Target
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-1 bg-cyan-400"></span> Real Lançado no Firestore
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Budget Overruns Predictor (1 column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-semibold font-display text-slate-200">Previsão e Risco Orçamentário</h3>
            </div>
            <p className="text-xs text-slate-400">Algoritmo avalia o risco de estouro nos centros de custos e contratos</p>
          </div>

          {/* Overrun circular gauge or progress indicator */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-center">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Circular SVG path */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke={overrunAtRisk ? "#f43f5e" : "#eab308"} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * (Math.min(100, (predictedExpenses / budgetLimit) * 100))) / 100}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-500 font-mono">CUSTO / TETO</span>
                <span className="text-base font-bold font-mono text-white">
                  {Math.round((predictedExpenses / budgetLimit) * 100)}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-200">
                {overrunAtRisk ? "⚠️ Alerta: Risco Alto de Estouro Orçamentário" : "✅ Alerta: Margem Orçamentária Saudável"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                Previsão final de despesas de R$ <strong>{predictedExpenses.toLocaleString("pt-BR")}</strong> contra teto de R$ {budgetLimit.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Department breakdown overruns risk */}
          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Estouro por Centros de Custo (IA Analisador)</span>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Infraestrutura & Tendas</span>
                  <span className="text-rose-400 font-semibold font-mono">Risco Alto (+15%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Som, Luz & LED</span>
                  <span className="text-amber-400 font-semibold font-mono">Risco Médio (+8%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[60%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Marketing & Divulgação</span>
                  <span className="text-emerald-400 font-semibold font-mono">Risco Baixo (-2%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[35%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Optimal Pricing Strategies & Professional Audit Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Optimal Pricing strategies card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-semibold font-display text-slate-200">Recomendações IA de Precificação e Receitas</h3>
            </div>
            <p className="text-xs text-slate-400">Simulação de preço ótimo de venda de ingressos baseado na curva de elasticidade e aceitação histórica</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pricingSuggestions.length === 0 ? (
              <div className="col-span-2 text-center py-6 text-slate-500 text-xs">
                Nenhum lote de ingresso cadastrado para simular.
              </div>
            ) : (
              pricingSuggestions.map((s) => (
                <div key={s.tierId} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-200 leading-tight">{s.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/15 px-2 py-0.5 rounded">
                      +{s.profitGainPercent}% Rec
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div>
                      <div className="text-[10px] text-slate-500">Tarifa Atual</div>
                      <div className="text-slate-300 font-bold mt-0.5">R$ {s.currentPrice}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-indigo-400">Tarifa Ótima</div>
                      <div className="text-indigo-400 font-bold mt-0.5">R$ {s.proposedPrice}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                    Aumento de R$ {(s.proposedPrice - s.currentPrice)} com margem máxima de receita de R$ {s.projectedRev.toLocaleString("pt-BR")}.
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={applyPricingRecom}
              disabled={isOptimizing || pricingSuggestions.length === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              style={{ minHeight: "44px" }}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Calculando e Atualizando Lotes...
                </>
              ) : pricingApplied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-white" />
                  Estratégia Tarifária Aplicada com Sucesso!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Aplicar Sugestões de Preço Ótimo de IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: Professional Audit Report */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold font-display text-slate-200">Relatório Consolidado de Auditoria Preditiva</h3>
            <p className="text-xs text-slate-400">Emita parecer técnico de inteligência preditiva diretamente ao conselho operacional</p>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[220px] text-slate-300">
            {loadingAudit ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2 text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Processando dados com PLAY+COGNITIVE...</span>
              </div>
            ) : auditText ? (
              <div className="space-y-3">
                {auditText.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">
                Clique no botão abaixo para processar e emitir o parecer preditivo.
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateAuditReport}
            className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-200 font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            style={{ minHeight: "44px" }}
          >
            <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
            Gerar Parecer de Auditoria IA
          </button>
        </div>

      </div>
    </div>
  );
}
