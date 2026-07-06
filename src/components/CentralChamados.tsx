import React, { useState } from "react";
import { LifeBuoy, Plus, Search, ShieldAlert, Check, Clock, User } from "lucide-react";
import { ServiceTicket } from "../types";

interface CentralChamadosProps {
  serviceTickets: ServiceTicket[];
  activeEventId: string;
  addServiceTicket: (tkt: Omit<ServiceTicket, 'id'>) => void;
  resolveServiceTicket: (id: string) => void;
}

export default function CentralChamados({
  serviceTickets,
  activeEventId,
  addServiceTicket,
  resolveServiceTicket
}: CentralChamadosProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<ServiceTicket['department']>("Infraestrutura");
  const [priority, setPriority] = useState<ServiceTicket['priority']>("medium");
  const [description, setDescription] = useState("");

  const activeTickets = serviceTickets.filter(t => t.eventId === activeEventId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addServiceTicket({
      eventId: activeEventId,
      title,
      department,
      status: "open",
      priority,
      description,
      createdAt: new Date().toISOString()
    });
    setTitle("");
    setDescription("");
    setShowAdd(false);
  };

  const getPriorityBadge = (p: ServiceTicket['priority']) => {
    switch (p) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6" id="helpdesk-view">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Central de Ocorrências (SLA & Chamados)</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestão de chamados operacionais e ocorrências na arena/pista</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md"
        >
          <Plus className="h-4 w-4" />
          {showAdd ? "Fechar Registro" : "Abrir Ocorrência"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Registrar Nova Ocorrência Física</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs text-slate-400 font-medium">Resumo do Incidente</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Refletor do portão principal apagou"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Departamento Responsável</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as ServiceTicket['department'])}
                className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none"
              >
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Segurança">Segurança</option>
                <option value="Produção">Produção Geral</option>
                <option value="Limpeza">Equipe Limpeza</option>
                <option value="TI">Suporte de TI / WiFi</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Nível de Severidade</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase border ${
                      priority === p 
                        ? 'bg-rose-950 border-rose-500 text-rose-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {p === 'high' ? 'Crítico' : p === 'medium' ? 'Médio' : 'Baixo'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs text-slate-400 font-medium">Detalhamento e Localização Exata</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicitar localização (ex: curva 3, tenda VIP 2) para agilizar o atendimento..."
                className="w-full h-16 bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl"
            >
              Emitir Alerta de Ocorrência
            </button>
          </div>
        </form>
      )}

      {/* Tickets render */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTickets.length === 0 ? (
          <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            Nenhuma ocorrência registrada no momento.
          </div>
        ) : (
          activeTickets.map((tkt) => (
            <div key={tkt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(tkt.priority)}`}>
                    {tkt.priority === 'high' ? 'CRÍTICO' : tkt.priority === 'medium' ? 'MÉDIO' : 'BAIXO'}
                  </span>
                  
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    tkt.status === 'closed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : tkt.status === 'in_progress' 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {tkt.status === 'closed' ? 'Resolvido' : tkt.status === 'in_progress' ? 'Atendimento' : 'Aberto'}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white font-display leading-tight">{tkt.title}</h3>
                <p className="text-[11px] text-slate-400 leading-normal">{tkt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[10px] text-slate-500 font-mono">
                <div className="space-y-1">
                  <div>Depto: <strong className="text-slate-300 font-sans">{tkt.department}</strong></div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(tkt.createdAt).toLocaleTimeString("pt-BR")}
                  </div>
                </div>

                {tkt.status !== 'closed' && (
                  <button
                    onClick={() => resolveServiceTicket(tkt.id)}
                    className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1"
                    style={{ minHeight: '44px' }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Resolver
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
