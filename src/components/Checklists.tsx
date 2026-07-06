import React, { useState } from "react";
import { 
  CheckSquare, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Loader2,
  Trash2
} from "lucide-react";
import { ChecklistItem, Event } from "../types";

interface ChecklistsProps {
  checklists: ChecklistItem[];
  events: Event[];
  activeEventId: string;
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  toggleChecklistItem: (id: string) => void;
  deleteChecklistItem: (id: string) => void;
  applyAIGeneratedPlan: (aiData: any) => void;
}

export default function Checklists({
  checklists,
  events,
  activeEventId,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  applyAIGeneratedPlan
}: ChecklistsProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChecklistItem['category'] | 'all'>('all');
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ChecklistItem['category']>("production");
  const [newPriority, setNewPriority] = useState<ChecklistItem['priority']>("medium");

  // AI Planner state
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [aiPlanResult, setAiPlanResult] = useState<any | null>(null);

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeChecklists = checklists.filter(c => c.eventId === activeEventId);
  const filteredChecklists = selectedCategory === 'all' 
    ? activeChecklists 
    : activeChecklists.filter(c => c.category === selectedCategory);

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addChecklistItem({
      eventId: activeEventId,
      title: newTitle,
      completed: false,
      category: newCategory,
      priority: newPriority
    });
    setNewTitle("");
  };

  // Run AI Planning
  const runAIPlanning = async () => {
    if (!activeEvent) return;
    setAiLoading(true);
    setAiPlanResult(null);

    // Reassuring progressive loading messages
    const steps = [
      "Inicializando PLAY+COGNITIVE AI...",
      "Processando escopo, local de realização e volume estimado de público...",
      "Cruzando referências normativas e regras de infraestrutura (Alvarás, UTIs)...",
      "Consolidando centros de custo e estimativas de preço de ingressos...",
      "Estruturando plano de mitigação de riscos e cronograma regressivo...",
      "Finalizando e formatando plano de negócios..."
    ];

    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    try {
      const res = await fetch("/api/gemini/planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeEvent.name,
          category: activeEvent.category,
          venue: activeEvent.venue,
          date: activeEvent.date,
          budget: activeEvent.capacity * 80, // rough dynamic budget multiplier
          description: activeEvent.description
        })
      });

      const json = await res.json();
      clearInterval(interval);

      if (json.data) {
        setAiPlanResult(json.data);
      } else {
        alert("Instabilidade ao retornar dados do planejador de inteligência artificial.");
      }
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      alert("Falha na requisição com o servidor PLAY+COGNITIVE.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyPlan = () => {
    if (!aiPlanResult) return;
    applyAIGeneratedPlan(aiPlanResult);
    alert("Planejamento estratégico da Inteligência Artificial aplicado com sucesso ao seu Evento! Verifique o Cronograma, Kanban, Checklists, Ticketing e ERP Financeiro.");
    setAiPlanResult(null);
  };

  const categoriesConfig: Record<ChecklistItem['category'], { label: string; color: string }> = {
    infra: { label: "Infraestrutura", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    security: { label: "Segurança", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    marketing: { label: "Marketing", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
    finance: { label: "Financeiro", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    legal: { label: "Jurídico", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
    production: { label: "Produção", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    sports: { label: "Esportes", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
  };

  const stepsList = [
    "Inicializando PLAY+COGNITIVE AI...",
    "Processando escopo, local de realização e volume estimado de público...",
    "Cruzando referências normativas e regras de infraestrutura (Alvarás, UTIs)...",
    "Consolidando centros de custo e estimativas de preço de ingressos...",
    "Estruturando plano de mitigação de riscos e cronograma regressivo...",
    "Finalizando e formatando plano de negócios..."
  ];

  return (
    <div className="space-y-8" id="checklists-view">
      {/* Intro section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Checklists Inteligentes & IA Planejador</h2>
          <p className="text-xs text-slate-400 mt-0.5">Modelos de conformidade técnica e planejamento generativo</p>
        </div>

        {/* AI Action button */}
        <button
          onClick={runAIPlanning}
          disabled={aiLoading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/15 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 animate-bounce" />
          Gerar Planejamento Completo com IA
        </button>
      </div>

      {/* AI Loading Screen */}
      {aiLoading && (
        <div className="bg-slate-900/80 border border-purple-900/30 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto shadow-xl">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto" />
          <h3 className="text-sm font-semibold text-slate-100 font-display">PLAY+COGNITIVE Inteligência Artificial</h3>
          <p className="text-xs text-purple-400 font-mono tracking-wider animate-pulse">{stepsList[loadingStep]}</p>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden max-w-sm mx-auto">
            <div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / stepsList.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500">Isso pode levar alguns segundos. Estamos consolidando dados realistas de mercado.</p>
        </div>
      )}

      {/* AI Generated Plan Panel Preview */}
      {aiPlanResult && !aiLoading && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-6 shadow-2xl max-w-5xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200 font-display">Plano Estratégico Sugerido pela IA</h3>
            </div>
            <button
              onClick={handleApplyPlan}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-500/20"
            >
              Aplicar este Planejamento ao Evento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline proposed */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-purple-400 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Cronograma de Marcos Regressivos
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {aiPlanResult.timeline?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <strong className="text-slate-300">{item.title}</strong>
                      <span className="text-purple-400 font-semibold">{item.dateOffset} dias</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist items proposed */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-purple-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ações e Conformidade Sugeridas
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {aiPlanResult.checklists?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center gap-3">
                    <div>
                      <p className="text-xs text-slate-200 font-medium">{item.title}</p>
                      <span className="text-[9px] font-mono text-purple-400 font-bold uppercase mt-1 inline-block bg-purple-950 px-1.5 py-0.5 rounded leading-none border border-purple-500/10">{item.category}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded font-bold uppercase ${
                      item.priority === 'high' ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>{item.priority === 'high' ? 'alta' : 'média'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk analysis proposed */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-purple-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Análise de Riscos Operacionais
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {aiPlanResult.riskAnalysis?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <strong className="text-rose-400 font-bold uppercase">Risco: {item.risk}</strong>
                      <span className="bg-rose-950 text-rose-400 px-1.5 rounded uppercase font-semibold">Impacto: {item.impact}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal"><strong className="text-slate-300">Mitigação:</strong> {item.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing / Budget suggestions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-purple-400 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Sugestões de Precificação de Ingressos
              </h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {aiPlanResult.pricingSuggestions?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                      <strong className="text-slate-300">{item.name}</strong>
                      <span className="text-emerald-400 font-bold">R$ {item.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Checklist and Filter Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Manual Add Checklist Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Nova Ação de Conformidade</h3>
          
          <form onSubmit={handleAddManualItem} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Item do Checklist</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Verificar extintores"
                className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ChecklistItem['category'])}
                className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="production">Produção Geral</option>
                <option value="infra">Infraestrutura</option>
                <option value="security">Segurança</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Financeiro</option>
                <option value="legal">Jurídico</option>
                <option value="sports">Esportes</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Prioridade</label>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-semibold uppercase border ${
                      newPriority === p 
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {p === 'high' ? 'alta' : p === 'medium' ? 'média' : 'baixa'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs py-2 rounded-xl transition-all shadow-md mt-4"
            >
              Registrar no Checklist
            </button>
          </form>
        </div>

        {/* Checklists rendering panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Itens Ativos do Evento</h3>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${
                  selectedCategory === 'all' ? 'bg-cyan-950 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Todos
              </button>
              {Object.keys(categoriesConfig).map((catKey) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey as ChecklistItem['category'])}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${
                    selectedCategory === catKey ? 'bg-cyan-950 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {categoriesConfig[catKey as ChecklistItem['category']].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {filteredChecklists.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Nenhuma ação cadastrada nesta categoria.
              </div>
            ) : (
              filteredChecklists.map((item) => {
                const config = categoriesConfig[item.category] || { label: "Produção", color: "bg-slate-800 text-slate-400" };
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`bg-slate-950 border hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      item.completed ? 'border-emerald-500/20 bg-emerald-950/5 opacity-70' : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <CheckSquare className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <p className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none border uppercase tracking-wider font-bold ${config.color}`}>
                            {config.label}
                          </span>
                          <span className={`text-[8px] font-mono px-1 py-0.5 rounded font-bold uppercase leading-none ${
                            item.priority === 'high' ? 'bg-rose-950 text-rose-400 border border-rose-500/10' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.priority === 'high' ? 'alta' : 'média'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChecklistItem(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Deletar checklist item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
