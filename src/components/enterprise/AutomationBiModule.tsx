import React, { useState, useEffect } from "react";
import { 
  Cpu, GitFork, ToggleLeft, ToggleRight, Database, FileSpreadsheet, 
  RefreshCw, Play, Sparkles, Plus, Copy, Check, Info, FileText, 
  Trash2, Send, AlertTriangle, TrendingUp, DollarSign, PieChart, Activity
} from "lucide-react";

interface AutomationBiModuleProps {
  activeEvent: any;
}

type ActiveTab = 'automation' | 'templates' | 'integrations' | 'analytics';

export default function AutomationBiModule({ activeEvent }: AutomationBiModuleProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('automation');

  // --- 1. Workflow Automation States ---
  const [workflows, setWorkflows] = useState([
    { id: "wf1", name: "WhatsApp Boas-vindas", trigger: "Portaria: Ingresso Lido", action: "WhatsApp: Enviar Voucher Alimentação", active: true, runCount: 1405 },
    { id: "wf2", name: "Alerta de Clima Crítico", trigger: "Sensor Meteorológico: Vento > 40km/h", action: "COE: Notificar Equipe SMS & Sirene", active: true, runCount: 1 },
    { id: "wf3", name: "Fatura Automática ERP", trigger: "CRM: Contrato Assinado Cliente", action: "SAP ERP: Emitir NFe & Boleto Split", active: false, runCount: 0 },
    { id: "wf4", name: "SLA Estrapolado Chamado", trigger: "Central COE: Chamado Aberto > 15min", action: "WhatsApp: Notificar Coordenador Setor", active: true, runCount: 12 }
  ]);

  const [newWfName, setNewWfName] = useState("");
  const [newWfTrigger, setNewWfTrigger] = useState("Portaria: Ingresso Lido");
  const [newWfAction, setNewWfAction] = useState("WhatsApp: Enviar Voucher Alimentação");

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, active: !wf.active } : wf));
  };

  const handleAddWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName) return;
    setWorkflows(prev => [...prev, {
      id: `wf-${Date.now()}`,
      name: newWfName,
      trigger: newWfTrigger,
      action: newWfAction,
      active: true,
      runCount: 0
    }]);
    setNewWfName("");
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== id));
  };

  const triggerTestWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, runCount: wf.runCount + 1 } : wf));
    alert("Simulando execução do workflow operacional! Mensagem ou ação despachada via Webhook.");
  };

  // --- 2. Templates Library States ---
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const templates = [
    { id: "t1", title: "Contrato de Patrocínio Master - Cota Platinum", type: "Jurídico", description: "Modelo completo com cláusulas de exclusividade de bebidas, multas rescisórias, e entrega de mídia LED." },
    { id: "t2", title: "Plano de Operação Padrão (POP) - Evacuação de Emergência", type: "Segurança", description: "Procedimentos operacionais mestre para brigada de incêndio, sirenes, e coordenação médica." },
    { id: "t3", title: "DRE Consolidado de Margem Executiva", type: "Financeiro", description: "Template Excel/DRE para controle de impostos fiscais retidos, faturamentos parcelados e custos fixos." },
    { id: "t4", title: "Termo de Parceria Comercial e Stands B2B", type: "Comercial", description: "Contrato para expositores de estandes incluindo especificações de carga de luz, Wi-Fi e montagem." }
  ];

  const handleCopyTemplate = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- 3. Integrations Hub States ---
  const [integrations, setIntegrations] = useState([
    { id: "int1", name: "Stripe & Pix Gateway", desc: "Transações em tempo real e conciliação bancária", connected: true, logs: "Listening to webhook stripe_payouts..." },
    { id: "int2", name: "SAP S/4HANA ERP", desc: "Sincronização de notas fiscais (NFe) e faturamento", connected: true, logs: "Synced 14 contracts successfully to ledger." },
    { id: "int3", name: "WhatsApp Business API", desc: "Envio de vouchers e alertas de portaria", connected: true, logs: "Sent 1405 welcoming messages to participants." },
    { id: "int4", name: "Google Maps Geofencing", desc: "Rastreamento e cercas virtuais de frotas", connected: false, logs: "Idle. Waiting for credential keys." },
    { id: "int5", name: "Salesforce CRM Cloud", desc: "Exportação de leads qualificados de patrocinadores", connected: false, logs: "Idle." }
  ]);

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([
    "[10:30:15] Stripe API: Webhook received, payment approved for transaction tx_981",
    "[10:30:17] SAP Ledger: NFe generated under serial 44521 for client TechCorp S.A.",
    "[10:30:18] WhatsApp Dispatcher: Dispatched welcome message to buyer Juliana Pontes"
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const nextState = !int.connected;
        const logMsg = nextState ? "Connection established. Active handshakes." : "Disconnected.";
        return { ...int, connected: nextState, logs: logMsg };
      }
      return int;
    }));
  };

  // --- 4. BI Analytics Margem (DRE) States ---
  // Structured DRE Financeiro
  const dreRevenues = [
    { title: "Bilheteria & Ingressos (Venda Geral)", value: 450000 },
    { title: "Cotas de Patrocinadores Homologadas", value: 380000 },
    { title: "Locações de Estandes Expositores", value: 120000 },
    { title: "Serviços de Utilidades Adicionais (Wi-Fi/Luz)", value: 25000 }
  ];

  const dreExpenses = [
    { title: "Custos de Fornecedores (Cenografia, Audio)", value: 205000 },
    { title: "Locação do Pavilhão / Espaço", value: 150000 },
    { title: "Custos Operacionais de Campo (Staff, Segurança)", value: 78000 },
    { title: "Impostos Retidos & Notas Fiscais (NFe)", value: 58000 },
    { title: "Seguros e Taxas Municipais (ECAD)", value: 32000 }
  ];

  const totalRevenues = dreRevenues.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = dreExpenses.reduce((sum, item) => sum + item.value, 0);
  const netProfit = totalRevenues - totalExpenses;
  const netMarginPercent = ((netProfit / totalRevenues) * 100).toFixed(1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="autobi-fase4-root">
      
      {/* Title Header with Tabs Switch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-2 py-0.5 rounded-full font-bold uppercase">MOTORES ENTERPRISE</span>
          <h3 className="text-base font-bold font-display text-slate-100 mt-1">Automação, Templates & Plataforma Analítica (BI)</h3>
          <p className="text-xs text-slate-400">Configure automações baseadas em eventos (Workflow Builder), integre APIs e confira o Demonstrativo de Resultados (DRE).</p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
          {[
            { id: 'automation', label: 'Workflows' },
            { id: 'templates', label: 'Biblioteca POPs' },
            { id: 'integrations', label: 'Integrações' },
            { id: 'analytics', label: 'BI & DRE Financeiro' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER THE ACTIVE SUB SECTION */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 min-h-[380px]">

        {/* 1. WORKFLOW BUILDER AUTOMATION */}
        {activeTab === 'automation' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <GitFork className="h-4 w-4 text-fuchsia-400" />
                  Construtor Visual de Automações Operacionais (Workflow Builder)
                </h4>
                <p className="text-xs text-slate-400">Crie gatilhos automáticos ligando sensores de IoT, portarias e CRMs a ações instantâneas de mensageria e ERPs.</p>
              </div>
            </div>

            {/* Split layout: left builder form, right active workflows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Add automation form */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Adicionar Regra de Automação</span>
                
                <form onSubmit={handleAddWorkflow} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block">Nome da Automação:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Emitir Boleto do Expositor"
                      value={newWfName}
                      onChange={(e) => setNewWfName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-fuchsia-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block">Quando (Trigger / Gatilho):</label>
                    <select 
                      value={newWfTrigger} 
                      onChange={(e) => setNewWfTrigger(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="Portaria: Ingresso Lido">Portaria: Ingresso Escaneado</option>
                      <option value="Sensor Meteorológico: Vento > 40km/h">Sensor Meteorológico: Vento &gt; 40km/h</option>
                      <option value="CRM: Contrato Assinado Cliente">CRM: Contrato Assinado Cliente</option>
                      <option value="Central COE: Chamado Aberto > 15min">Central COE: Chamado Aberto &gt; 15min</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block">Então (Action / Ação Executora):</label>
                    <select 
                      value={newWfAction} 
                      onChange={(e) => setNewWfAction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="WhatsApp: Enviar Voucher Alimentação">WhatsApp: Enviar Voucher Alimentação</option>
                      <option value="COE: Notificar Equipe SMS & Sirene">COE: Notificar Equipe SMS & Sirene</option>
                      <option value="SAP ERP: Emitir NFe & Boleto Split">SAP ERP: Emitir NFe & Boleto Split</option>
                      <option value="WhatsApp: Notificar Coordenador Setor">WhatsApp: Notificar Coordenador Setor</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono font-bold p-2 rounded flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Registrar Trigger-Action
                  </button>
                </form>
              </div>

              {/* Workflows lists */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Regras Operacionais Ativas</span>
                
                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                  {workflows.map((wf) => (
                    <div key={wf.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-200 text-sm">{wf.name}</strong>
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase ${
                            wf.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {wf.active ? 'Ativo' : 'Desativado'}
                          </span>
                        </div>
                        <div className="text-slate-400 leading-normal">
                          <span className="text-fuchsia-400 font-mono text-[10px]">SE</span> {wf.trigger}
                        </div>
                        <div className="text-slate-400 leading-normal">
                          <span className="text-cyan-400 font-mono text-[10px]">ENTÃO</span> {wf.action}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 mr-2">Disparos: {wf.runCount}</span>
                        
                        <button 
                          onClick={() => triggerTestWorkflow(wf.id)}
                          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 p-1.5 rounded cursor-pointer"
                          title="Simular Teste Webhook"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>

                        <button 
                          onClick={() => handleToggleWorkflow(wf.id)}
                          className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        >
                          {wf.active ? <ToggleRight className="h-6 w-6 text-emerald-400" /> : <ToggleLeft className="h-6 w-6 text-slate-600" />}
                        </button>

                        <button 
                          onClick={() => handleDeleteWorkflow(wf.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. TEMPLATES LIBRARY */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <FileSpreadsheet className="h-4 w-4 text-fuchsia-400" />
                  Biblioteca de Documentos, Contratos & POPs mestre
                </h4>
                <p className="text-xs text-slate-400">Modelos jurídicos estruturados prontos para replicação e homologação junto a órgãos fiscalizadores.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tpl) => {
                const isCopied = copiedId === tpl.id;
                return (
                  <div key={tpl.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-fuchsia-400 font-bold uppercase bg-fuchsia-500/10 border border-fuchsia-500/20 px-1.5 py-0.5 rounded">{tpl.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {tpl.id}</span>
                      </div>
                      <h5 className="font-bold text-slate-200 text-sm leading-snug">{tpl.title}</h5>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{tpl.description}</p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-950">
                      <button 
                        onClick={() => handleCopyTemplate(tpl.id)}
                        className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-mono text-[10px] font-bold py-1 px-3 rounded flex items-center gap-1.5 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" /> Clonado na Conta!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Duplicar Modelo / Usar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. INTEGRATIONS HUB */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Database className="h-4 w-4 text-fuchsia-400" />
                  Centro de Integrações de APIs de Terceiros (Integration Hub)
                </h4>
                <p className="text-xs text-slate-400">Ative ou pause integrações de faturamentos, notas fiscais eletrônicas, WhatsApp e telemetria de tráfego.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Integrations toggles lists */}
              <div className="lg:col-span-2 space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {integrations.map((int) => (
                  <div key={int.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl text-xs flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-200">{int.name}</div>
                      <p className="text-slate-400 text-[11px] leading-tight">{int.desc}</p>
                      <span className="text-[9px] font-mono text-slate-500 block">Log: {int.logs}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleIntegration(int.id)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        {int.connected ? <ToggleRight className="h-7 w-7 text-emerald-400" /> : <ToggleLeft className="h-7 w-7 text-slate-600" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Streaming real time log simulation */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between h-[320px]">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-fuchsia-400" />
                    Live Webhook API Logs
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono leading-tight">Logs de sincronização de portais em tempo real.</p>
                </div>

                <div className="flex-1 bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[9px] text-emerald-400 space-y-2 overflow-y-auto mt-2 select-none h-[180px]">
                  {simulatedLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">{log}</div>
                  ))}
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setSimulatedLogs(prev => [
                        `[${new Date().toLocaleTimeString("pt-BR")}] Simulated REST Event: Pushed event ledger data to Totvs/SAP node`,
                        ...prev
                      ]);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 font-mono text-[10px] py-1 px-3 rounded cursor-pointer"
                  >
                    Simular REST Post API call
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. BI ANALYTICS DRE FINANCEIRO */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <DollarSign className="h-4 w-4 text-fuchsia-400" />
                  DRE Financeiro Consolidado (Fase 4 BI Executivo)
                </h4>
                <p className="text-xs text-slate-400">Verifique a Demonstração do Resultado do Exercício consolidada, impostos NFe, faturamentos e margem líquida.</p>
              </div>
            </div>

            {/* Split Revenues vs Expenses lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* DRE Detailed listing */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Demonstração de Margem Líquida</span>
                
                <div className="space-y-3">
                  {/* Revenues */}
                  <div className="space-y-1">
                    <div className="font-bold text-emerald-400 font-mono uppercase text-[10px] tracking-wider">(+) RECEITA BRUTA OPERACIONAL</div>
                    <div className="space-y-1.5">
                      {dreRevenues.map((r, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300 font-sans border-b border-slate-950 pb-1 text-[11px]">
                          <span>{r.title}</span>
                          <span className="font-mono text-slate-100">R$ {r.value.toLocaleString("pt-BR")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="space-y-1 pt-2">
                    <div className="font-bold text-rose-400 font-mono uppercase text-[10px] tracking-wider">(-) CUSTOS OPERACIONAIS E IMPOSTOS</div>
                    <div className="space-y-1.5">
                      {dreExpenses.map((e, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300 font-sans border-b border-slate-950 pb-1 text-[11px]">
                          <span>{e.title}</span>
                          <span className="font-mono text-slate-100">R$ {e.value.toLocaleString("pt-BR")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DRE Executive Tally Card */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-4">
                <div className="space-y-3 text-xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Sumário Executivo Consolidado</span>
                  
                  <div className="space-y-2">
                    <div className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-400 font-sans">Receitas Totais:</span>
                      <span className="font-bold text-emerald-400 font-mono">R$ {totalRevenues.toLocaleString("pt-BR")}</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between text-xs">
                      <span className="text-slate-400 font-sans">Despesas Totais:</span>
                      <span className="font-bold text-rose-400 font-mono">R$ {totalExpenses.toLocaleString("pt-BR")}</span>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-800/20 p-3 rounded-lg text-center space-y-1.5">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">Resultado Líquido do Exercício</span>
                      <div className="text-2xl font-mono font-bold text-emerald-400">
                        R$ {netProfit.toLocaleString("pt-BR")}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">Margem de Lucro: <strong>{netMarginPercent}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-850 text-center text-[10px] text-slate-500 font-mono leading-relaxed">
                  ✓ Conciliado com livros contábeis fiscais SAP ERP em conformidade com as regras brasileiras NFe.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
