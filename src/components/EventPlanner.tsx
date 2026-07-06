import React, { useState } from "react";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Plus, 
  Trash2, 
  Layers, 
  Maximize2, 
  Briefcase,
  Sliders,
  CheckCircle,
  Building
} from "lucide-react";
import { Event, EventTemplate } from "../types";

interface EventPlannerProps {
  events: Event[];
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  addEvent: (event: Omit<Event, 'id'>, selectedTemplateId?: string) => void;
  deleteEvent: (id: string) => void;
  templates: EventTemplate[];
  saveEventAsTemplate: (eventId: string, templateName: string) => void;
}

export default function EventPlanner({
  events,
  activeEventId,
  setActiveEventId,
  addEvent,
  deleteEvent,
  templates,
  saveEventAsTemplate
}: EventPlannerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Event['category']>("corporate");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(1000);
  const [budget, setBudget] = useState(50000);

  // Space manager active area selection
  const [selectedArea, setSelectedArea] = useState<string>("stage-a");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !venue) {
      alert("Por favor preencha Nome, Data e Local.");
      return;
    }
    addEvent({
      name,
      description,
      category,
      venue,
      date,
      endDate: endDate || date,
      capacity: Number(capacity),
      status: "planning"
    }, selectedTemplate || undefined);
    // Clear Form
    setName("");
    setDescription("");
    setCategory("corporate");
    setVenue("");
    setDate("");
    setEndDate("");
    setCapacity(1000);
    setBudget(50000);
    setSelectedTemplate("");
    setShowAddForm(false);
  };


  const categoriesMap: Record<Event['category'], { label: string; color: string; bg: string }> = {
    corporate: { label: "Corporativo / Feiras", color: "text-cyan-400 border-cyan-500/20", bg: "bg-cyan-950/20" },
    sports: { label: "Esportivo", color: "text-emerald-400 border-emerald-500/20", bg: "bg-emerald-950/20" },
    show_festival: { label: "Show / Festival", color: "text-pink-400 border-pink-500/20", bg: "bg-pink-950/20" },
    wedding_social: { label: "Social / Casamento", color: "text-amber-400 border-amber-500/20", bg: "bg-amber-950/20" },
    government: { label: "Governamental", color: "text-indigo-400 border-indigo-500/20", bg: "bg-indigo-950/20" },
    other: { label: "Outro / Beneficente", color: "text-purple-400 border-purple-500/20", bg: "bg-purple-950/20" }
  };

  // Mock spaces list inside current event
  const spaces = [
    { id: "stage-a", name: "Palco Principal / Plenária A", type: "Auditório", cap: 1200, resources: ["Line Array JBL", "Painel LED P3.9 12x4m", "Gerador 120KVA Redundante"] },
    { id: "lounge-vip", name: "Lounge VIP e Camarotes", type: "Área de Convivência", cap: 250, resources: ["Catering Premium", "Ar Condicionado Portátil", "Recepcionistas Privativas"] },
    { id: "expo-stands", name: "Pavilhão de Exposição & Stands", type: "Stands Comerciais", cap: 3000, resources: ["Pontos de Energia Trifásicos", "WiFi Dedicado", "Grades Divisórias Octanorm"] },
    { id: "parking", name: "Estacionamento & Credenciamento", type: "Área Técnica / Acesso", cap: 500, resources: ["Pórticos Metálicos", "Sensores de Credenciamento RFID", "Guarita com Gerador"] }
  ];

  const currentSpace = spaces.find(s => s.id === selectedArea) || spaces[0];

  return (
    <div className="space-y-8" id="event-planner-view">
      {/* Event Listing and Adding Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Eventos no Ecossistema</h2>
          <p className="text-xs text-slate-400 mt-0.5">Cadastro global, multi-tenant e status operacional</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/15"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Fechar Form" : "Cadastrar Novo Evento"}
        </button>
      </div>

      {/* Add New Event Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl max-w-4xl animate-in fade-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider border-b border-slate-800 pb-2">Nova Operação de Evento</h3>
          
          {/* Template Selection Dropdown */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
            <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              Pre-preencher com Template Estrutural
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                const tplId = e.target.value;
                setSelectedTemplate(tplId);
                if (tplId) {
                  const tpl = templates.find(t => t.id === tplId);
                  if (tpl) {
                    setName(tpl.name);
                    setDescription(tpl.description);
                    setCategory(tpl.category);
                    setVenue(tpl.venue);
                    setCapacity(tpl.capacity);
                  }
                }
              }}
              className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              <option value="">-- Criar Evento em Branco (Sem Template) --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tasks.length} Tarefas, {t.checklists.length} Checklists)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 font-mono">
              Escolher um template herda automaticamente os checklists operacionais, cronograma planejado e categorias de bilheteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Nome do Evento</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: 5ª Corrida Rústica de Verão"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Event['category'])}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="corporate">Corporativo / Feira</option>
                <option value="sports">Esportivo / Corrida</option>
                <option value="show_festival">Show / Festival</option>
                <option value="wedding_social">Social / Casamento</option>
                <option value="government">Governamental</option>
                <option value="other">Outro / Beneficente</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Local (Espaço / Cidade)</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ex: Arena Allianz Parque"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Data Início</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Data Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Capacidade Estimada (Público)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                min="1"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Orçamento Estimado (R$)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Descrição Completa</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhamento operacional, regulamentos ou escopo das palestras..."
              className="w-full h-20 bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-4 py-2 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20"
            >
              Confirmar Operação
            </button>
          </div>
        </form>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="event-list-grid">
        {events.map((evt) => {
          const cat = categoriesMap[evt.category] || categoriesMap.other;
          const isActiveSelection = evt.id === activeEventId;

          return (
            <div 
              key={evt.id}
              onClick={() => setActiveEventId(evt.id)}
              className={`border rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group ${
                isActiveSelection 
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/5' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {/* Card visual highlight accent */}
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${
                evt.category === 'sports' ? 'from-emerald-500 to-teal-500' :
                evt.category === 'corporate' ? 'from-cyan-500 to-indigo-500' :
                'from-pink-500 to-rose-500'
              }`}></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-semibold font-mono tracking-wider px-2 py-0.5 rounded-full border ${cat.color} ${cat.bg}`}>
                    {cat.label}
                  </span>
                  
                  <span className={`text-[10px] font-semibold font-mono uppercase tracking-wide px-2 py-0.5 rounded ${
                    evt.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    evt.status === 'planning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {evt.status === 'active' ? 'Ativo' : evt.status === 'planning' ? 'Planejamento' : 'Concluído'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors font-display leading-tight">{evt.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{evt.description}</p>
                
                <div className="space-y-2 mt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{evt.date} {evt.endDate !== evt.date && `até ${evt.endDate}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Capacidade: <strong className="text-slate-300 font-mono">{evt.capacity.toLocaleString("pt-BR")}</strong> participantes</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 mt-5 pt-3 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const tName = prompt("Digite o nome do template para salvar esta estrutura:", `Template - ${evt.name}`);
                    if (tName) {
                      saveEventAsTemplate(evt.id, tName);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1.5 shrink-0"
                  style={{ minHeight: "32px" }}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Salvar Template
                </button>
                
                {events.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Deseja realmente arquivar/excluir este evento do ecossistema?")) {
                        deleteEvent(evt.id);
                      }
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                    title="Excluir evento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Space Layout Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="venue-space-manager">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Building className="h-5 w-5 text-cyan-400" />
              Gestão de Espaços & Mapa Interativo do Local
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Controle de ocupação, infraestrutura e segurança por zona</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Localização Geral: {events.find(e => e.id === activeEventId)?.venue}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Areas navigation sidebar */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-2">Zonas de Controle</p>
            {spaces.map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedArea(sp.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedArea === sp.id 
                    ? 'bg-slate-950 border-cyan-500/40 text-cyan-400 shadow-md' 
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{sp.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sp.type}</div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{sp.cap} pax</span>
              </button>
            ))}
          </div>

          {/* Interactive Blueprint Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[300px] lg:col-span-2 relative">
            <div className="absolute top-3 right-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">Layout Blueprint v1.2</div>
            
            {/* Visual simulation of spatial zone occupancy */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-video border border-slate-800 rounded-xl bg-slate-900/60 p-4 flex flex-col justify-between shadow-inner">
                {/* Visual Representation Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-20 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border border-dashed border-slate-700"></div>
                  ))}
                </div>

                <div className="flex justify-between items-start z-10">
                  <span className="text-xs font-semibold text-slate-400 font-mono">ZONA SELECIONADA:</span>
                  <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase leading-none border border-cyan-500/20">{currentSpace.id}</span>
                </div>

                <div className="text-center z-10 py-6">
                  <p className="text-sm font-semibold font-display text-white">{currentSpace.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Status Operacional: <strong className="text-emerald-400">Homologado (100% OK)</strong></p>
                </div>

                <div className="flex justify-between items-end text-[10px] font-mono text-slate-500 z-10">
                  <span>Limite: {currentSpace.cap} pax</span>
                  <span>Setores 1 e 2 Liberados</span>
                </div>
              </div>
            </div>

            {/* Resources list */}
            <div className="border-t border-slate-800/80 pt-4 mt-2">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-2">Equipamentos e Recursos Atribuídos</p>
              <div className="flex flex-wrap gap-2">
                {currentSpace.resources.map((res, i) => (
                  <span key={i} className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
