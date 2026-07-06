import React, { useState, useEffect, useRef } from "react";
import { 
  Users, DollarSign, QrCode, Flame, AlertTriangle, CloudSun, TrendingUp, 
  Clock, Play, Pause, RefreshCw, Plus, Activity, FileText, Database, 
  MapPin, ShieldAlert, Wrench, Truck, FileSpreadsheet, Cpu, Eye, BookOpen, 
  Smartphone, Tablet, Monitor, Tv, Check, Trash2, Send, Share2, Sliders, 
  Download, Search, Compass, Workflow, UserCheck, Bell, FileDown, Lock,
  ChevronRight, AlertCircle, Sparkles, Server, HelpCircle, HardDrive, ShieldCheck
} from "lucide-react";
import { Event, TicketTier, TicketSale, Transaction, ServiceTicket } from "../types";
import { fetchAuditLogs } from "../lib/auditLogger";

interface DashboardCOEProps {
  events: Event[];
  activeEventId: string;
  ticketTiers: TicketTier[];
  ticketSales: TicketSale[];
  transactions: Transaction[];
  serviceTickets: ServiceTicket[];
  triggerCheckInSimulation: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

// Sub-modules navigation tabs inside NOC 360°
type NocModuleTab = 
  | 'panels' 
  | 'ecc_twin' 
  | 'iot_obs' 
  | 'incidents' 
  | 'automation_crisis' 
  | 'ai_agents' 
  | 'audit_dw' 
  | 'apps_roadmap';

// The 11 specific operations dashboards (Painéis)
type SubPanelId = 
  | 'executive' 
  | 'operational' 
  | 'finance' 
  | 'commercial' 
  | 'marketing' 
  | 'sponsorship' 
  | 'logistics' 
  | 'infrastructure' 
  | 'security' 
  | 'medical' 
  | 'sports';

interface NocIncident {
  id: string;
  title: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  responsible: string;
  slaMinutes: number;
  remainingMinutes: number;
  evidenceType: 'photo' | 'video' | 'sensor_log';
  evidenceUrl: string;
  actionPlan: string;
  createdAt: string;
}

export default function DashboardCOE({
  events,
  activeEventId,
  ticketTiers,
  ticketSales,
  transactions,
  serviceTickets,
  triggerCheckInSimulation,
  addTransaction
}: DashboardCOEProps) {
  // --- CORE STATE ---
  const [activeModule, setActiveModule] = useState<NocModuleTab>('panels');
  const [selectedPanel, setSelectedPanel] = useState<SubPanelId>('executive');
  const [simActive, setSimActive] = useState<boolean>(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeDeviceView, setActiveDeviceView] = useState<'videowall' | 'desktop' | 'tablet' | 'smartphone'>('videowall');
  const [digitalTwinOverlay, setDigitalTwinOverlay] = useState<'crowd' | 'power' | 'traffic' | 'none'>('crowd');
  
  // Realtime sensor simulated telemetry values
  const [telemetry, setTelemetry] = useState({
    generatorLoad: 78,
    generatorTemp: 52,
    waterLevel: 85,
    wifiSpeedMbps: 940,
    apiLatencyMs: 14,
    dbCpuLoad: 31,
    cacheHitRate: 98.4,
    windSpeedKmh: 24,
    crowdCount: 1240
  });

  // --- INCIDENTS & ALERTS ---
  const [incidents, setIncidents] = useState<NocIncident[]>([
    {
      id: "INC-901",
      title: "Pico de Tensão no Subgerador #2 (Praça de Alimentação)",
      department: "Infraestrutura",
      priority: "high",
      status: "investigating",
      responsible: "Eng. Marcos Silva",
      slaMinutes: 15,
      remainingMinutes: 8,
      evidenceType: "sensor_log",
      evidenceUrl: "JSON Payload: Voltage spike 242V recorded at phase L3",
      actionPlan: "Realizar o bypass para o Gerador Redundante de Backup #3 e testar disjuntores de fluxo.",
      createdAt: "2026-07-05T21:30:00Z"
    },
    {
      id: "INC-902",
      title: "Interrupção de Enlace de Internet Dedicada (Setor de Credenciamento)",
      department: "Tecnologia",
      priority: "critical",
      status: "open",
      responsible: "Fabiana Reis (TI)",
      slaMinutes: 10,
      remainingMinutes: 4,
      evidenceType: "sensor_log",
      evidenceUrl: "Network loss alert: Carrier backbone unreachable",
      actionPlan: "Roteamento forçado automático para link redundante de satélite Starlink Corporativo.",
      createdAt: "2026-07-05T21:40:00Z"
    },
    {
      id: "INC-903",
      title: "Incidente de Calor Excessivo / Insolação na Grade Frontal",
      department: "Médico",
      priority: "medium",
      status: "resolved",
      responsible: "Dr. Gustavo Prado",
      slaMinutes: 20,
      remainingMinutes: 0,
      evidenceType: "photo",
      evidenceUrl: "Medical dispatch completed: Patient stabilized at ICU field unit",
      actionPlan: "Hidratação intravenosa imediata e monitoramento de sinais vitais.",
      createdAt: "2026-07-05T21:12:00Z"
    }
  ]);

  const [newIncidentTitle, setNewIncidentTitle] = useState("");
  const [newIncidentDept, setNewIncidentDept] = useState("Segurança");
  const [newIncidentPriority, setNewIncidentPriority] = useState<'low' | 'medium' | 'high' | 'critical'>("medium");
  const [newIncidentDesc, setNewIncidentDesc] = useState("");
  const [newIncidentResp, setNewIncidentResp] = useState("");

  const [activeAlerts, setActiveAlerts] = useState([
    { id: "A-01", message: "Catraca #4 (Pórtico B) registrando alto índice de cartões inválidos consecutivos.", severity: "warning", timestamp: "21:45" },
    { id: "A-02", message: "Lotação do Pavilhão Central ultrapassou 90% da capacidade estipulada pelo AVCB.", severity: "danger", timestamp: "21:48" }
  ]);

  // --- AUTOMATION ENGINE ---
  const [workflows, setWorkflows] = useState([
    { id: "WF-101", name: "Lotação > 90% Pavilhão", trigger: "Capacidade Geral > 90%", action: "Abrir Portões de Emergência 4 & 5 + Enviar Push COE", active: true, hits: 2 },
    { id: "WF-102", name: "Alerta de Queda de Link Fibra", trigger: "Ping Switch Central > 500ms", action: "Disparar Webhook Roteador Satélite + SMS TI", active: true, hits: 0 },
    { id: "WF-103", name: "Confirmação de Pagamento Ingressos", trigger: "Stripe API Webhook: Paid", action: "Gerar QR Code + Enviar WhatsApp Notificação", active: true, hits: 1402 }
  ]);
  const [newWfTrigger, setNewWfTrigger] = useState("Lotação Geral > 90%");
  const [newWfAction, setNewWfAction] = useState("Acionar Sirene de Campo e Alerta de Fluxo");
  const [newWfName, setNewWfName] = useState("");

  // --- CRISIS ROOM (SALA DE CRISE) ---
  const [crisisMode, setCrisisMode] = useState<boolean>(false);
  const [crisisTimeline, setCrisisTimeline] = useState<Array<{ id: string, time: string, author: string, desc: string, resolution: boolean }>>([
    { id: "cr-1", time: "21:30", author: "Marcos Silva", desc: "Identificado risco de pane elétrica geral no palco secundário.", resolution: false },
    { id: "cr-2", time: "21:35", author: "NOC Diretor", desc: "Declarado Estado de Crise Nível 1. Acionados bombeiros civis preventivamente.", resolution: false }
  ]);
  const [crisisLogInput, setCrisisLogInput] = useState("");

  // --- COGNITIVE IA AGENTS (8 AGENTS) ---
  const [selectedAgent, setSelectedAgent] = useState<string>("operational");
  const [agentDialogs, setAgentDialogs] = useState<Record<string, string>>({
    operational: "Agente Operacional: 'Sugiro otimizar o fluxo de entrada do Pórtico B, realocando 2 staffs do credenciamento VIP que está ocioso. Tempo médio de resposta a incidentes de catraca caiu para 3.5 minutos.'",
    financial: "Agente Financeiro: 'As receitas via PIX cresceram 22% na última hora. O split de faturamento para os fornecedores de alimentação está rodando sem pendências. Sem inconsistências no livro fiscal.'",
    commercial: "Agente Comercial: 'O ritmo de vendas para o lote final atingiu pico de 4.8 ingressos/minuto. Carrinhos abandonados caíram de 14% para 9.5% após ativação do cupom dinâmico via SMS.'",
    security: "Agente de Segurança: 'Recomendo manter monitoramento cerrado no setor sul. O mapa térmico indica adensamento populacional próximo às saídas de emergência secundárias. Risco sob controle.'",
    infrastructure: "Agente de Infraestrutura: 'O Gerador Principal consumiu 110L de diesel nas últimas 2 horas. Temperatura operacional estabilizada em 52°C. Internet principal apresenta latência saudável de 12ms.'",
    logistic: "Agente Logístico: 'Duas ambulâncias de prontidão médica de suporte avançado rotacionaram conforme cronograma. Veículo de coleta de resíduos operando na rota alternativa para evitar trânsito.'",
    service: "Agente de Atendimento: 'O tempo médio de encerramento de chamados no COE está em 12 minutos, bem abaixo do limite acordado de 15 minutos em contrato de SLA. Satisfação geral alta.'",
    executive: "Agente Executivo: 'Painel Geral: Operações simultâneas estáveis. Riscos contingenciados na Sala de Crise. Eficiência geral estimada em 97.4%. Margem de lucro consolidada atingindo a meta.'"
  });

  // --- DATA WAREHOUSE & LAKE PAYLOADS ---
  const [auditTrail, setAuditTrail] = useState<Array<{ time: string, user: string, action: string, type: string }>>([]);

  // Fetch real-time audit logs from Firestore
  useEffect(() => {
    const loadAudit = async () => {
      try {
        const logs = await fetchAuditLogs();
        if (logs && logs.length > 0) {
          setAuditTrail(logs.map(l => ({
            time: l.time || new Date().toLocaleTimeString(),
            user: `${l.userName} (${l.userEmail})`,
            action: l.action,
            type: l.type
          })));
        }
      } catch (err) {
        console.error("Erro ao carregar logs de auditoria do Firestore:", err);
      }
    };
    loadAudit();
    const interval = setInterval(loadAudit, 4000);
    return () => clearInterval(interval);
  }, [activeEventId]);

  // --- REPORT GENERATOR ---
  const [selectedReportType, setSelectedReportType] = useState<string>("operational");
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // --- NOC APPS SIMULATION ---
  const [activeNocApp, setActiveNocApp] = useState<string>("gestor");

  // Dynamic values based on applet data properties
  const activeEvent = events.find(e => e.id === activeEventId);
  const activeTiers = ticketTiers.filter(t => t.eventId === activeEventId);
  const activeSales = ticketSales.filter(s => s.eventId === activeEventId);
  const activeTx = transactions.filter(t => t.eventId === activeEventId);
  const activeServiceTickets = serviceTickets.filter(t => t.eventId === activeEventId);

  // Statistics
  const totalCapacity = activeTiers.reduce((acc, curr) => acc + curr.capacity, 0) || 2000;
  const totalSold = activeTiers.reduce((acc, curr) => acc + curr.sold, 0) || 1550;
  const totalCheckedIn = activeSales.filter(s => s.checkedIn).length || telemetry.crowdCount;

  const revenue = activeTx.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) || 725000;
  const expenses = activeTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) || 310000;
  const netProfit = revenue - expenses;

  // Real-time feeds
  useEffect(() => {
    let initialLogs = [
      `[${new Date().toLocaleTimeString()}] NOC 360° Inicializado - Monitoramento Ativo 24/7.`,
      `[${new Date().toLocaleTimeString()}] Conexão de Redundância SAP ERP sincronizada com sucesso.`,
      `[${new Date().toLocaleTimeString()}] Transmissão de telemetria das catracas RFID homologada.`,
      `[${new Date().toLocaleTimeString()}] Clima local monitorado via INMET: Vento calmo, umidade 65%.`
    ];
    setLogs(initialLogs);
  }, [activeEventId]);

  // Simulation ticking logic
  useEffect(() => {
    if (!simActive) return;

    const interval = setInterval(() => {
      // Trigger checkout check
      triggerCheckInSimulation();

      // Random telemetry fluctuations
      setTelemetry(prev => {
        const nextTemp = prev.generatorTemp + (Math.random() > 0.5 ? 1 : -1);
        const nextCrowd = prev.crowdCount + Math.floor(Math.random() * 5) + 1;
        const nextLoad = Math.max(65, Math.min(95, prev.generatorLoad + (Math.random() > 0.5 ? 2 : -2)));
        const nextLatency = Math.max(8, Math.min(25, prev.apiLatencyMs + (Math.random() > 0.5 ? 1 : -1)));
        
        // Randomly trigger alerts on critical thresholds
        if (nextTemp > 56 && !activeAlerts.some(a => a.id === 'temp-alert')) {
          setActiveAlerts(prevAlerts => [
            { id: 'temp-alert', message: "Temperatura do Subgerador #2 atingiu limite de atenção: " + nextTemp + "°C", severity: "warning", timestamp: new Date().toLocaleTimeString().slice(0, 5) },
            ...prevAlerts
          ]);
        }

        return {
          ...prev,
          generatorTemp: Math.max(45, Math.min(65, nextTemp)),
          crowdCount: nextCrowd,
          generatorLoad: nextLoad,
          apiLatencyMs: nextLatency,
          dbCpuLoad: Math.max(15, Math.min(80, prev.dbCpuLoad + (Math.random() > 0.5 ? 3 : -3)))
        };
      });

      // Decrement active incident timers
      setIncidents(prev => prev.map(inc => {
        if (inc.status !== 'resolved' && inc.remainingMinutes > 0) {
          return { ...inc, remainingMinutes: inc.remainingMinutes - 1 };
        }
        return inc;
      }));

      // Append random NOC operations logs
      const randomOps = [
        "Sinal de telemetria do drone de perímetro estável a 120m de altitude.",
        "Equipe de bombeiros civis reporta: Rondas regulares sem intercorrências.",
        "Consumo hídrico do pavilhão monitorado: Fluxo constante dentro da vazão padrão.",
        "Check-in QR Code validado com sucesso pelo aplicativo operador do NOC.",
        "Auditoria de segurança de rede: Zero ameaças de negação de serviço (DDoS) detectadas."
      ];
      const selectedLog = randomOps[Math.floor(Math.random() * randomOps.length)];
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] NOC Log: ${selectedLog}`, ...prev.slice(0, 15)]);

    }, 6000);

    return () => clearInterval(interval);
  }, [simActive, activeAlerts, triggerCheckInSimulation]);

  // --- HANDLERS ---
  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentTitle) return;

    const newInc: NocIncident = {
      id: `INC-${Math.floor(Math.random() * 900) + 100}`,
      title: newIncidentTitle,
      department: newIncidentDept,
      priority: newIncidentPriority,
      status: "open",
      responsible: newIncidentResp || "Plantonista de Turno",
      slaMinutes: 15,
      remainingMinutes: 15,
      evidenceType: "photo",
      evidenceUrl: "Visual diagnostic uploaded manually.",
      actionPlan: newIncidentDesc || "Diagnosticar cabo estruturado e conferir logs do painel elétrico.",
      createdAt: new Date().toISOString()
    };

    setIncidents(prev => [newInc, ...prev]);
    setAuditTrail(prev => [
      { time: new Date().toLocaleTimeString(), user: "NOC Operador", action: `Incidente registrado: ${newIncidentTitle}`, type: "Incidente" },
      ...prev
    ]);

    setLogs(prev => [`[${new Date().toLocaleTimeString()}] NOC Alerta: Novo incidente adicionado: ${newIncidentTitle}`, ...prev]);
    setNewIncidentTitle("");
    setNewIncidentDesc("");
    setNewIncidentResp("");
  };

  const handleResolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved', remainingMinutes: 0 } : inc));
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] NOC Sucesso: Incidente ${id} marcado como resolvido.`, ...prev]);
    setAuditTrail(prev => [
      { time: new Date().toLocaleTimeString(), user: "NOC Supervisor", action: `Encerramento do Incidente ${id}`, type: "Incidente" },
      ...prev
    ]);
  };

  const handleTriggerMockAlert = (type: string) => {
    if (type === 'overcapacity') {
      const alertMsg = "Capacidade de público ultrapassou 95%. Fluxo excedente redirecionado para os portões B e C secundários.";
      setActiveAlerts(prev => [{ id: `A-${Date.now()}`, message: alertMsg, severity: "danger", timestamp: new Date().toLocaleTimeString().slice(0, 5) }, ...prev]);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] [AUTOMAÇÃO] Alerta de Capacidade Ativado! Notificando supervisor de campo.`, ...prev]);
      
      // Trigger automatic automation workflow count
      setWorkflows(prev => prev.map(wf => wf.id === "WF-101" ? { ...wf, hits: wf.hits + 1 } : wf));
    } else if (type === 'generator') {
      const alertMsg = "Queda repentina na geração primária de energia. Subgerador elétrico #2 acionado no pavilhão de serviços.";
      setActiveAlerts(prev => [{ id: `A-${Date.now()}`, message: alertMsg, severity: "danger", timestamp: new Date().toLocaleTimeString().slice(0, 5) }, ...prev]);
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] [AUTOMAÇÃO] Alerta de Gerador! Chamado de manutenção automática disparado.`, ...prev]);
      
      // Add a service ticket automatically
      const newInc: NocIncident = {
        id: `INC-${Math.floor(Math.random() * 900) + 100}`,
        title: "Queda de Tensão Crítica - Gerador Primário Desligado",
        department: "Infraestrutura",
        priority: "critical",
        status: "open",
        responsible: "Equipe Elétrica Plantão",
        slaMinutes: 10,
        remainingMinutes: 10,
        evidenceType: "sensor_log",
        evidenceUrl: "RPM dropped below 1000. Grid feedback offline.",
        actionPlan: "Substituir baterias de ignição e verificar duto de diesel principal.",
        createdAt: new Date().toISOString()
      };
      setIncidents(prev => [newInc, ...prev]);
    }
  };

  const handleAddWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName) return;

    setWorkflows(prev => [...prev, {
      id: `WF-${Math.floor(Math.random() * 800) + 200}`,
      name: newWfName,
      trigger: newWfTrigger,
      action: newWfAction,
      active: true,
      hits: 0
    }]);

    setLogs(prev => [`[${new Date().toLocaleTimeString()}] NOC Workflow: Regra de trigger registrada: ${newWfName}`, ...prev]);
    setNewWfName("");
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, active: !wf.active } : wf));
  };

  const handleAddCrisisLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crisisLogInput) return;

    setCrisisTimeline(prev => [...prev, {
      id: `cr-${Date.now()}`,
      time: new Date().toLocaleTimeString().slice(0, 5),
      author: "NOC Diretor",
      desc: crisisLogInput,
      resolution: false
    }]);

    setCrisisLogInput("");
  };

  const handleResolveCrisis = () => {
    setCrisisTimeline(prev => [...prev, {
      id: `cr-end-${Date.now()}`,
      time: new Date().toLocaleTimeString().slice(0, 5),
      author: "NOC Diretor",
      desc: "Todas as contingências operacionais foram validadas. Crise resolvida de forma definitiva.",
      resolution: true
    }]);
    setCrisisMode(false);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] NOC: Encerramento formal do estado de crise. Relatórios pós-incidente gerados.`, ...prev]);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      
      const compileDate = new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR");
      let content = {};
      if (selectedReportType === 'operational') {
        content = {
          title: "Relatório de Eficiência Operacional NOC 360°",
          indicators: [
            { label: "Público Total no Evento", value: telemetry.crowdCount },
            { label: "Check-ins Consolidados via RFID/QR Code", value: totalCheckedIn },
            { label: "Média de Atendimento de SLA COE", value: "11.8 minutos" },
            { label: "Incidentes Totais Registrados", value: incidents.length },
            { label: "Disparos do Motor de Automação", value: workflows.reduce((acc, curr) => acc + curr.hits, 0) }
          ],
          conclusions: "A operação conjunta de portaria eletrônica e monitoramento do COE manteve a integridade estrutural e de fluxo do evento sem falhas críticas. O tempo médio de resposta de campo permaneceu abaixo da meta estabelecida de 15 minutos."
        };
      } else if (selectedReportType === 'finance') {
        content = {
          title: "Relatório Financeiro Consolidado NOC 360°",
          indicators: [
            { label: "Faturamento Bruto Consolidado", value: `R$ ${revenue.toLocaleString("pt-BR")}` },
            { label: "Despesas de Custos Operacionais", value: `R$ ${expenses.toLocaleString("pt-BR")}` },
            { label: "Resultado Líquido do Exercício (EBITDA)", value: `R$ ${netProfit.toLocaleString("pt-BR")}` },
            { label: "Ticket Médio por Participante", value: `R$ ${(revenue / totalSold).toFixed(2)}` },
            { label: "Split de Pagamentos de Fornecedores", value: "100% Homologado" }
          ],
          conclusions: "O faturamento excedeu as predições operacionais em 12% devido ao forte pico de vendas de ingressos de última hora. O faturamento está conciliado com livros contábeis fiscais SAP ERP em conformidade com as regras brasileiras NFe."
        };
      } else if (selectedReportType === 'security') {
        content = {
          title: "Relatório Executivo de Segurança & Evacuação NOC",
          indicators: [
            { label: "Equipe de Brigadistas Ativos", value: "24 prof." },
            { label: "Pontos de Câmeras de Monitoramento Ativas", value: "18 câmeras" },
            { label: "Incidentes de Segurança", value: incidents.filter(i => i.department === 'Segurança').length },
            { label: "Nível de Risco Geral Estimado", value: crisisMode ? "Médio (Sob Gestão)" : "Baixo" }
          ],
          conclusions: "O controle de acesso integrado ao sistema de geofencing monitorou a dispersão do público sem gargalos. As rotas de fuga permaneceram livres e em conformidade com o AVCB e corpo de bombeiros."
        };
      } else {
        content = {
          title: "Relatório ESG & Sustentabilidade NOC",
          indicators: [
            { label: "Pegada de Carbono Compensada", value: "12.4 toneladas" },
            { label: "Destinação Correta de Resíduos Sólidos", value: "98% Triagem" },
            { label: "Uso de Gerador Redundante Limpo", value: "Biodiesel homologado" },
            { label: "Consumo Hídrico Estimado", value: "8,400 Litros" }
          ],
          conclusions: "Todas as metas do protocolo de boas práticas ESG foram atingidas. O evento operou com consumo elétrico otimizado e compensou integralmente as emissões de transporte de staff através de plantio florestal."
        };
      }

      setGeneratedReport({
        type: selectedReportType,
        compiledAt: compileDate,
        ...content
      });
    }, 1200);
  };

  return (
    <div className={`space-y-6 text-slate-100 ${crisisMode ? 'border-4 border-rose-600 rounded-3xl p-2 animate-pulse-slow' : ''}`} id="noc-360-dashboard-root">
      
      {/* 24/7 HEADER PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="noc-header-container">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                NOC 360° ONLINE
              </span>
              <span className="text-slate-500 text-xs font-mono">OPERANDO 24h / 7d</span>
              {crisisMode && (
                <span className="bg-rose-500 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase animate-bounce flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> SINAL VERMELHO: ESTADO DE CRISE
                </span>
              )}
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
              <Cpu className="h-6 w-6 text-cyan-400" />
              Network & Event Operations Center (NOC)
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl">
              Cérebro operacional unificado da EventFlow Enterprise para {activeEvent?.name || "Eventos Globais"}. Consolidação tática de monitoramento IoT, finanças instantâneas, segurança perimetral, DRE ao vivo e inteligência artificial preditiva.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Clock indicators */}
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-center">
              <div className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Horário Local (UTC-3)</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-cyan-400" />
                {new Date().toLocaleTimeString("pt-BR")}
              </div>
            </div>

            {/* Simulated indicators toggler */}
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
              <span className="text-slate-400 font-mono">Simulador Ativo:</span>
              <button 
                onClick={() => setSimActive(!simActive)}
                className={`px-3 py-1 rounded font-mono font-bold text-[10px] uppercase transition-all ${
                  simActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {simActive ? "Rodando" : "Pausado"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-MODULE HIGH-LEVEL NAVIGATION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3" id="noc-sub-module-navigation">
        {[
          { id: 'panels', label: '11 Painéis', icon: Sliders, desc: 'Indicadores por área' },
          { id: 'ecc_twin', label: 'ECC & Gêmeo', icon: Monitor, desc: 'Comando e Twin 3D' },
          { id: 'iot_obs', label: 'IoT & Telemetria', icon: Cpu, desc: 'Sensores de campo' },
          { id: 'incidents', label: 'Incidentes', icon: ShieldAlert, desc: 'Controle de SLAs', badge: incidents.filter(i => i.status !== 'resolved').length },
          { id: 'automation_crisis', label: 'Sala de Crise', icon: Flame, desc: 'Triggers e Crise' },
          { id: 'ai_agents', label: 'IA Operacional', icon: Sparkles, desc: '8 Agentes de IA' },
          { id: 'audit_dw', label: 'Auditoria & DW', icon: Database, desc: 'Logs contábeis' },
          { id: 'apps_roadmap', label: 'Apps & Futuro', icon: Smartphone, desc: 'Telas e Roadmap' }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as NocModuleTab)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer min-h-[92px] ${
                isActive 
                  ? 'bg-gradient-to-b from-cyan-950/50 to-slate-900 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/5' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-rose-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-bold font-display tracking-tight leading-none">{item.label}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate leading-none">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* CORE WORKSPACE PORT PORTAL */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 min-h-[500px]" id="noc-main-workspace-port">
        
        {/* TAB 1: THE 11 SPECIALIZED INTEGRATED PANELS */}
        {activeModule === 'panels' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header description */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-cyan-400" />
                  Módulos de Gestão Unificada (Consolidação de 11 Painéis Operacionais)
                </h3>
                <p className="text-xs text-slate-400">Rotacione entre as verticais críticas monitoradas de forma contínua pelo NOC da Play+Eventos.</p>
              </div>

              {/* Sub-selector drop tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'executive', label: 'Executivo' },
                  { id: 'operational', label: 'Operacional' },
                  { id: 'finance', label: 'Financeiro' },
                  { id: 'commercial', label: 'Comercial' },
                  { id: 'marketing', label: 'Marketing' },
                  { id: 'sponsorship', label: 'Patrocínios' },
                  { id: 'logistics', label: 'Logística' },
                  { id: 'infrastructure', label: 'Infra' },
                  { id: 'security', label: 'Segurança' },
                  { id: 'medical', label: 'Médico' },
                  { id: 'sports', label: 'Esportes' }
                ].map((panel) => (
                  <button
                    key={panel.id}
                    onClick={() => setSelectedPanel(panel.id as SubPanelId)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedPanel === panel.id 
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {panel.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB-PANEL CONTENT RENDERINGS */}
            <div className="p-2">
              
              {/* PANEL 1.1: EXECUTIVE PANEL */}
              {selectedPanel === 'executive' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Eventos Ativos Hoje</span>
                      <div className="text-2xl font-mono font-bold text-white">01 Ativo</div>
                      <span className="text-[10px] text-emerald-400 block font-mono">✓ Em execução estável</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Eventos Futuros (30d)</span>
                      <div className="text-2xl font-mono font-bold text-white">04 Planejados</div>
                      <span className="text-[10px] text-slate-400 block font-mono">Deles: 2 de grande porte</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Público Total Presente</span>
                      <div className="text-2xl font-mono font-bold text-cyan-400">{telemetry.crowdCount} / {totalSold}</div>
                      <span className="text-[10px] text-slate-400 block font-mono">Check-ins: {Math.round((telemetry.crowdCount / totalSold) * 100)}% das vendas</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Incidentes em Aberto</span>
                      <div className="text-2xl font-mono font-bold text-rose-500">
                        {incidents.filter(i => i.status !== 'resolved').length} Incidentes
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {incidents.filter(i => i.priority === 'critical').length} de prioridade crítica
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-slate-300 block font-display">Resumo de Status dos Sistemas</span>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Portões RFID & Credenciamento</span>
                          <span className="text-emerald-400 font-mono font-bold">100% ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Banco de Dados & Cache</span>
                          <span className="text-emerald-400 font-mono font-bold">99.98% OPERATIONAL</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Roteamento de Link Satélite (Starlink)</span>
                          <span className="text-cyan-400 font-mono font-bold">REDUNDÂNCIA ATIVA</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">API Gateway Transacional</span>
                          <span className="text-emerald-400 font-mono font-bold">LATÊNCIA: {telemetry.apiLatencyMs}ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-300 block font-display">Controles de Alerta Rápidos</span>
                        <p className="text-[11px] text-slate-400 mt-1">Dispare simulações de fluxo diretamente na infraestrutura monitorada pelo NOC:</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleTriggerMockAlert('overcapacity')}
                          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-mono text-[10px] py-2 rounded-lg cursor-pointer"
                        >
                          ⚡ Simular Lotação &gt; 90%
                        </button>
                        <button 
                          onClick={() => handleTriggerMockAlert('generator')}
                          className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-mono text-[10px] py-2 rounded-lg cursor-pointer"
                        >
                          ⚡ Simular Falha de Gerador
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.2: OPERATIONAL PANEL */}
              {selectedPanel === 'operational' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-mono uppercase tracking-widest font-semibold">Log operacional do Staff & Recursos</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/20">SLA Atendimento: 12 min</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Users className="h-4 w-4 text-cyan-400" /> Equipes de Staff
                      </div>
                      <p className="text-slate-400 text-[11px]">32 membros ativos em campo divididos em 4 setores de credenciamento e apoio.</p>
                      <div className="text-[10px] font-mono text-cyan-400">✓ Todos conectados via aplicativo NOC</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Activity className="h-4 w-4 text-purple-400" /> Serviços de Limpeza / Conservação
                      </div>
                      <p className="text-slate-400 text-[11px]">Rondas regulares nos banheiros do pavilhão e praças de alimentação a cada 40 minutos.</p>
                      <div className="text-[10px] font-mono text-purple-400">✓ Nível de asseio estimado: Alto</div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="font-bold text-slate-200 flex items-center gap-1">
                        <Flame className="h-4 w-4 text-rose-400" /> Brigada & Bombeiros Civis
                      </div>
                      <p className="text-slate-400 text-[11px]">12 brigadistas de prontidão distribuídos estrategicamente na arena principal.</p>
                      <div className="text-[10px] font-mono text-emerald-400">✓ Posto médico central abastecido</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.3: FINANCIAL PANEL */}
              {selectedPanel === 'finance' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-sm font-bold text-slate-200 font-display">Fluxo Financeiro em Tempo Real</span>
                    <span className="text-xs font-mono text-emerald-400">Faturamento Conciliado com SAP</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Receita via PIX (Real-Time)</div>
                      <div className="text-lg font-mono font-bold text-emerald-400 mt-1">R$ 412.500</div>
                      <span className="text-[9px] text-slate-500">Conciliação automática instantânea</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Receita via Cartão Crédito</div>
                      <div className="text-lg font-mono font-bold text-emerald-400 mt-1">R$ 312.500</div>
                      <span className="text-[9px] text-slate-500">Gateway Stripe processando a 1.2s</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Cotas de Patrocínios</div>
                      <div className="text-lg font-mono font-bold text-cyan-400 mt-1">R$ 380.000</div>
                      <span className="text-[9px] text-slate-500">4 cotas assinadas e registradas</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Despesas e Custos Gerais</div>
                      <div className="text-lg font-mono font-bold text-rose-400 mt-1">R$ 310.000</div>
                      <span className="text-[9px] text-rose-400">NFe faturadas e homologadas</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-xs">
                    <span className="font-bold text-slate-300 block mb-2 font-mono uppercase text-[10px] tracking-wider">Demonstrativo de Resultado do Exercício Resumido (DRE)</span>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">(+) Receitas de Vendas & Cotas</span>
                        <span className="text-emerald-400 font-bold">R$ {(revenue + 380000).toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">(-) Custos de Cenografia, Infra & Equipes</span>
                        <span className="text-rose-400">R$ {expenses.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400">(-) Impostos Municipais & Fiscais Retidos (NFe)</span>
                        <span className="text-rose-400">R$ 48.000</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-200 font-bold">(=) RESULTADO LÍQUIDO OPERACIONAL</span>
                        <span className="text-emerald-400 font-bold">R$ {(revenue + 380000 - expenses - 48000).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.4: COMMERCIAL PANEL */}
              {selectedPanel === 'commercial' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200 font-display">Análise de Conversão & Vendas Comercial</span>
                    <span className="text-[10px] font-mono text-cyan-400">Ritmo: {simActive ? "4.5 ingressos / min" : "Estável"}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-center">
                      <div className="text-slate-400">Taxa de Conversão</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">24.2%</div>
                      <span className="text-[9px] text-slate-500">Visitas a checkout concluído</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-center">
                      <div className="text-slate-400">Abandono de Carrinho</div>
                      <div className="text-xl font-bold font-mono text-rose-400 mt-1">9.5%</div>
                      <span className="text-[9px] text-emerald-400">✓ Reduzido por disparador SMS</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-center">
                      <div className="text-slate-400">Ticket Médio Geral</div>
                      <div className="text-xl font-bold font-mono text-white mt-1">R$ 210,00</div>
                      <span className="text-[9px] text-slate-500">Gasto médio por cliente</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 text-center">
                      <div className="text-slate-400">Canais de Tráfego Principal</div>
                      <div className="text-xl font-bold font-mono text-cyan-400 mt-1">Instagram Ads</div>
                      <span className="text-[9px] text-slate-500">62% das vendas indiretas</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.5: MARKETING PANEL */}
              {selectedPanel === 'marketing' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Acompanhamento de Campanhas de Marketing</span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1">
                      <div className="text-slate-400 font-semibold">Campanha: 'Último Lote Imperdível'</div>
                      <div className="text-lg font-bold text-cyan-400 font-mono">ROI: 4.8x</div>
                      <p className="text-[11px] text-slate-500">Disparo de e-mail marketing & WhatsApp em massa.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1">
                      <div className="text-slate-400 font-semibold">Conversão WhatsApp Business</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">1,405 Vouchers Enviados</div>
                      <p className="text-[11px] text-slate-500">Notificações transacionais pós-venda.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1">
                      <div className="text-slate-400 font-semibold">Leads Capturados</div>
                      <div className="text-lg font-bold text-white font-mono">3,890 Leads</div>
                      <p className="text-[11px] text-slate-500">Aproveitamento para ações de pós-evento.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.6: SPONSORSHIP PANEL */}
              {selectedPanel === 'sponsorship' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Relatório de Cotas & Entregas de Patrocínio</span>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-200">Cota Platinum: Heineken Brasil S.A.</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Exclusividade de bar de cervejas, logo LED principal, ativação de lounge instagramável.</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/20 font-bold uppercase">100% Homologado</span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">Evidências: 14 Fotos de LED anexas</div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-200">Cota Gold: Coca-Cola FEMSA</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Sinalização de praça de alimentação, painéis do pórtico e copos oficiais ecológicos.</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/20 font-bold uppercase">100% Entregue</span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">ROI Est.: 3.2x sobre visualização</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.7: LOGISTICS PANEL */}
              {selectedPanel === 'logistics' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Painel Logístico, Frota, Hotéis & Alimentação</span>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400 font-semibold">Frota & Rastreamento</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">04 Vans Ativas</div>
                      <p className="text-[10px] text-slate-500 mt-1">GPS tracking integrado na rota de hotéis executivos.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400 font-semibold">Quartos de Hotel Reservados</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">12 Quartos</div>
                      <p className="text-[10px] text-slate-500 mt-1">Palestrantes e diretores alocados no Novotel Centro.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400 font-semibold">Refeições Servidas (Staff)</div>
                      <div className="text-lg font-bold font-mono text-emerald-400 mt-1">68 Refeições</div>
                      <p className="text-[10px] text-slate-500 mt-1">Alimentação balanceada despachada via cozinha de apoio.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400 font-semibold">Estoques de Insumos</div>
                      <div className="text-lg font-bold font-mono text-cyan-400 mt-1">94% Saudável</div>
                      <p className="text-[10px] text-slate-500 mt-1">Pulseiras RFID, crachás e grades em estoque seguro.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.8: INFRASTRUCTURE PANEL */}
              {selectedPanel === 'infrastructure' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Infraestrutura, Som, Painéis de LED & Abastecimento</span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1.5">
                      <div className="font-semibold text-slate-300">Gerador Central de Palco #1</div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Carga Operacional:</span>
                        <span className="text-emerald-400 font-bold">{telemetry.generatorLoad}%</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Temperatura de Trabalho:</span>
                        <span className="text-emerald-400 font-bold">{telemetry.generatorTemp}°C</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1.5">
                      <div className="font-semibold text-slate-300">Conexão Fibra Óptica 1GB</div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Velocidade de Banda:</span>
                        <span className="text-emerald-400 font-bold">{telemetry.wifiSpeedMbps} Mbps</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Ping / Latência Host:</span>
                        <span className="text-cyan-400 font-bold">{telemetry.apiLatencyMs}ms</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-1.5">
                      <div className="font-semibold text-slate-300">Utilidades & Sanitários</div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Nível Caixa d'Água Central:</span>
                        <span className="text-emerald-400 font-bold">{telemetry.waterLevel}%</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span>Sinalizadores Banheiros:</span>
                        <span className="text-cyan-400 font-bold">Fluxo OK</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.9: SECURITY PANEL */}
              {selectedPanel === 'security' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200 font-display">Segurança de Perímetro & Câmeras</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded border border-emerald-500/20">AVCB Homologado</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    <div className="lg:col-span-2 bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2">
                      <span className="font-bold text-slate-300 block">Simulação de Fluxo de Câmeras CCTV (Ao Vivo)</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded text-[10px] font-mono space-y-1 relative">
                          <span className="absolute top-1 right-2 text-rose-500 animate-pulse">● REC</span>
                          <div className="text-slate-400">CAM-01: PÓRTICO ENTRADA</div>
                          <div className="text-slate-500">Fluxo de público moderado. Catracas operando.</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded text-[10px] font-mono space-y-1 relative">
                          <span className="absolute top-1 right-2 text-rose-500 animate-pulse">● REC</span>
                          <div className="text-slate-400">CAM-02: PALCO CENTRAL</div>
                          <div className="text-slate-500">Densidade estável na grade de contenção.</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-300 block">Equipe de Contenção</span>
                        <p className="text-[11px] text-slate-400">48 seguranças civis integrados via rádio de alta frequência. Comunicação direta com comando da PM municipal.</p>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-2">✓ Rotas de fuga sinalizadas</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.10: MEDICAL PANEL */}
              {selectedPanel === 'medical' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Painel Médico, Ocorrências & Ambulâncias</span>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Atendimentos Médicos Totais</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">04 Ocorrências</div>
                      <span className="text-[9px] text-slate-500">Todos estabilizados e liberados</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Ambulâncias de Prontidão</div>
                      <div className="text-lg font-bold font-mono text-emerald-400 mt-1">02 UTIs Móveis</div>
                      <span className="text-[9px] text-emerald-400">✓ Equipes de bordo posicionadas</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Tempo Médio de Atendimento</div>
                      <div className="text-lg font-bold font-mono text-cyan-400 mt-1">4.2 minutos</div>
                      <span className="text-[9px] text-slate-500">Desde o chamado até triagem</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Casos Médicos em Andamento</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">Zero Casos</div>
                      <span className="text-[9px] text-slate-500">Posto médico vazio no momento</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 1.11: SPORTS PANEL */}
              {selectedPanel === 'sports' && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                  <span className="text-sm font-bold text-slate-200 font-display block">Painel de Competição de Eventos Esportivos</span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Atletas Inscritos e Homologados</div>
                      <div className="text-lg font-bold font-mono text-white mt-1">402 Atletas</div>
                      <p className="text-[10px] text-slate-500 mt-1">Chips de telemetria RFID pareados com dorsais.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Líder Geral do Circuito</div>
                      <div className="text-lg font-bold font-mono text-emerald-400 mt-1">Rodrigo Peixoto</div>
                      <p className="text-[10px] text-slate-500 mt-1">Passe pelo checkpoint #3 marcado às 21:42.</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="text-slate-400">Pontos de Hidratação Ativos</div>
                      <div className="text-lg font-bold font-mono text-cyan-400 mt-1">04 Pontos</div>
                      <p className="text-[10px] text-slate-500 mt-1">Água gelada e isotônicos distribuídos no circuito.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: EVENT COMMAND CENTER (ECC), DIGITAL TWIN & GIS */}
        {activeModule === 'ecc_twin' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="ecc-digital-twin-workspace">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-850 pb-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-cyan-400" />
                  Event Command Center (ECC) & Gêmeo Digital (Digital Twin 3D)
                </h3>
                <p className="text-xs text-slate-400">Monitore as estruturas físicas representadas digitalmente e simule visualizações em diferentes telas de Videowall ou celular.</p>
              </div>

              {/* Viewport simulator */}
              <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'videowall', label: 'Videowall', icon: Monitor },
                  { id: 'desktop', label: 'Desktop', icon: Tv },
                  { id: 'tablet', label: 'Tablet', icon: Tablet },
                  { id: 'smartphone', label: 'Smartphone', icon: Smartphone }
                ].map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      onClick={() => setActiveDeviceView(view.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeDeviceView === view.id 
                          ? 'bg-cyan-500 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {view.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Device Frame Simulator Canvas */}
            <div className="flex justify-center items-center bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div 
                className={`transition-all duration-300 w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 relative ${
                  activeDeviceView === 'videowall' ? 'max-w-full min-h-[350px]' :
                  activeDeviceView === 'desktop' ? 'max-w-4xl min-h-[320px]' :
                  activeDeviceView === 'tablet' ? 'max-w-xl min-h-[400px]' :
                  'max-w-[320px] min-h-[450px]'
                }`}
                id="ecc-simulated-screen-frame"
              >
                {/* Floating simulation overlay indicators */}
                <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded">
                    Sincronizado via Websocket 5G
                  </span>
                </div>

                {/* Digital Twin Map Visual */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Esboço Operacional (Gêmeo Digital & GIS)</span>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'crowd', label: 'Densidade' },
                        { id: 'power', label: 'Grade Elétrica' },
                        { id: 'traffic', label: 'Tráfego' }
                      ].map((ovl) => (
                        <button
                          key={ovl.id}
                          onClick={() => setDigitalTwinOverlay(ovl.id as any)}
                          className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${
                            digitalTwinOverlay === ovl.id
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          {ovl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Drawing of the Digital Twin */}
                  <div className="h-52 w-full bg-slate-900/60 rounded-lg border border-slate-850 p-2 relative flex flex-col justify-between">
                    <svg className="absolute inset-0 w-full h-full p-2 select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Arena Boundary */}
                      <rect x="5" y="5" width="90" height="90" rx="3" fill="none" stroke="#1e293b" strokeWidth="2" />
                      
                      {/* Structure 1: Palco Principal */}
                      <rect x="15" y="15" width="25" height="15" rx="1" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1" />
                      <text x="17" y="24" className="text-[4px] font-sans font-bold fill-slate-300">PALCO CENTRAL</text>
                      
                      {/* Structure 2: Praça de Alimentação */}
                      <rect x="55" y="15" width="30" height="20" rx="1" fill="#311042" stroke="#86198f" strokeWidth="1" />
                      <text x="57" y="24" className="text-[4px] font-sans font-bold fill-slate-300">FOOD PARK</text>

                      {/* Structure 3: Estacionamento / Frotas */}
                      <rect x="15" y="65" width="25" height="20" rx="1" fill="#1c1917" stroke="#44403c" strokeWidth="1" strokeDasharray="1" />
                      <text x="17" y="74" className="text-[4px] font-sans font-bold fill-slate-400">ESTACIONAMENTO</text>

                      {/* Structure 4: Pórtico de Credenciamento */}
                      <rect x="55" y="65" width="30" height="15" rx="1" fill="#064e3b" stroke="#059669" strokeWidth="1" />
                      <text x="57" y="74" className="text-[4px] font-sans font-bold fill-slate-300">PÓRTICO DE ACESSO</text>

                      {/* Simulated overlay drawings */}
                      {digitalTwinOverlay === 'crowd' && (
                        <>
                          {/* Heatmap overlay pulses */}
                          <circle cx="27" cy="40" r="10" fill="#f43f5e" fillOpacity="0.2" className="animate-pulse" />
                          <circle cx="27" cy="40" r="4" fill="#ef4444" fillOpacity="0.4" />
                          <circle cx="70" cy="72" r="8" fill="#f43f5e" fillOpacity="0.2" className="animate-pulse" />
                          <circle cx="70" cy="72" r="3" fill="#ef4444" fillOpacity="0.4" />
                        </>
                      )}

                      {digitalTwinOverlay === 'power' && (
                        <>
                          {/* Electrical grid cabling representation */}
                          <path d="M 27 15 L 27 45 L 70 45 L 70 65" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="1.5" className="animate-pulse" />
                          <text x="30" y="44" className="text-[3px] font-mono fill-amber-400">FASE ESTÁVEL 220V</text>
                        </>
                      )}

                      {digitalTwinOverlay === 'traffic' && (
                        <>
                          {/* Fleet coordinates moving dots */}
                          <circle cx="20" cy="80" r="1.5" fill="#38bdf8" className="animate-ping" />
                          <circle cx="30" cy="75" r="1.5" fill="#38bdf8" />
                          <text x="33" y="76" className="text-[3px] font-mono fill-sky-400">VAN-02 EM DESLOCAMENTO</text>
                        </>
                      )}
                    </svg>

                    <div className="flex-1"></div>
                    <div className="bg-slate-950/90 p-2 rounded border border-slate-800 z-10 max-w-sm">
                      <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between gap-4">
                        <span>Pessoas Monitoradas (Catraca): <strong>{telemetry.crowdCount}</strong></span>
                        <span>Coordenadas GPS: <strong>-23.5489, -46.6388</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IOT CENTER & OBSERVABILIDADE */}
        {activeModule === 'iot_obs' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" />
                IoT Telemetry Center & Observabilidade de Performance
              </h3>
              <p className="text-xs text-slate-400">Monitore sinais analógicos enviados diretamente por sensores físicos instalados no pavilhão junto às métricas de banco e API do EventOS.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* IoT Sensors side */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <span className="text-xs font-bold text-slate-200 font-display block">Sinais Analógicos de Sensores de Campo (IoT)</span>
                
                <div className="space-y-3.5">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Sensor de Temperatura Externa</span>
                      <span className="text-white font-bold">{telemetry.generatorTemp - 18}°C</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${((telemetry.generatorTemp - 18)/40)*100}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Consumo de Carga do Subgerador #2</span>
                      <span className="text-white font-bold">{telemetry.generatorLoad}%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${telemetry.generatorLoad}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="text-slate-400">Sensor de Umidade Relativa do Ar</span>
                      <span className="text-white font-bold">64%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full rounded-full" style={{ width: `64%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observability Server Health side */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <span className="text-xs font-bold text-slate-200 font-display block">Performance & Observabilidade de Sistemas</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono">
                    <div className="text-slate-500 text-[10px]">API GATEWAY</div>
                    <div className="text-white font-bold mt-1 text-sm">{telemetry.apiLatencyMs}ms</div>
                    <span className="text-[9px] text-emerald-400">Ping saudável</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono">
                    <div className="text-slate-500 text-[10px]">CPU DATABASE</div>
                    <div className="text-white font-bold mt-1 text-sm">{telemetry.dbCpuLoad}%</div>
                    <span className="text-[9px] text-slate-400">Carga estável</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono">
                    <div className="text-slate-500 text-[10px]">CACHE HIT RATE</div>
                    <div className="text-white font-bold mt-1 text-sm">{telemetry.cacheHitRate}%</div>
                    <span className="text-[9px] text-emerald-400">Redis cache ativo</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono">
                    <div className="text-slate-500 text-[10px]">FILAS DE EMAIL</div>
                    <div className="text-white font-bold mt-1 text-sm">0 pendentes</div>
                    <span className="text-[9px] text-slate-400">RabbitMQ estável</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: INCIDENT CENTER & ALERT CENTER */}
        {activeModule === 'incidents' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-cyan-400" />
                Incident Tracking Center & Gestão de Alertas Críticos
              </h3>
              <p className="text-xs text-slate-400">Monitore incidentes abertos por fiscais em campo, acompanhe SLAs remanescentes e configure planos de ação emergenciais.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Form to submit incident */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 h-fit">
                <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Reportar Incidente no Perímetro</span>
                
                <form onSubmit={handleAddIncident} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400">Título / Ocorrência:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Queda de Wi-Fi no Setor Sul"
                      value={newIncidentTitle}
                      onChange={(e) => setNewIncidentTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400">Setor/Departamento:</label>
                      <select 
                        value={newIncidentDept} 
                        onChange={(e) => setNewIncidentDept(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Segurança">Segurança</option>
                        <option value="Médico">Médico</option>
                        <option value="Infraestrutura">Infraestrutura</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Comercial">Comercial</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400">Gravidade / Prioridade:</label>
                      <select 
                        value={newIncidentPriority} 
                        onChange={(e) => setNewIncidentPriority(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Responsável de Turno:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Fabiana Reis"
                      value={newIncidentResp}
                      onChange={(e) => setNewIncidentResp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Plano de Ação Proposto:</label>
                    <textarea 
                      rows={2}
                      placeholder="Procedimentos emergenciais sugeridos..."
                      value={newIncidentDesc}
                      onChange={(e) => setNewIncidentDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Registrar Incidente
                  </button>
                </form>
              </div>

              {/* Incidents Listing */}
              <div className="xl:col-span-2 space-y-4">
                <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Histórico de Incidentes Operando SLA</span>
                
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-mono">ID: {inc.id}</span>
                            <strong className="text-slate-200 text-sm leading-tight block">{inc.title}</strong>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono">
                              {inc.department}
                            </span>
                            <span>• Resp: <strong>{inc.responsible}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                            inc.priority === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse' :
                            inc.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {inc.priority}
                          </span>

                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                            inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                      </div>

                      {/* Evidence & Action plan */}
                      <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-2">
                        <div className="text-[11px] text-slate-400">
                          <span className="text-cyan-400 font-bold font-mono">EVIDÊNCIA:</span> {inc.evidenceUrl}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          <span className="text-fuchsia-400 font-bold font-mono">PLANO DE AÇÃO:</span> {inc.actionPlan}
                        </div>
                      </div>

                      {inc.status !== 'resolved' && (
                        <div className="flex justify-between items-center border-t border-slate-850 pt-2 text-[11px]">
                          <span className="text-rose-400 font-mono font-bold">
                            ⏱ Tempo Restante de SLA: {inc.remainingMinutes} min (Total: {inc.slaMinutes}m)
                          </span>
                          <button 
                            onClick={() => handleResolveIncident(inc.id)}
                            className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded font-mono font-bold cursor-pointer"
                          >
                            ✓ Marcar como Resolvido
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: MOTOR DE AUTOMAÇÃO & SALA DE CRISE */}
        {activeModule === 'automation_crisis' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Flame className="h-5 w-5 text-cyan-400" />
                Regras Automáticas (Workflow Builder) & Sala de Crise
              </h3>
              <p className="text-xs text-slate-400">Configure automações de regras mestre interligadas ao SAP/ERP ou declare estado de contingência extrema na Sala de Crise.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Automation Rules Builder Side */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Construtor de Triggers Operacionais</span>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-mono px-2 py-0.5 rounded border border-cyan-500/20">Motor Ativo</span>
                </div>

                <form onSubmit={handleAddWorkflow} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block">Nome do Workflow:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Emitir NFe após compra aprovada"
                      value={newWfName}
                      onChange={(e) => setNewWfName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">SE (Trigger):</label>
                      <select 
                        value={newWfTrigger} 
                        onChange={(e) => setNewWfTrigger(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Lotação Geral > 90%">Lotação Geral &gt; 90%</option>
                        <option value="Gerador 2 Desligado">Gerador 2 Desligado</option>
                        <option value="Transação Stripe Confirmada">Transação Stripe Confirmada</option>
                        <option value="Chamado Crítico Aberto > 10min">Chamado Crítico Aberto &gt; 10min</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 block">ENTÃO (Action):</label>
                      <select 
                        value={newWfAction} 
                        onChange={(e) => setNewWfAction(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Acionar Sirene de Campo e Alerta de Fluxo">Acionar Sirene e Alerta de Fluxo</option>
                        <option value="Disparar Webhook SAP ERP para faturamento">Disparar Webhook SAP ERP</option>
                        <option value="Enviar WhatsApp Voucher Alimentação">Enviar WhatsApp Voucher</option>
                        <option value="Notificar Diretor PM por SMS Imediato">Notificar Diretor PM</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Criar Regra de Automação
                  </button>
                </form>

                <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto pr-1">
                  {workflows.map((wf) => (
                    <div key={wf.id} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-200">{wf.name}</strong>
                          <span className="text-[8px] font-mono text-slate-500">Execuções: {wf.hits}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-normal">
                          <span className="text-cyan-400 font-mono font-bold">IF:</span> {wf.trigger}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-normal">
                          <span className="text-fuchsia-400 font-mono font-bold">THEN:</span> {wf.action}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleToggleWorkflow(wf.id)}
                        className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold cursor-pointer transition-all ${
                          wf.active 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {wf.active ? 'Ativo' : 'Pausado'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crisis Room (Sala de Crise) side */}
              <div className="bg-slate-900 border border-rose-900/30 p-5 rounded-xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
                      Sala de Crise Tática Dedicated Area
                    </span>
                    <button 
                      onClick={() => setCrisisMode(!crisisMode)}
                      className={`px-3 py-1 rounded font-mono font-bold text-[9px] uppercase tracking-wider cursor-pointer ${
                        crisisMode 
                          ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-500/20' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {crisisMode ? "DESATIVAR CRISE" : "ATIVAR CRISE"}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    A ativação do Estado de Crise impõe um frame visual vermelho em todos os computadores de comando do NOC, disparando chamadas telefônicas táticas automáticas aos supervisores e autoridades registradas (Polícia Civil, SAMU e Bombeiros).
                  </p>

                  <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[10px] text-rose-400 space-y-1.5 max-h-[140px] overflow-y-auto mt-3">
                    {crisisTimeline.map((item) => (
                      <div key={item.id} className="leading-relaxed border-l border-rose-900 pl-2">
                        <span className="text-slate-500">[{item.time}]</span> <strong>{item.author}:</strong> {item.desc}
                      </div>
                    ))}
                  </div>
                </div>

                {crisisMode && (
                  <form onSubmit={handleAddCrisisLog} className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Log de decisão crítica imediato..."
                        value={crisisLogInput}
                        onChange={(e) => setCrisisLogInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-rose-800 rounded p-2 text-white font-sans text-xs focus:outline-none focus:border-rose-500"
                      />
                      <button 
                        type="submit"
                        className="bg-rose-600 hover:bg-rose-500 text-white px-4 rounded font-mono font-bold text-xs cursor-pointer"
                      >
                        Registrar Decisão
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={handleResolveCrisis}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold py-1.5 rounded text-[11px] cursor-pointer text-center"
                    >
                      Formalmente Encerrar Crise & Registrar Lições Aprendidas
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: IA OPERACIONAL (8 AGENTS) */}
        {activeModule === 'ai_agents' && (
          <div className="space-y-6 animate-in fade-in duration-150" id="cognitive-ai-agents-hub">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                Play+ Cognitive Operacional (8 Agentes de Inteligência)
              </h3>
              <p className="text-xs text-slate-400">Consulte recomendações de nossos algoritmos neurais focados de forma contínua em cada subsetor do evento.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {[
                { id: 'operational', label: 'Operacional' },
                { id: 'financial', label: 'Financeiro' },
                { id: 'commercial', label: 'Comercial' },
                { id: 'security', label: 'Segurança' },
                { id: 'infrastructure', label: 'Infra' },
                { id: 'logistic', label: 'Logístico' },
                { id: 'service', label: 'Atendimento' },
                { id: 'executive', label: 'Executivo' }
              ].map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-mono text-[10px] font-bold uppercase ${
                    selectedAgent === agent.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {agent.label}
                </button>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display text-slate-200">Recomendação Neural do Agente de Turno</h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Contexto de Análise: Evento Corrente</span>
                </div>
              </div>

              {/* Active Agent Recommendation dialog box */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed min-h-[100px] flex items-center">
                {agentDialogs[selectedAgent] || "Análise executando..."}
              </div>

              <div className="bg-slate-950/40 p-3 rounded border border-slate-850 text-center text-[10px] text-slate-500 font-mono">
                ✓ Recomendações atualizadas em tempo real com base em matrizes de dados de telemetria IoT do EventOS.
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DATA WAREHOUSE & AUTOMATED CORPORATE REPORTS */}
        {activeModule === 'audit_dw' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                Data Warehouse Explorer, Logs de Auditoria & Relatórios
              </h3>
              <p className="text-xs text-slate-400">Exporte demonstrativos homologados com órgãos fiscais, consulte o Data Lake e gere relatórios táticos instantaneamente.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Reports form trigger */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 h-fit">
                <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Gerador Automático de Relatórios</span>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400">Tipo de Relatório Demandado:</label>
                    <select 
                      value={selectedReportType} 
                      onChange={(e) => setSelectedReportType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="operational">Relatório Operacional Completo</option>
                      <option value="finance">Relatório Financeiro & DRE</option>
                      <option value="security">Relatório de Segurança & Brigada</option>
                      <option value="esg">Relatório ESG & Boas Práticas</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Compilando Matrizes...
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4" /> Gerar & Homologar Relatório
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Report Display */}
              <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Visualização de Documento Gerado</span>
                  {generatedReport && (
                    <button 
                      onClick={() => {
                        alert("Simulando download de documento homologado Excel/PDF para diretório local!");
                      }}
                      className="text-cyan-400 hover:text-white font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" /> Baixar PDF/Excel
                    </button>
                  )}
                </div>

                {generatedReport ? (
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-4 font-mono leading-relaxed select-all">
                    <div className="border-b border-slate-900 pb-2">
                      <div className="font-bold text-slate-100 text-sm">{generatedReport.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Gerado em: {generatedReport.compiledAt}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-cyan-400 font-bold uppercase text-[10px]">Indicadores Relevantes:</div>
                      <div className="space-y-1 text-[11px]">
                        {generatedReport.indicators.map((ind: any, index: number) => (
                          <div key={index} className="flex justify-between text-slate-300">
                            <span>{ind.label}:</span>
                            <span className="text-slate-100 font-bold">{ind.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      <div className="text-fuchsia-400 font-bold uppercase text-[10px]">Conclusões Táticas:</div>
                      <p className="text-[11px] text-slate-400">{generatedReport.conclusions}</p>
                    </div>

                    <div className="text-center text-[8px] text-slate-600 pt-3 border-t border-slate-900">
                      DOCUMENTO ELETRÔNICO HOMOLOGADO COM ASSINATURA DIGITAL PLAY+EVENTOS S.A.
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                    <FileText className="h-8 w-8 text-slate-600" />
                    <p className="text-xs">Nenhum relatório compilado na sessão atual. Selecione o tipo de relatório e clique em 'Gerar'.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Audit Logs Trail section */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Trilha de Auditoria de Transações & Login</span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {auditTrail.map((trl, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[10px] text-slate-400 flex justify-between items-center gap-4">
                    <div>
                      <span className="text-slate-500">[{trl.time}]</span> <strong className="text-slate-300">{trl.user}</strong>: {trl.action}
                    </div>
                    <span className="bg-slate-900 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-slate-850 shrink-0 uppercase font-bold">
                      {trl.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 8: APLICATIVOS DO NOC & ROADMAP FUTURO */}
        {activeModule === 'apps_roadmap' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-slate-850 pb-4">
              <h3 className="text-base font-bold font-display text-slate-100 flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-cyan-400" />
                Aplicativos Mobile do NOC & Planejamento do Roadmap Futuro
              </h3>
              <p className="text-xs text-slate-400">Verifique os fluxos mobile desenhados para as equipes de campo e explore as próximas inovações de Smart Cities e Visão Computacional.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* NOC Apps Selector / Phone Simulator */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Aplicativo das Equipes de Campo</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'gestor', label: 'Gestor' },
                    { id: 'operador', label: 'Operador NOC' },
                    { id: 'supervisor', label: 'Supervisor' },
                    { id: 'seguranca', label: 'Segurança' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setActiveNocApp(role.id)}
                      className={`py-2 px-3 rounded-lg border font-mono text-[10px] font-bold uppercase cursor-pointer transition-all ${
                        activeNocApp === role.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      App {role.label}
                    </button>
                  ))}
                </div>

                {/* Simulated Phone UI Screen */}
                <div className="bg-slate-950 rounded-2xl border-4 border-slate-800 p-3 h-52 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-1 inset-x-0 flex justify-center">
                    <span className="w-12 h-3 bg-slate-800 rounded-b-xl"></span>
                  </div>

                  <div className="pt-4 flex justify-between items-center text-[8px] font-mono text-slate-500 border-b border-slate-900 pb-1.5">
                    <span>Play+ NOC Mobile</span>
                    <span>100% Sincronizado</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center text-center p-2">
                    {activeNocApp === 'gestor' && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-200">Visão Geral do Gestor</div>
                        <p className="text-[8px] text-slate-400">Público Total: {telemetry.crowdCount} participantes. Sem crises ativas no momento.</p>
                      </div>
                    )}
                    {activeNocApp === 'operador' && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-200">Terminal do Operador NOC</div>
                        <p className="text-[8px] text-slate-400">Monitorando: {workflows.length} regras ativas. Logs carregando a 6s.</p>
                      </div>
                    )}
                    {activeNocApp === 'supervisor' && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-200">Visão do Supervisor</div>
                        <p className="text-[8px] text-slate-400">Checklists de staffs no pavilhão: 92% concluído. Nenhuma pendência urgente.</p>
                      </div>
                    )}
                    {activeNocApp === 'seguranca' && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-200">Segurança de Campo</div>
                        <p className="text-[8px] text-slate-400">Rotas de emergência e portões livres de contenção. Câmeras ativas.</p>
                      </div>
                    )}
                  </div>

                  <div className="text-[8px] font-mono text-center text-slate-500 pt-1 border-t border-slate-900">
                    Criptografia TLS 1.3 ponta a ponta
                  </div>
                </div>
              </div>

              {/* Roadmap future tech side */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <span className="text-xs font-bold text-slate-200 block uppercase font-mono tracking-wider">Roadmap Futuro das Tecnologias de NOC</span>
                
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex items-start gap-3">
                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-400 shrink-0">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block">Fase 5: Visão Computacional de Multidões</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Implantação de rede neural convolucional (CNN) integrada às câmeras CCTV para cálculo de densidade e predição de tumultos sem necessidade de sensores extras.</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex items-start gap-3">
                    <div className="p-1.5 bg-fuchsia-500/10 rounded text-fuchsia-400 shrink-0">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block">Integração Smart Cities & Drones Civis</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Comunicação e tráfego síncronos com a central de monitoramento urbano da prefeitura para roteamento de ambulâncias prioritárias no trânsito urbano.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* QUICK FLOATING LIVE LOGGER TICKER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="noc-live-log-container">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-semibold font-display text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Terminal de Logs de Rede & Eventos do NOC 360° (Ao Vivo)
          </h4>
          <span className="text-[9px] font-mono text-slate-500">Sincronia: Starlink Satélite Redundant Node</span>
        </div>

        <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1" id="noc-live-scrolling-logs">
          {logs.map((log, index) => (
            <div key={index} className="text-xs font-mono border-l-2 border-slate-700 pl-3 py-1 text-slate-400 hover:border-cyan-500 hover:text-slate-200 transition-colors">
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
