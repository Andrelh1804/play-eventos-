import React, { useState } from "react";
import { 
  Building, Users, Award, Shield, FileText, CheckSquare, Download, 
  Check, X, CreditCard, Play, Send, ChevronRight, UserCheck, Calendar, 
  Search, QrCode, Mail, Phone, ExternalLink, Star, FileCheck2, Camera, 
  Video, TrendingUp, Key, MapPin, Map, Wifi, Zap, Lock, Volume2, ShieldAlert
} from "lucide-react";

interface PortalsModuleProps {
  activeEvent: any;
}

type ActivePortal = 'cliente' | 'patrocinador' | 'fornecedor' | 'expositor' | 'imprensa' | 'autoridades';

export default function PortalsModule({ activeEvent }: PortalsModuleProps) {
  const [activePortal, setActivePortal] = useState<ActivePortal>('cliente');

  // --- Portal do Cliente State & Handlers ---
  const [budgets, setBudgets] = useState([
    { id: "b1", title: "Cenografia Completa & Palco Principal", value: 120000, provider: "MaxCenografia S.A.", status: "pending" },
    { id: "b2", title: "Serviço de Buffet Premium (Lounge VIP)", value: 45000, provider: "Gourmet Eventos", status: "pending" },
    { id: "b3", title: "Sonorização & Iluminação de Alta Fidelidade", value: 85000, provider: "LineArray Audio", status: "approved" },
    { id: "b4", title: "Segurança armada e controle de portaria rfid", value: 38000, provider: "Guardians Security", status: "pending" }
  ]);
  const [clientContracts, setClientContracts] = useState([
    { id: "c1", title: "Contrato de Locação do Espaço Central", status: "pending_signature", value: 150000 },
    { id: "c2", title: "Termo de Parceria e Licenciamento PMV", status: "signed", value: 0 }
  ]);
  const [clientChecklists, setClientChecklists] = useState([
    { id: "ck1", text: "Validar planta baixa final e rotas de fuga", completed: true },
    { id: "ck2", text: "Aprovar cardápio final do coffee-break executivo", completed: false },
    { id: "ck3", text: "Homologar cronograma mestre de montagem", completed: false },
    { id: "ck4", text: "Assinar apólice de seguro contra acidentes", completed: true }
  ]);
  const [clientChat, setClientChat] = useState([
    { id: 1, sender: "producer", text: "Olá! Disponibilizei os orçamentos de cenografia e buffet para sua aprovação.", time: "14:15" },
    { id: 2, sender: "client", text: "Excelente, vou analisar a cenografia. O buffet está ótimo.", time: "14:32" }
  ]);
  const [clientNewMsg, setClientNewMsg] = useState("");
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [activeContractToSign, setActiveContractToSign] = useState<any>(null);
  const [signedName, setSignedName] = useState("");

  const handleBudgetAction = (id: string, action: 'approve' | 'reject') => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status: action === 'approve' ? 'approved' : 'rejected' } : b));
  };

  const handleSignContract = (contract: any) => {
    setActiveContractToSign(contract);
    setSignedName(activeEvent?.name ? `CEO da organização contratante` : "Diretor Responsável");
    setSignatureModalOpen(true);
  };

  const executeSignature = () => {
    if (!signedName) return;
    setClientContracts(prev => prev.map(c => c.id === activeContractToSign.id ? { ...c, status: 'signed' } : c));
    setSignatureModalOpen(false);
    setActiveContractToSign(null);
  };

  const toggleClientChecklist = (id: string) => {
    setClientChecklists(prev => prev.map(ck => ck.id === id ? { ...ck, completed: !ck.completed } : ck));
  };

  const sendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNewMsg.trim()) return;
    setClientChat(prev => [...prev, {
      id: Date.now(),
      sender: "client",
      text: clientNewMsg,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }]);
    setClientNewMsg("");
    setTimeout(() => {
      setClientChat(prev => [...prev, {
        id: Date.now() + 1,
        sender: "producer",
        text: "Entendido. Nossa equipe de produção operacional já está ciente e analisará a questão imediatamente.",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      }]);
    }, 1500);
  };

  // --- Portal do Patrocinador State & Handlers ---
  const [sponsorLeads, setSponsorLeads] = useState([
    { id: "l1", name: "Renato Silveira", email: "renato@techcorp.com", company: "TechCorp Brasil", phone: "(11) 98888-2321", timestamp: "2026-08-01 19:30" },
    { id: "l2", name: "Amanda Melo", email: "amanda.m@innovations.io", company: "Innovations Inc", phone: "(21) 97111-4545", timestamp: "2026-08-01 19:45" },
    { id: "l3", name: "Claudio Faria", email: "claudio@finances.com.br", company: "Alfa Investimentos", phone: "(11) 91234-5678", timestamp: "2026-08-01 20:02" }
  ]);
  const [activationDeliveries, setActivationDeliveries] = useState([
    { id: "d1", title: "Inserção do Logo no Painel de LED Central", type: "Visual", progress: 100, status: "completed", evidence: "painel_led_logo.jpg" },
    { id: "d2", title: "Distribuição de Brinde Personalizado na Sacola Kit", type: "Físico", progress: 100, status: "completed", evidence: "foto_brinde_bag.jpg" },
    { id: "d3", title: "Espaço de Arena de ativação (Stand 20m²)", type: "Espaço", progress: 75, status: "pending", evidence: "" },
    { id: "d4", title: "Disparo de E-mail Marketing dedicado pós-evento", type: "Digital", progress: 0, status: "pending", evidence: "" }
  ]);

  // --- Portal do Fornecedor State & Handlers ---
  const [supplierQuotes, setSupplierQuotes] = useState([
    { id: "q1", service: "Locação de Banheiros Químicos de Luxo (x15)", budgetRequested: 22000, deadline: "2026-08-14", status: "pending" },
    { id: "q2", service: "Suporte Técnico de Redes Wi-Fi Gigabit", budgetRequested: 18000, deadline: "2026-08-20", status: "sent" }
  ]);
  const [supplierStock, setSupplierStock] = useState([
    { id: "s1", item: "Grade de Contenção Alumínio (metros)", available: 450, total: 500 },
    { id: "s2", item: "Roteadores Wi-Fi Tri-Band Corporativos", available: 12, total: 20 },
    { id: "s3", item: "Painel de LED P3 (m²)", available: 60, total: 80 }
  ]);

  const [bidValue, setBidValue] = useState("");
  const [selectedQuoteForBid, setSelectedQuoteForBid] = useState<string | null>(null);

  const handleSendBid = (id: string) => {
    if (!bidValue) return;
    setSupplierQuotes(prev => prev.map(q => q.id === id ? { ...q, status: "sent", budgetRequested: Number(bidValue) } : q));
    setSelectedQuoteForBid(null);
    setBidValue("");
  };

  // --- Portal do Expositor State & Handlers ---
  const [exhibitorStands, setExhibitorStands] = useState([
    { id: "A1", area: "16m²", type: "Premium Ilha", price: 15000, reserved: true, company: "TechCorp Brasil", utilities: { energy: "10kW", wifi: "50mbps" } },
    { id: "A2", area: "16m²", type: "Premium Ilha", price: 15000, reserved: false, company: "", utilities: { energy: "5kW", wifi: "20mbps" } },
    { id: "B1", area: "12m²", type: "Esquina", price: 10000, reserved: true, company: "Alfa Investimentos", utilities: { energy: "5kW", wifi: "20mbps" } },
    { id: "B2", area: "12m²", type: "Esquina", price: 10000, reserved: false, company: "", utilities: { energy: "5kW", wifi: "10mbps" } },
    { id: "C1", area: "9m²", type: "Padrão", price: 7500, reserved: false, company: "", utilities: { energy: "3kW", wifi: "10mbps" } },
    { id: "C2", area: "9m²", type: "Padrão", price: 7500, reserved: true, company: "Innovations Inc", utilities: { energy: "3kW", wifi: "10mbps" } }
  ]);
  const [standToReserve, setStandToReserve] = useState<string | null>(null);
  const [reserveCompanyName, setReserveCompanyName] = useState("");
  const [selectedEnergy, setSelectedEnergy] = useState("5kW");
  const [selectedWifi, setSelectedWifi] = useState("20mbps");

  const handleReserveStand = () => {
    if (!standToReserve || !reserveCompanyName) return;
    setExhibitorStands(prev => prev.map(s => s.id === standToReserve ? {
      ...s,
      reserved: true,
      company: reserveCompanyName,
      utilities: { energy: selectedEnergy, wifi: selectedWifi }
    } : s));
    setStandToReserve(null);
    setReserveCompanyName("");
  };

  // --- Portal da Imprensa State & Handlers ---
  const [pressCredentials, setPressCredentials] = useState([
    { id: "p1", reporter: "Juliana Ribeiro", media: "Portal G1 / Globo", email: "juliana.ribeiro@g1.com", status: "pending" },
    { id: "p2", reporter: "Marcos Pontes", media: "Jornal O Estado", email: "marcos@estadao.com", status: "approved" },
    { id: "p3", reporter: "Beatriz Lins", media: "TechNews Brasil", email: "beatriz@technews.com.br", status: "approved" }
  ]);
  const [interviewsSchedule, setInterviewsSchedule] = useState([
    { id: "i1", speaker: "Dr. André Luis (CEO Play+)", time: "14:30 - 15:00", location: "Sala de Imprensa Principal", status: "confirmed" },
    { id: "i2", speaker: "Secretário de Estado de Desenvolvimento", time: "16:00 - 16:30", location: "Lounge de Autoridades", status: "pending" }
  ]);

  const handleCredentialStatus = (id: string, status: 'approved' | 'rejected') => {
    setPressCredentials(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  // --- Portal das Autoridades State & Handlers ---
  const [vipProtocols, setVipProtocols] = useState([
    { id: "vp1", authority: "Governador do Estado", level: "Segurança Máxima", escolta: "4 Batedores PM", arrival: "09:45", assignedLounge: "Lounge VVIP 1", status: "confirmed" },
    { id: "vp2", authority: "Prefeito de São Paulo", level: "Segurança Elevada", escolta: "2 Agentes GCM", arrival: "10:15", assignedLounge: "Lounge VIP A", status: "confirmed" },
    { id: "vp3", authority: "Consul Geral da Alemanha", level: "Segurança Padrão", escolta: "Nenhuma", arrival: "11:00", assignedLounge: "Lounge VIP B", status: "pending" }
  ]);

  const [newAuthority, setNewAuthority] = useState("");
  const [newArrival, setNewArrival] = useState("");
  const [newLevel, setNewLevel] = useState("Segurança Elevada");

  const handleAddAuthority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthority || !newArrival) return;
    setVipProtocols(prev => [...prev, {
      id: `vp-${Date.now()}`,
      authority: newAuthority,
      level: newLevel,
      escolta: newLevel === "Segurança Máxima" ? "4 Batedores PM" : newLevel === "Segurança Elevada" ? "2 Agentes GCM" : "Nenhuma",
      arrival: newArrival,
      assignedLounge: "Lounge VIP A",
      status: "pending"
    }]);
    setNewAuthority("");
    setNewArrival("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="portals-fase4-root">
      
      {/* Portals Sub-Header with Icon Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase">MÓDULO INTEGRADO</span>
          <h3 className="text-base font-bold font-display text-slate-100 mt-1">Ecossistema de Portais de Stakeholders (Fase 4)</h3>
          <p className="text-xs text-slate-400">Ambiente unificado para clientes, patrocinadores, fornecedores, expositores, imprensa e autoridades de segurança.</p>
        </div>

        {/* Real-time Status Tracker badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">Portais SaaS Ativos</span>
        </div>
      </div>

      {/* Grid of Buttons - Portal Selector */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {[
          { id: 'cliente', label: 'Cliente (Contratante)', icon: UserCheck, color: 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20' },
          { id: 'patrocinador', label: 'Patrocinador', icon: Award, color: 'border-amber-500/30 text-amber-400 hover:bg-amber-950/20' },
          { id: 'fornecedor', label: 'Fornecedor', icon: Building, color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/20' },
          { id: 'expositor', label: 'Expositor (Estandes)', icon: Map, color: 'border-purple-500/30 text-purple-400 hover:bg-purple-950/20' },
          { id: 'imprensa', label: 'Imprensa / Press', icon: Volume2, color: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-950/20' },
          { id: 'autoridades', label: 'VVIP / Autoridades', icon: ShieldAlert, color: 'border-rose-500/30 text-rose-400 hover:bg-rose-950/20' }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activePortal === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePortal(item.id as ActivePortal)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border font-bold text-center gap-2 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-950 border-slate-700 text-white shadow-md' 
                  : `bg-slate-950/40 border-slate-900 text-slate-400 ${item.color}`
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-sans leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE PORTAL DETAILS */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 min-h-[400px]">

        {/* 1. PORTAL DO CLIENTE */}
        {activePortal === 'cliente' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                  Portal do Cliente Contratante (Visão do Dono)
                </h4>
                <p className="text-xs text-slate-400">Acompanhamento executivo irrestrito de contratos, orçamentos e cronogramas operacionais.</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-mono text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  Relatório Consolidado PDF
                </button>
              </div>
            </div>

            {/* Content Split: Left list budgets and contracts, Right checklists and chat */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                {/* Budgets Section */}
                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Aprovação de Orçamentos e Custos</span>
                  <div className="space-y-2">
                    {budgets.map((b) => (
                      <div key={b.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{b.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Fornecedor: {b.provider} • R$ {b.value.toLocaleString("pt-BR")}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleBudgetAction(b.id, 'approve')}
                                className="bg-emerald-950/50 border border-emerald-800/30 hover:bg-emerald-900/40 text-emerald-400 p-1 rounded cursor-pointer"
                                title="Aprovar Custo"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleBudgetAction(b.id, 'reject')}
                                className="bg-rose-950/50 border border-rose-800/30 hover:bg-rose-900/40 text-rose-400 p-1 rounded cursor-pointer"
                                title="Recusar Custo"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                              b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {b.status === 'approved' ? 'Aprovado' : 'Recusado'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contracts Section */}
                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Assinatura Digital de Contratos</span>
                  <div className="space-y-2">
                    {clientContracts.map((c) => (
                      <div key={c.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{c.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Valor: R$ {c.value.toLocaleString("pt-BR")}</div>
                        </div>
                        <div>
                          {c.status === 'pending_signature' ? (
                            <button 
                              onClick={() => handleSignContract(c)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[10px] px-2.5 py-1 rounded font-bold cursor-pointer flex items-center gap-1"
                            >
                              <FileCheck2 className="h-3 w-3" /> Assinar Docusign
                            </button>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                              <Check className="h-3 w-3" /> Assinado ICP
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Client Checklists */}
                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Checklists do Contratante</span>
                  <div className="space-y-2">
                    {clientChecklists.map((ck) => (
                      <label 
                        key={ck.id} 
                        className="flex items-center gap-2.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer text-xs"
                      >
                        <input 
                          type="checkbox" 
                          checked={ck.completed} 
                          onChange={() => toggleClientChecklist(ck.id)}
                          className="rounded border-slate-800 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-950" 
                        />
                        <span className={`text-slate-300 ${ck.completed ? 'line-through text-slate-500' : ''}`}>{ck.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Direct chat with production */}
                <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Canal Direto com a Produção</span>
                  <div className="bg-slate-950 border border-slate-850 rounded-lg p-3 space-y-3 h-[180px] overflow-y-auto flex flex-col justify-end text-xs">
                    {clientChat.map((msg: any) => {
                      const isClient = msg.sender === 'client';
                      return (
                        <div key={msg.id} className={`max-w-[80%] p-2 rounded-lg ${isClient ? 'bg-cyan-950/60 border border-cyan-800/30 text-cyan-100 self-end' : 'bg-slate-900 border border-slate-800 text-slate-300 self-start'}`}>
                          <p className="font-sans">{msg.text}</p>
                          <span className="text-[8px] text-slate-500 font-mono block text-right mt-1">{msg.time}</span>
                        </div>
                      );
                    })}
                  </div>
                  <form onSubmit={sendClientMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Fale com o produtor geral do evento..."
                      value={clientNewMsg}
                      onChange={(e) => setClientNewMsg(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg cursor-pointer">
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PORTAL DO PATROCINADOR */}
        {activePortal === 'patrocinador' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Award className="h-4 w-4 text-amber-400" />
                  Portal Exclusivo do Patrocinador (Cota Platinum)
                </h4>
                <p className="text-xs text-slate-400">Verifique seu Retorno sobre o Investimento (ROI), leads qualificados e plano de ativação física/digital.</p>
              </div>
              <div className="flex gap-2 text-xs font-mono">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-bold uppercase">Patrocínio Platinum Ativo</span>
              </div>
            </div>

            {/* Dashboard grid metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Leads Qualificados Captados</span>
                <div className="text-2xl font-mono font-bold text-amber-400">{sponsorLeads.length} leads</div>
                <p className="text-[10px] text-slate-400">Capturados via scanner de QR Code no stand corporativo.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">ROI Estimado do Patrocínio</span>
                <div className="text-2xl font-mono font-bold text-emerald-400">3.4x ROI</div>
                <p className="text-[10px] text-slate-400">Valor de exposição de mídia estimado sobre o custo de cota.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Ativações Concluídas</span>
                <div className="text-2xl font-mono font-bold text-indigo-400">50% completado</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 border border-slate-850">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>

            {/* Leads Table & Activations Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Captured Leads Table */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Leads B2B Captados em Tempo Real
                  </span>
                  <button className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer">Exportar XLS</button>
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1">
                  {sponsorLeads.map((lead) => (
                    <div key={lead.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{lead.name}</div>
                        <div className="text-[10px] text-slate-400">{lead.role} • {lead.company}</div>
                      </div>
                      <div className="text-right font-mono text-[9px] text-slate-500 space-y-0.5">
                        <div>{lead.email}</div>
                        <div>{lead.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ativação deliveries tracking */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Cronograma de Ativações e Provas</span>
                <div className="space-y-2">
                  {activationDeliveries.map((d) => (
                    <div key={d.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs gap-3">
                      <div>
                        <div className="font-bold text-slate-300">{d.title}</div>
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5">Tipo: {d.type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.status === 'completed' ? (
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                            <Camera className="h-3 w-3" /> Evidenciado
                          </span>
                        ) : (
                          <span className="bg-slate-900 text-slate-500 border border-slate-800 px-2 py-0.5 rounded font-mono text-[9px]">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. PORTAL DO FORNECEDOR */}
        {activePortal === 'fornecedor' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Building className="h-4 w-4 text-emerald-400" />
                  Portal do Fornecedor Homologado
                </h4>
                <p className="text-xs text-slate-400">Gerencie suas certificações documentais, receba RFQs (solicitações de orçamento) e controle seu estoque.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-mono text-xs">
                <Star className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                Rating: 4.9/5.0
              </div>
            </div>

            {/* Quote RFQ and Stock Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* RFQ requests */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">RFQs Ativas (Solicitações de Orçamentos)</span>
                <div className="space-y-3">
                  {supplierQuotes.map((q) => (
                    <div key={q.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-200">{q.service}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Prazo de Resposta: {q.deadline}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                          q.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {q.status === 'sent' ? 'Proposta Enviada' : 'Aguardando Proposta'}
                        </span>
                      </div>

                      {selectedQuoteForBid === q.id ? (
                        <div className="flex gap-2 pt-2 border-t border-slate-900">
                          <input 
                            type="number" 
                            placeholder="Valor da proposta (R$)..."
                            value={bidValue}
                            onChange={(e) => setBidValue(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-mono"
                          />
                          <button 
                            onClick={() => handleSendBid(q.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold px-3 py-1 rounded text-[11px] cursor-pointer"
                          >
                            Enviar
                          </button>
                        </div>
                      ) : (
                        q.status !== 'sent' && (
                          <div className="flex justify-end pt-1">
                            <button 
                              onClick={() => setSelectedQuoteForBid(q.id)}
                              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-cyan-400 font-mono font-bold text-[10px] px-2.5 py-1 rounded cursor-pointer"
                            >
                              Responder RFQ
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock and certifications */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Estoque Alocado para Play+Eventos</span>
                  <div className="space-y-2">
                    {supplierStock.map((s) => (
                      <div key={s.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span className="font-bold">{s.item}</span>
                          <span className="font-mono">{s.available} / {s.total} unid.</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(s.available / s.total) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-950/15 border border-emerald-800/20 p-3 rounded-lg text-xs space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" />
                    Status de Certificações do Fornecedor
                  </span>
                  <p className="text-[11px] text-slate-300">Todas as certidões negativas tributárias federais e licenças operacionais de vigilância sanitária estão homologadas até <strong>2026-12-31</strong>.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. PORTAL DO EXPOSITOR */}
        {activePortal === 'expositor' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Map className="h-4 w-4 text-purple-400" />
                  Portal do Expositor (Planta de Estandes & Serviços)
                </h4>
                <p className="text-xs text-slate-400">Consulte o mapa do pavilhão de exposições em tempo real, reserve seu stand e contrate energia ou Wi-Fi dedicado.</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded font-mono text-xs font-bold uppercase">Planta Interativa do Pavilhão</span>
              </div>
            </div>

            {/* Stand layout visualization and Reserve Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Floor Plan grid mapping */}
              <div className="lg:col-span-2 bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Layout de Stands do Pavilhão</span>
                
                <div className="grid grid-cols-3 gap-3">
                  {exhibitorStands.map((stand) => (
                    <button
                      key={stand.id}
                      onClick={() => !stand.reserved && setStandToReserve(stand.id)}
                      disabled={stand.reserved}
                      className={`p-4 rounded-xl border flex flex-col justify-between text-left h-[100px] transition-all cursor-pointer ${
                        stand.reserved 
                          ? 'bg-slate-950 border-slate-800/80 text-slate-500 opacity-60' 
                          : 'bg-purple-950/15 border-purple-500/20 hover:border-purple-400 text-purple-300 hover:bg-purple-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full font-mono text-xs font-bold">
                        <span>Stand {stand.id}</span>
                        <span className="text-[9px] uppercase">{stand.type}</span>
                      </div>
                      <div className="text-[10px]">
                        {stand.reserved ? (
                          <div className="space-y-0.5">
                            <span className="font-sans text-slate-300 font-bold block truncate">{stand.company}</span>
                            <span className="font-mono text-[9px] text-slate-500 block">{stand.utilities.energy} • {stand.utilities.wifi}</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="font-mono block">Área: {stand.area}</span>
                            <span className="font-mono text-emerald-400 font-bold block">R$ {stand.price.toLocaleString("pt-BR")}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reservation Panel */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Reservar Novo Estande</span>
                
                {standToReserve ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="p-2.5 bg-slate-950 border border-purple-500/20 rounded text-purple-400 font-mono font-bold text-center">
                      STAND SELECIONADO: {standToReserve}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-slate-400 block">Nome da Empresa Expositora:</label>
                      <input 
                        type="text" 
                        placeholder="Ex: TechCorp LTDA"
                        value={reserveCompanyName}
                        onChange={(e) => setReserveCompanyName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 block">Carga Elétrica:</label>
                        <select 
                          value={selectedEnergy} 
                          onChange={(e) => setSelectedEnergy(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                        >
                          <option value="3kW">3kW (Luzes/Tv)</option>
                          <option value="5kW">5kW (Padrão)</option>
                          <option value="10kW">10kW (Maquinaria)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 block">Wi-Fi Dedicado:</label>
                        <select 
                          value={selectedWifi} 
                          onChange={(e) => setSelectedWifi(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                        >
                          <option value="10mbps">10 mbps</option>
                          <option value="20mbps">20 mbps</option>
                          <option value="50mbps">50 mbps (Premium)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={() => setStandToReserve(null)}
                        className="flex-1 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 p-2 rounded text-[11px] font-mono cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleReserveStand}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded text-[11px] font-mono font-bold cursor-pointer"
                      >
                        Aprovar Reserva
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 font-mono text-[11px]">
                    <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-bounce" />
                    Selecione um stand disponível no mapa à esquerda para prosseguir com a reserva contratual.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. PORTAL DA IMPRENSA */}
        {activePortal === 'imprensa' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Volume2 className="h-4 w-4 text-indigo-400" />
                  Sala de Imprensa & Press Kits (Media Room)
                </h4>
                <p className="text-xs text-slate-400">Credencie jornalistas, acesse fotos em alta resolução, vídeos de divulgação institucional e releases oficiais.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert("Copiado press release oficial para a área de transferência!")}
                  className="bg-indigo-950 border border-indigo-800/30 hover:bg-indigo-900/40 text-indigo-400 font-mono text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" /> Copiar Press Release
                </button>
              </div>
            </div>

            {/* Journalists & Press Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Accreditation requests list */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Lista de Credenciamento de Imprensa</span>
                
                <div className="space-y-2">
                  {pressCredentials.map((c) => (
                    <div key={c.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{c.reporter}</div>
                        <div className="text-[10px] text-slate-400">{c.media} • {c.email}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleCredentialStatus(c.id, 'approved')}
                              className="bg-emerald-950 text-emerald-400 border border-emerald-800/30 p-1 rounded hover:bg-emerald-900 cursor-pointer"
                              title="Aprovar Credencial"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleCredentialStatus(c.id, 'rejected')}
                              className="bg-rose-950 text-rose-400 border border-rose-800/30 p-1 rounded hover:bg-rose-900 cursor-pointer"
                              title="Rejeitar"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                            c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {c.status === 'approved' ? 'Credenciado' : 'Recusado'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Press kit digital asset files */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Downloads de Material Oficial (HD)</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-indigo-400" />
                        <div>
                          <div className="font-bold text-slate-200">Fotos do Local</div>
                          <span className="text-[9px] font-mono text-slate-500">ZIP • 42 MB</span>
                        </div>
                      </div>
                      <button className="text-indigo-400 hover:text-white cursor-pointer"><Download className="h-4 w-4" /></button>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-indigo-400" />
                        <div>
                          <div className="font-bold text-slate-200">Vídeo Teaser</div>
                          <span className="text-[9px] font-mono text-slate-500">MP4 • 115 MB</span>
                        </div>
                      </div>
                      <button className="text-indigo-400 hover:text-white cursor-pointer"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>

                {/* Press Interview Conference */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Agenda de Coletivas e Entrevistas</span>
                  <div className="space-y-2">
                    {interviewsSchedule.map((i) => (
                      <div key={i.id} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-300">Porta-voz: {i.speaker}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">Local: {i.location} • Horário: {i.time}</div>
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                          i.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          {i.status === 'confirmed' ? 'Confirmado' : 'Aguardando'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 6. PORTAL DAS AUTORIDADES */}
        {activePortal === 'autoridades' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  Portal das Autoridades de Segurança e Protocolo VVIP
                </h4>
                <p className="text-xs text-slate-400">Roteamento de batedores de trânsito, escolta armada de dignitaries, credenciamento policial e horários de entrada cerimoniais.</p>
              </div>
              <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-800/30 px-3 py-1.5 rounded-xl text-xs font-mono text-rose-400">
                <Lock className="h-3.5 w-3.5" />
                Acesso Altamente Restrito (COE)
              </div>
            </div>

            {/* VVIP Security list and Arrival Dispatch Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Protocol Details Table */}
              <div className="lg:col-span-2 bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Protocolos de Escolta e Entrada Ativos</span>
                
                <div className="space-y-2">
                  {vipProtocols.map((p) => (
                    <div key={p.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{p.authority}</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase ${
                            p.level === 'Segurança Máxima' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}>
                            {p.level}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">
                          Escolta: {p.escolta} • Lounge: {p.assignedLounge}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-300">Chegada: {p.arrival}</div>
                        <span className={`text-[8px] font-mono uppercase font-bold px-1 py-0.5 rounded ${
                          p.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {p.status === 'confirmed' ? 'No Local' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authority registration form */}
              <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Registrar Visita Oficial Cerimonial</span>
                
                <form onSubmit={handleAddAuthority} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block">Autoridade Dignitária:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Embaixador da Itália"
                      value={newAuthority}
                      onChange={(e) => setNewAuthority(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">Horário Chegada:</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 11:30"
                        value={newArrival}
                        onChange={(e) => setNewArrival(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 block">Nível Segurança:</label>
                      <select 
                        value={newLevel} 
                        onChange={(e) => setNewLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Segurança Máxima">Máxima (PM)</option>
                        <option value="Segurança Elevada">Elevada (GCM)</option>
                        <option value="Segurança Padrão">Padrão</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold p-2 rounded cursor-pointer"
                  >
                    Homologar Protocolo
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ELECTRONIC SIGNATURE MODAL */}
      {signatureModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Assinador Digital ICP-Brasil</span>
                <h4 className="text-sm font-bold text-slate-100 font-display">Assinar {activeContractToSign?.title}</h4>
              </div>
              <button 
                onClick={() => { setSignatureModalOpen(false); setActiveContractToSign(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Você está utilizando um certificado criptografado padrão **SHA-256** integrado ao ecossistema da **Play+Eventos**. Esta assinatura digital possui validade jurídica equivalente à manuscrita.
              </p>
              <div className="bg-slate-950 p-3 rounded border border-slate-850 font-mono text-[10px] text-slate-500">
                HASH INTEGRIDADE: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 block">Confirme seu nome completo para assinar:</label>
              <input 
                type="text" 
                value={signedName}
                onChange={(e) => setSignedName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="border border-slate-800 bg-slate-950 rounded-lg p-4 text-center h-[100px] flex items-center justify-center border-dashed">
              {signedName ? (
                <span className="font-mono text-slate-400 italic text-sm select-none border-b border-slate-800 px-4 py-1">{signedName}</span>
              ) : (
                <span className="text-[10px] text-slate-600 font-mono">Assinatura Digital Padronizada</span>
              )}
            </div>

            <button 
              onClick={executeSignature}
              disabled={!signedName}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Assinar com Criptografia SHA-256
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
