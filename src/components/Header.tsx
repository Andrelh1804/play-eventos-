import React, { useState, useEffect } from "react";
import { Calendar, Shield, Activity, RefreshCw } from "lucide-react";
import { Event } from "../types";
import PlayLogo from "./PlayLogo";

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
    <header className="bg-black border-b border-zinc-900 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-40" id="app-header">
      {/* Brand & Tenant */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <PlayLogo size="xs" />
        </div>

        <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>

        {/* Tenant Selector (White Label) */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Tenant:</span>
          <select 
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="bg-zinc-900 text-xs text-zinc-300 font-medium px-3 py-1.5 rounded-lg border border-zinc-800 focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer"
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
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-200 pl-10 pr-4 py-2 rounded-xl border border-zinc-800 text-sm font-medium focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all cursor-pointer"
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
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
          <span className={`inline-block w-2 h-2 rounded-full ${
            syncStatus === 'synced' ? 'bg-yellow-500 animate-pulse' : syncStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-zinc-600'
          }`}></span>
          <span className="text-zinc-400 font-medium select-none">
            {syncStatus === 'synced' ? 'COE Conectado' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Offline'}
          </span>
          {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 text-amber-500 animate-spin ml-1" />}
        </div>

        {/* Real-time Clock */}
        <div className="text-zinc-400 text-right hidden lg:block">
          <div className="text-[11px] text-zinc-500 font-medium">SISTEMA ATIVO (UTC-3)</div>
          <div className="font-semibold text-zinc-300 font-mono tracking-wider">
            {time.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} | {time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>
      </div>
    </header>
  );
}
