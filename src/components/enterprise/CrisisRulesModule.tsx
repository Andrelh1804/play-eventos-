import React, { useState } from "react";
import { 
  ShieldAlert, AlertTriangle, Play, HelpCircle, ArrowRight, CheckCircle2, 
  Settings, Layers, Users, Zap, Bell, Clock, FileText, CheckSquare, Plus, DollarSign
} from "lucide-react";

interface CrisisRulesModuleProps {
  activeEvent: any;
}

export default function CrisisRulesModule({ activeEvent }: CrisisRulesModuleProps) {
  // Incident state
  const [incidents, setIncidents] = useState([
    { id: "inc-1", category: "Médico", text: "Atleta com desgaste físico severo no Km 12", status: "Em Atendimento", severity: "Média", slaRemaining: 4, assignedTo: "UTI Móvel 1" },
    { id: "inc-2", category: "Infraestrutura", text: "Portão Eletrônico 2 travado na entrada principal", status: "Equipe Despachada", severity: "Alta", slaRemaining: 9, assignedTo: "Técnico Tiago" },
  ]);
  const [newIncidentText, setNewIncidentText] = useState("");
  const [newIncidentCat, setNewIncidentCat] = useState("Segurança");
  const [newIncidentSev, setNewIncidentSev] = useState("Alta");

  // Rules Engine State (simulating live evaluate)
  const [rules, setRules] = useState([
    { id: "r1", desc: "Se Público > 5.000 pessoas → Obrigar 2 Ambulâncias UTIs", condition: () => (activeEvent?.capacity || 5000) > 5000, value: true },
    { id: "r2", desc: "Se Previsão de Chuva > 60% → Ativar Lonas Redundantes de Palco", condition: () => true, value: true },
    { id: "r3", desc: "Se Incidente SLA Crítico > 15m → Notificar Diretoria Geral", condition: () => true, value: true },
  ]);

  // Approval flow simulation State
  const [approvals, setApprovals] = useState([
    { id: "app-101", item: "Locação de Gerador Redundante 500kVA", value: 12500, supervisor: "Aprovado", cfo: "Aprovado", ceo: "Pendente" },
    { id: "app-102", item: "Kit Banner Patrocinador Master Lote 2", value: 3400, supervisor: "Aprovado", cfo: "Pendente", ceo: "Aguardando" },
  ]);

  // Evacuation Plan steps
  const [evacActiveStep, setEvacActiveStep] = useState<number | null>(null);

  const triggerAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentText.trim()) return;
    setIncidents(prev => [
      ...prev,
      {
        id: `inc-${Date.now()}`,
        category: newIncidentCat,
        text: newIncidentText,
        status: "Pendente",
        severity: newIncidentSev,
        slaRemaining: newIncidentSev === 'Alta' ? 10 : 20,
        assignedTo: "Despachando COE..."
      }
    ]);
    setNewIncidentText("");
  };

  const handleApproveCEO = (id: string, decision: 'Aprovado' | 'Recusado') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, ceo: decision } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="crisis-rules-container">
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* PANEL 1: EMERGENCY INCIDENT CENTER & CRITICAL EVACUATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
              Central de Crise & Incidentes Ativos
            </h4>
            <span className="text-[10px] font-mono text-rose-500 bg-rose-950/40 px-1.5 rounded border border-rose-500/20">
              OPERACIONAL
            </span>
          </div>

          <form onSubmit={triggerAddIncident} className="flex gap-2">
            <input
              type="text"
              value={newIncidentText}
              onChange={(e) => setNewIncidentText(e.target.value)}
              placeholder="Descreva o incidente ou chamado urgente..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-rose-500"
            />
            <select
              value={newIncidentCat}
              onChange={(e) => setNewIncidentCat(e.target.value)}
              className="bg-slate-950 text-xs border border-slate-800 rounded-lg text-slate-300 px-1 font-mono"
            >
              <option value="Médico">Médico</option>
              <option value="Segurança">Segurança</option>
              <option value="Estrutura">Estrutura</option>
              <option value="Energia">Energia</option>
            </select>
            <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold shrink-0">
              Despachar
            </button>
          </form>

          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    inc.severity === 'Alta' ? 'bg-rose-950/40 text-rose-400' : 'bg-amber-950/40 text-amber-400'
                  }`}>
                    {inc.category} • {inc.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-rose-500" />
                    SLA: {inc.slaRemaining}m restando
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{inc.text}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 text-[10px] font-mono text-slate-500">
                  <span>Designado para: <strong className="text-slate-400">{inc.assignedTo}</strong></span>
                  <div className="flex gap-1.5">
                    {inc.status !== 'Resolvido' && (
                      <button 
                        onClick={() => {
                          setIncidents(prev => prev.map(p => p.id === inc.id ? { ...p, status: 'Resolvido', slaRemaining: 0 } : p));
                        }}
                        className="text-emerald-400 hover:underline"
                      >
                        Encerrar Incidente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Evacuation simulator workflow */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-300 block">Simulação de Plano de Evacuação Integrado</span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Acione e valide as etapas coordenadas de segurança pública do comitê corporativo COE em caso de evacuação urgente:
            </p>

            <div className="flex items-center justify-between text-xs font-mono py-1.5 bg-slate-900 px-3 rounded border border-slate-800">
              <span className="text-slate-400">Etapa Ativa:</span>
              <strong className="text-cyan-400">
                {evacActiveStep === null ? "Plano em Stand-by" :
                 evacActiveStep === 0 ? "1. Corte do Som e Luzes de Palco" :
                 evacActiveStep === 1 ? "2. Abertura Remota dos Portões de Pânico" :
                 evacActiveStep === 2 ? "3. Sirenes Direcionais e Escolta Ambulâncias" :
                 "Plano Executado com Sucesso ✓"}
              </strong>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (evacActiveStep === null) {
                    setEvacActiveStep(0);
                  } else if (evacActiveStep < 3) {
                    setEvacActiveStep(prev => prev! + 1);
                  } else {
                    setEvacActiveStep(null);
                  }
                }}
                className="flex-1 bg-rose-950 text-rose-400 border border-rose-500/20 hover:bg-rose-900 text-[11px] font-mono font-bold py-1.5 rounded transition-colors text-center"
              >
                {evacActiveStep === null ? "Testar Protocolo de Pânico" : "Avançar Próxima Etapa"}
              </button>
              {evacActiveStep !== null && (
                <button 
                  onClick={() => setEvacActiveStep(null)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 rounded px-3 text-xs"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

        </div>

        {/* PANEL 2: MOTOR DE REGRAS & FLUXOS DE APROVAÇÃO ERP */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          
          {/* Rules Engine Simulation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-cyan-400 animate-spin-slow" />
                Rule Engine (Motor de Regras Inteligentes)
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">SLA Watchdog</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-normal">
              Regras corporativas auditadas e processadas de forma server-authoritative sobre cada parâmetro do evento ativo:
            </p>

            <div className="space-y-2 text-xs font-mono">
              {rules.map((rl) => (
                <div key={rl.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-slate-300 font-bold">{rl.desc}</span>
                    <span className="text-[9px] text-slate-500 block">Status de validação automática: Ativo</span>
                  </div>
                  <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    EVALUATED OK
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ERP Approvals Chain simulator */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Alçadas e Aprovações de Custos (ERP-COE)
            </h4>
            <p className="text-xs text-slate-400">Fluxos de compras integrados que exigem aprovação multi-nível em tempo real:</p>

            <div className="space-y-2.5">
              {approvals.map((app) => (
                <div key={app.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-200 block">{app.item}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Valor: R$ {app.value.toLocaleString("pt-BR")}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded">
                      Protocolo: #{app.id}
                    </span>
                  </div>

                  {/* Visual approval step dots */}
                  <div className="grid grid-cols-3 gap-2 py-1.5 border-y border-slate-900 text-center font-mono text-[9px]">
                    <div className="p-1 bg-slate-900 border border-slate-850 rounded">
                      <span className="text-slate-500 block">Supervisor</span>
                      <strong className="text-emerald-400">{app.supervisor}</strong>
                    </div>
                    <div className="p-1 bg-slate-900 border border-slate-850 rounded">
                      <span className="text-slate-500 block">CFO Finanças</span>
                      <strong className={app.cfo === 'Aprovado' ? 'text-emerald-400' : 'text-amber-400'}>{app.cfo}</strong>
                    </div>
                    <div className="p-1 bg-slate-900 border border-slate-850 rounded">
                      <span className="text-slate-500 block">CEO André</span>
                      <strong className={app.ceo === 'Aprovado' ? 'text-emerald-400' : app.ceo === 'Recusado' ? 'text-rose-400' : 'text-amber-400 animate-pulse'}>
                        {app.ceo}
                      </strong>
                    </div>
                  </div>

                  {app.ceo === 'Pendente' && (
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button 
                        onClick={() => handleApproveCEO(app.id, 'Aprovado')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold px-3 py-1 rounded"
                      >
                        Aprovar como CEO
                      </button>
                      <button 
                        onClick={() => handleApproveCEO(app.id, 'Recusado')}
                        className="bg-rose-950 border border-rose-500/25 hover:bg-rose-900 text-rose-400 font-mono text-[10px] font-bold px-3 py-1 rounded"
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
