import React, { useState, useEffect } from "react";
import { Calendar, Shield, Activity, RefreshCw } from "lucide-react";
import { Event } from "../types";

interface HeaderProps {
  events: Event[];
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced';
  tenantName: string;
  setTenantName: (name: string) => void;
}

export default function Header({
  events,
  activeEventId,
  setActiveEventId,
  syncStatus,
  tenantName,
  setTenantName
}: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeEvent = events.find(e => e.id === activeEventId);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-40" id="app-header">
      {/* Brand & Tenant */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <span className="font-display font-bold text-white text-lg tracking-wider">P+</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white leading-none tracking-tight">PLAY+EVENTOS</h1>
            <p className="text-xs text-slate-400 mt-1">EventOS Enterprise</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

        {/* Tenant Selector (White Label) */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Tenant:</span>
          <select 
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="bg-slate-800 text-xs text-slate-300 font-medium px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="Play+ Holding Brasil">Play+ Holding Brasil</option>
            <option value="Prefeitura Municipal (Sports)">Prefeitura Municipal SP</option>
            <option value="Tech Summit Organizações">Tech Summit Org</option>
            <option value="Som do Sol Produtora">Som do Sol Produtora</option>
          </select>
        </div>
      </div>

      {/* Center: Event Selector */}
      <div className="flex-1 max-w-md mx-0 md:mx-6">
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-800 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} ({evt.status === 'active' ? 'Ativo' : evt.status === 'planning' ? 'Em Planejamento' : evt.status === 'completed' ? 'Finalizado' : 'Inativo'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Sync Status, System details & Live UTC Clock */}
      <div className="flex items-center justify-between sm:justify-end gap-4 font-mono text-xs">
        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className={`inline-block w-2 h-2 rounded-full ${
            syncStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : syncStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-slate-500'
          }`}></span>
          <span className="text-slate-400 font-medium select-none">
            {syncStatus === 'synced' ? 'COE Conectado' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Offline'}
          </span>
          {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 text-amber-500 animate-spin ml-1" />}
        </div>

        {/* Real-time Clock */}
        <div className="text-slate-400 text-right hidden lg:block">
          <div className="text-[11px] text-slate-500 font-medium">SISTEMA ATIVO (UTC-3)</div>
          <div className="font-semibold text-slate-300 font-mono tracking-wider">
            {time.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} | {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>
    </header>
  );
}
