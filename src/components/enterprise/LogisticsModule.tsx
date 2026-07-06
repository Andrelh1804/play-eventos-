import React, { useState } from "react";
import { 
  ShieldCheck, FileText, RefreshCw, Landmark, HelpCircle, User, 
  Trash2, Plus, Calendar, Clock, MapPin, Truck, ChevronRight, Utensils, 
  Award, QrCode, Search, ThumbsUp, Star, BarChart, HardHat, FileCheck, Hotel
} from "lucide-react";

interface LogisticsModuleProps {
  activeEvent: any;
}

type ActiveSection = 'licencas' | 'cerimonial' | 'hospedagem' | 'transporte' | 'alimentacao' | 'premiacoes' | 'networking' | 'pesquisas';

export default function LogisticsModule({ activeEvent }: LogisticsModuleProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('licencas');

  // --- 1. Licenças State ---
  const [licenses, setLicenses] = useState([
    { id: "lic-1", name: "Alvará de Autorização da Prefeitura", agency: "Secretaria de Urbanismo", status: "approved", expiry: "2026-10-30", premiumCost: 5400 },
    { id: "lic-2", name: "Auto de Vistoria do Corpo de Bombeiros (AVCB)", agency: "Corpo de Bombeiros Militar", status: "pending", expiry: "2026-08-15", premiumCost: 3200 },
    { id: "lic-3", name: "Licença Sanitária de Alimentos", agency: "Vigilância Sanitária", status: "approved", expiry: "2026-09-22", premiumCost: 1500 },
    { id: "lic-4", name: "ART (Anotação de Responsabilidade Técnica) Montagem", agency: "CREA-SP", status: "approved", expiry: "2026-08-30", premiumCost: 950 },
    { id: "lic-5", name: "Direitos Autorais Musicais (ECAD)", agency: "ECAD Regional", status: "expired", expiry: "2026-07-01", premiumCost: 18200 },
    { id: "lic-6", name: "Seguro de Responsabilidade Civil Eventos", agency: "Porto Seguro S.A.", status: "approved", expiry: "2026-11-15", premiumCost: 12500 }
  ]);

  const handleRenewLicense = (id: string) => {
    setLicenses(prev => prev.map(lic => lic.id === id ? { 
      ...lic, 
      status: "approved", 
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    } : lic));
  };

  // --- 2. Cerimonial State ---
  const [mcPrompterText, setMcPrompterText] = useState(
    "Senhoras e senhores, boa noite! Damos início neste momento à solenidade de abertura do grande fórum corporativo. Gostaríamos de convidar para compor o dispositivo de honra da mesa oficial: em primeiro lugar, o Excelentíssimo Senhor André Luis, CEO da Play+ Holding Brasil, seguido do Governador do Estado..."
  );
  const [mcSpeed, setMcSpeed] = useState(25); // wpm slider
  const [ceremonialPrecedence, setCeremonialPrecedence] = useState([
    { id: "p1", name: "Secretário de Estado de Desenvolvimento", role: "Representante do Governo", order: 1, speechTimeLimit: "5 min" },
    { id: "p2", name: "Dr. André Luis (CEO Play+)", role: "Anfitrião Corporativo", order: 2, speechTimeLimit: "8 min" },
    { id: "p3", name: "Presidente da Câmara Legislativa Municipal", role: "Autoridade Local", order: 3, speechTimeLimit: "3 min" },
    { id: "p4", name: "Diretora da Federação das Indústrias (FIESP)", role: "Convidada de Honra", order: 4, speechTimeLimit: "4 min" }
  ]);

  // --- 3. Hospedagem (Rooming List) State ---
  const [roomingList, setRoomingList] = useState([
    { id: "r-1", guest: "Dra. Elenice Fagundes", hotel: "Copacabana Palace S.A.", roomType: "Suíte Luxo de Frente", checkIn: "2026-08-25", checkOut: "2026-08-28", cost: 4500, paid: true },
    { id: "r-2", guest: "Jean-Pierre Laurent", hotel: "Meliá Paulista Executive", roomType: "Quarto King Executivo", checkIn: "2026-08-24", checkOut: "2026-08-28", cost: 2800, paid: false },
    { id: "r-3", guest: "Marcus Vinícius (Palestrante Master)", hotel: "Meliá Paulista Executive", roomType: "Quarto King Executivo", checkIn: "2026-08-25", checkOut: "2026-08-27", cost: 1400, paid: true }
  ]);
  const [newGuest, setNewGuest] = useState("");
  const [newHotel, setNewHotel] = useState("Meliá Paulista Executive");
  const [newRoomType, setNewRoomType] = useState("Quarto King Executivo");
  const [newCost, setNewCost] = useState("");

  const handleAddRooming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest) return;
    setRoomingList(prev => [...prev, {
      id: `r-${Date.now()}`,
      guest: newGuest,
      hotel: newHotel,
      roomType: newRoomType,
      checkIn: "2026-08-25",
      checkOut: "2026-08-28",
      cost: Number(newCost) || 1200,
      paid: false
    }]);
    setNewGuest("");
    setNewCost("");
  };

  const handleTogglePaidRoom = (id: string) => {
    setRoomingList(prev => prev.map(r => r.id === id ? { ...r, paid: !r.paid } : r));
  };

  const handleDeleteRoom = (id: string) => {
    setRoomingList(prev => prev.filter(r => r.id !== id));
  };

  // --- 4. Transporte State ---
  const [transportFleet, setTransportFleet] = useState([
    { id: "f1", vehicle: "Van Executiva Mercedes Sprinter", driver: "Adilson Souza", route: "Aeroporto de Congonhas ⇆ Hotel Meliá", currentTask: "Aguardando Voo LA8112", status: "en_route", fuel: "75%" },
    { id: "f2", vehicle: "Sedan Blindado Toyota Corolla", driver: "Carlos Nobre", route: "Hotel Meliá ⇆ Arena do Evento", currentTask: "Em trânsito com VVIP Secretário", status: "en_route", fuel: "90%" },
    { id: "f3", vehicle: "Micro-ônibus Escolar Executivo", driver: "Mariano Silva", route: "Hotel Ibis Budget ⇆ Arena Staff", currentTask: "Aguardando embarque de 24 staffs", status: "idle", fuel: "55%" }
  ]);

  // --- 5. Alimentação (Catering) State ---
  const [cateringSchedules, setCateringSchedules] = useState([
    { id: "cat1", title: "Coffee Break de Abertura Executiva", type: "Coffee-Break", targetPax: 450, costPerPax: 32, totalSpent: 14400, status: "completed", complianceOk: true },
    { id: "cat2", title: "Catering do Almoço Executivo VIP", type: "Buffet Premium", targetPax: 150, costPerPax: 85, totalSpent: 12750, status: "pending", complianceOk: true },
    { id: "cat3", title: "Coffee Break do Encerramento Esportivo", type: "Frutas & Hidratação", targetPax: 800, costPerPax: 18, totalSpent: 14400, status: "pending", complianceOk: false }
  ]);

  // --- 6. Premiações State ---
  const [awardPodiums, setAwardPodiums] = useState([
    { id: "pod1", competition: "Geral Elite Masculino Corrida de Rua", firstPlace: "Daniel Kiprop (Quênia)", secondPlace: "Everaldo Silva (Brasil)", thirdPlace: "Lucas Santos (Brasil)", medalStock: "Entregue", certificateId: "cert-091" },
    { id: "pod2", competition: "Geral Elite Feminino Corrida de Rua", firstPlace: "Alice Jebet (Quênia)", secondPlace: "Maria de Lourdes (Brasil)", thirdPlace: "Renata Abreu (Brasil)", medalStock: "Pronto para Entrega", certificateId: "cert-092" },
    { id: "pod3", competition: "Destaque Inovação Tecnológica Startup", firstPlace: "TechCorp Brasil Ltda", secondPlace: "Innovations Lab", thirdPlace: "Alpha Analytics", medalStock: "Pronto para Entrega", certificateId: "cert-093" }
  ]);

  // --- 7. Networking & Matchmaking State ---
  const [networkingMeetings, setNetworkingMeetings] = useState([
    { id: "meet1", requester: "Renato Silveira (TechCorp)", target: "Carlos Nobre (Investimentos)", time: "14:00 - 14:20", table: "Mesa Rodada B1", status: "approved" },
    { id: "meet2", requester: "Amanda Melo (Innovations)", target: "Dr. André Luis (Play+)", time: "15:30 - 15:50", table: "Lounge VIP Box A", status: "pending" },
    { id: "meet3", requester: "Claudio Faria (Alfa)", target: "Jean-Pierre (Secretaria)", time: "16:15 - 16:35", table: "Mesa Rodada C2", status: "approved" }
  ]);

  const [activeNetworkingCard, setActiveNetworkingCard] = useState({
    name: "Dr. André Luis",
    title: "CEO & Founder",
    company: "Play+ Holding S.A.",
    email: "andre.luishenr91@gmail.com",
    phone: "+55 (11) 99999-2026"
  });

  // --- 8. Central de Pesquisas (NPS/CSAT) State ---
  const [surveys, setSurveys] = useState([
    { id: "srv1", targetGroup: "Participantes Gerais", nps: 84, csat: "92%", responses: 245, status: "active" },
    { id: "srv2", targetGroup: "Patrocinadores & Marcas", nps: 76, csat: "88%", responses: 12, status: "active" },
    { id: "srv3", targetGroup: "Fornecedores Homologados", nps: 90, csat: "95%", responses: 18, status: "draft" }
  ]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="logistics-fase4-root">
      
      {/* Module Title Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">LOGÍSTICA MESTRE</span>
          <h3 className="text-base font-bold font-display text-slate-100 mt-1">Gestão de Logística Especializada & Cerimonial</h3>
          <p className="text-xs text-slate-400">Coordene suprimentos, controle de licenças governamentais, preleções de palco, rooming list de hotéis e frotas terrestres.</p>
        </div>

        {/* Dynamic selector list for categories */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
          {[
            { id: 'licencas', label: 'Licenças' },
            { id: 'cerimonial', label: 'Cerimonial' },
            { id: 'hospedagem', label: 'Hotéis' },
            { id: 'transporte', label: 'Transporte' },
            { id: 'alimentacao', label: 'Alimentação' },
            { id: 'premiacoes', label: 'Prêmios' },
            { id: 'networking', label: 'B2B Net' },
            { id: 'pesquisas', label: 'Pesquisas' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as ActiveSection)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === item.id 
                  ? 'bg-slate-900 border border-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER THE ACTIVE SUB-LOGISTIC SECTION */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 min-h-[380px]">

        {/* 1. CENTRAL DE LICENÇAS */}
        {activeSection === 'licencas' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  Central de Alvarás, Licenças e Seguros Regulatórios
                </h4>
                <p className="text-xs text-slate-400">Verifique os prazos de vigência de licenças municipais, bombeiros e seguros obrigatórios antes do início.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.map((lic) => {
                const isPending = lic.status === 'pending';
                const isExpired = lic.status === 'expired';
                return (
                  <div key={lic.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between gap-3 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono font-bold block">{lic.agency}</span>
                        <div className="font-bold text-slate-200 leading-snug">{lic.name}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase border shrink-0 ${
                        lic.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : isPending 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {lic.status === 'approved' ? 'Aprovado' : isPending ? 'Pendente' : 'Vencido'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-950 text-slate-400 font-mono text-[10px]">
                      <span>Vencimento: <strong>{lic.expiry}</strong></span>
                      <span>Taxa: R$ {lic.premiumCost.toLocaleString("pt-BR")}</span>
                    </div>

                    {/* Action to renew/resolve */}
                    {(isPending || isExpired) && (
                      <button 
                        onClick={() => handleRenewLicense(lic.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-mono font-bold py-1 px-3 rounded flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" /> Solicitar Renovação / Quitar Guia
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. GESTÃO DE CERIMONIAL */}
        {activeSection === 'cerimonial' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Landmark className="h-4 w-4 text-indigo-400" />
                  Mestre de Cerimônias & Ordem de Precedência Governamental
                </h4>
                <p className="text-xs text-slate-400">Garanta o cumprimento das normas oficiais de protocolo, tempos máximos de fala e teleprompter integrado.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Teleprompter Teleconferencing tool */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Teleprompter do Palco Principal (Speech Teleprompter)</span>
                
                <textarea 
                  value={mcPrompterText}
                  onChange={(e) => setMcPrompterText(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">Velocidade de Rolagem: {mcSpeed} wpm</span>
                  <input 
                    type="range" 
                    min={10} 
                    max={60} 
                    value={mcSpeed} 
                    onChange={(e) => setMcSpeed(Number(e.target.value))}
                    className="w-1/2 accent-indigo-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => alert("Teleprompter enviado para o monitor auxiliar de palco principal.")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5" /> Enviar para Tela de Palco
                  </button>
                </div>
              </div>

              {/* Dignitary Precedence Table */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Ordem Oficial de Precedência Governamental</span>
                
                <div className="space-y-2">
                  {ceremonialPrecedence.map((p) => (
                    <div key={p.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded text-[11px]">{p.order}º</span>
                        <div>
                          <div className="font-bold text-slate-200">{p.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{p.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          T: {p.speechTimeLimit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. GESTÃO DE HOSPEDAGEM (HOTÉIS) */}
        {activeSection === 'hospedagem' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Hotel className="h-4 w-4 text-indigo-400" />
                  Rooming List & Gestão de Hospedagem Executiva/VVIP
                </h4>
                <p className="text-xs text-slate-400">Atribua quartos nos hotéis conveniados para palestrantes internacionais, autoridades diplomáticas e coordenação.</p>
              </div>
            </div>

            {/* Rooming list builder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Table Roomings */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Listagem de Reservas Ativas (Rooming List)</span>
                  <span className="text-[10px] font-mono text-emerald-400">Total Faturado: R$ {roomingList.reduce((sum, r) => sum + r.cost, 0).toLocaleString("pt-BR")}</span>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                  {roomingList.map((r) => (
                    <div key={r.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs gap-3">
                      <div>
                        <div className="font-bold text-slate-200">{r.guest}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hotel: {r.hotel} • {r.roomType}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-1">Check-in: {r.checkIn} ⇆ Check-out: {r.checkOut}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleTogglePaidRoom(r.id)}
                          className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase cursor-pointer border ${
                            r.paid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {r.paid ? 'Faturado' : 'Aguardando'}
                        </button>
                        <button 
                          onClick={() => handleDeleteRoom(r.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Rooming guest form */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Adicionar Reserva de Hóspede</span>
                
                <form onSubmit={handleAddRooming} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block">Nome do Hóspede VIP:</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Prof. Marcus Mendes"
                      value={newGuest}
                      onChange={(e) => setNewGuest(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block">Hotel Conveniado:</label>
                    <select 
                      value={newHotel} 
                      onChange={(e) => setNewHotel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="Meliá Paulista Executive">Meliá Paulista Executive</option>
                      <option value="Copacabana Palace S.A.">Copacabana Palace S.A.</option>
                      <option value="Ibis Budget Jardins">Ibis Budget Jardins</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 block">Custo Diária:</label>
                      <input 
                        type="number" 
                        placeholder="R$..."
                        value={newCost}
                        onChange={(e) => setNewCost(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 block">Tipo Quarto:</label>
                      <select 
                        value={newRoomType} 
                        onChange={(e) => setNewRoomType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                      >
                        <option value="Quarto King Executivo">King Executivo</option>
                        <option value="Suíte Luxo de Frente">Suíte Luxo</option>
                        <option value="Quarto Duplo Standard">Duplo Std</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold p-2 rounded cursor-pointer"
                  >
                    Confirmar Quarto
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* 4. GESTÃO DE TRANSPORTE (FROTA E GPS) */}
        {activeSection === 'transporte' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Truck className="h-4 w-4 text-indigo-400" />
                  Controle de Frotas de Translado, Vans & Escolta VIP
                </h4>
                <p className="text-xs text-slate-400">Monitore em tempo real as frotas terceirizadas ou próprias, combustíveis e rotas ativas de motoristas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {transportFleet.map((fleet) => (
                <div key={fleet.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-200 leading-snug">{fleet.vehicle}</div>
                      <span className="text-[10px] text-slate-500 font-mono">Motorista: {fleet.driver}</span>
                    </div>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase shrink-0">
                      GPS Ativo
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] space-y-1">
                    <div className="text-slate-400">Rota: <strong className="text-slate-200">{fleet.route}</strong></div>
                    <div className="text-slate-400">Missão: <strong className="text-slate-200">{fleet.currentTask}</strong></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>Nível Combustível: <strong>{fleet.fuel}</strong></span>
                    <button 
                      onClick={() => alert(`Enviando mensagem rádio para o motorista ${fleet.driver}`)}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      Ping Rádio Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GESTÃO DE ALIMENTAÇÃO (CATERING & BUFFETS) */}
        {activeSection === 'alimentacao' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Utensils className="h-4 w-4 text-indigo-400" />
                  Alimentação, Coffee Breaks & Controle Sanitário
                </h4>
                <p className="text-xs text-slate-400">Gerencie cronogramas de catering para coffee breaks, jantares VIP, dietas especiais e auditorias de higiene.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cateringSchedules.map((cat) => (
                <div key={cat.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{cat.type}</span>
                    <h5 className="font-bold text-slate-200 leading-snug">{cat.title}</h5>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Público Pax:</span>
                      <span className="text-slate-300">{cat.targetPax} pessoas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor/Pax:</span>
                      <span className="text-slate-300">R$ {cat.costPerPax}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-900 pt-1 mt-1">
                      <span className="text-slate-500">Total Faturado:</span>
                      <span className="text-emerald-400 font-bold">R$ {cat.totalSpent.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px] font-mono">
                    <span className={cat.complianceOk ? "text-emerald-400 flex items-center gap-1" : "text-amber-400 flex items-center gap-1"}>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {cat.complianceOk ? "Vigilância Sanitária OK" : "Pendente Laudo"}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      cat.status === 'completed' ? 'bg-slate-950 text-slate-500 border border-slate-800' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {cat.status === 'completed' ? 'Realizado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. GESTÃO DE PREMIAÇÕES (CERVEJAS & PODIUMS) */}
        {activeSection === 'premiacoes' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <Award className="h-4 w-4 text-indigo-400" />
                  Gestão de Premiações, Medalhas e Pódios Oficiais
                </h4>
                <p className="text-xs text-slate-400">Atribua vencedores em competições esportivas ou homenagens, e exporte certificados oficiais para participantes.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {awardPodiums.map((pod) => (
                <div key={pod.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Classificação Oficial</span>
                    <h5 className="font-bold text-slate-200 leading-snug">{pod.competition}</h5>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold font-mono">1º</span>
                      <span className="text-slate-200 font-sans">{pod.firstPlace}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-bold font-mono">2º</span>
                      <span className="font-sans">{pod.secondPlace}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-bold font-mono">3º</span>
                      <span className="font-sans">{pod.thirdPlace}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px] font-mono border-t border-slate-950">
                    <span className="text-slate-500">Estoque: <strong>{pod.medalStock}</strong></span>
                    <button 
                      onClick={() => alert(`Imprimindo certificado eletrônico serial "${pod.certificateId}" em formato oficial PDF.`)}
                      className="text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      Imprimir Certificado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. NETWORKING B2B & MATCHMAKING */}
        {activeSection === 'networking' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <QrCode className="h-4 w-4 text-indigo-400" />
                  B2B Matchmaking & Cartão Digital de Contatos
                </h4>
                <p className="text-xs text-slate-400">Monitore as agendas de rodadas de negócios de patrocinadores e participantes, e gere cartões digitais instantâneos.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Table of scheduled B2B meetings */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Agenda de Rodadas de Negócios B2B</span>
                
                <div className="space-y-2">
                  {networkingMeetings.map((meet) => (
                    <div key={meet.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{meet.requester} ⇆ {meet.target}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Local: {meet.table} • Horário: {meet.time}</div>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        meet.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {meet.status === 'approved' ? 'Confirmada' : 'Aguardando'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Business Card */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-4 flex flex-col items-center justify-between">
                <div className="w-full text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Seu Cartão de Visitas Digital QR</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3 max-w-[220px]">
                  <div className="w-32 h-32 bg-slate-900 rounded border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <QrCode className="h-24 w-24 text-slate-300" />
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-200 text-xs truncate">{activeNetworkingCard.name}</h6>
                    <p className="text-[10px] text-slate-500">{activeNetworkingCard.title}</p>
                    <p className="text-[9px] text-slate-400 truncate">{activeNetworkingCard.company}</p>
                  </div>
                </div>

                <div className="w-full pt-2">
                  <button 
                    onClick={() => alert("Exibindo QR Code em alta definição para impressão de crachá inteligente.")}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold p-2 rounded cursor-pointer text-center"
                  >
                    Imprimir Badge QR Code
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 8. CENTRAL DE PESQUISAS (NPS / CSAT / CES) */}
        {activeSection === 'pesquisas' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                  <BarChart className="h-4 w-4 text-indigo-400" />
                  Central de Pesquisas de Satisfação, NPS e Opiniões
                </h4>
                <p className="text-xs text-slate-400">Monitore as métricas de Net Promoter Score (NPS), CSAT e taxas de esforço de participantes ou marcas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {surveys.map((srv) => (
                <div key={srv.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Métricas de Satisfação</span>
                    <h5 className="font-bold text-slate-200 leading-snug">{srv.targetGroup}</h5>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-850 text-center">
                      <span className="text-[8px] text-slate-500 block">NPS SCORE</span>
                      <span className="text-sm font-bold text-emerald-400">+{srv.nps}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-850 text-center">
                      <span className="text-[8px] text-slate-500 block">CSAT RATING</span>
                      <span className="text-sm font-bold text-indigo-400">{srv.csat}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-slate-950">
                    <span className="text-slate-500">Respostas: <strong>{srv.responses}</strong></span>
                    <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[8px] ${
                      srv.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {srv.status === 'active' ? 'Coletando' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
