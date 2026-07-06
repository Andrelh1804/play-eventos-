import React, { useState, useEffect } from "react";
import { Calendar, RefreshCw, Bell, Search, Moon, Sun, Menu, X, Plus } from "lucide-react";
import { Event } from "../types";

interface HeaderProps {
  events: Event[];
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced';
  tenantName: string;
  setTenantName: (name: string) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Header({
  events,
  activeEventId,
  setActiveEventId,
  syncStatus,
  tenantName,
  setTenantName,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowNotifications(false); };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-notifications]")) setShowNotifications(false);
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showNotifications]);

  const notifications = [
    { id: 1, type: "info",    title: "Sistema operacional",   msg: "Todos os módulos funcionando normalmente.",       time: "agora" },
    { id: 2, type: "warn",    title: "Check-in pendente",     msg: "Há participantes aguardando credenciamento.",     time: "5 min" },
    { id: 3, type: "success", title: "Relatório exportado",   msg: "DRE financeiro disponível para download.",       time: "10 min" },
  ];

  return (
    <header
      className="h-[65px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40 gap-3"
      id="app-header"
    >
      {/* Left: Mobile hamburger + event selector */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {setSidebarOpen && (
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}

        {/* Event Selector */}
        <div className="relative hidden sm:block">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400 transition-all cursor-pointer min-w-[200px] max-w-xs"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tenant selector */}
        <div className="hidden lg:flex items-center gap-2 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0">
          <span className="text-violet-600 font-bold">Tenant:</span>
          <select
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="bg-transparent border-none text-violet-800 font-bold outline-none cursor-pointer text-xs"
          >
            <option value="Play+ Holding Brasil">Play+ Holding Brasil</option>
            <option value="Prefeitura Municipal SP">Prefeitura Municipal SP</option>
            <option value="Tech Summit Organizações">Tech Summit Org</option>
            <option value="Som do Sol Produtora">Som do Sol Produtora</option>
          </select>
        </div>

        {/* Sync status */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
          {syncStatus === 'syncing' ? (
            <RefreshCw size={10} className="text-amber-500 animate-spin" />
          ) : (
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
          )}
          <span className="text-slate-600 hidden lg:inline">
            {syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Offline'}
          </span>
          <span className="text-slate-600 lg:hidden">Sync</span>
        </div>
      </div>

      {/* Right: Search, dark mode, notifications */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder="Filtrar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 lg:w-52 pl-8 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-full text-xs focus:ring-2 focus:ring-violet-500 focus:bg-white focus:border-slate-300 outline-none transition-all"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(v => !v)}
          aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative" data-notifications>
          <button
            onClick={() => setShowNotifications(v => !v)}
            aria-label="Notificações"
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
          </button>

          {showNotifications && (
            <div
              role="dialog"
              aria-label="Notificações"
              className="absolute right-0 top-11 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notificações</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-bold text-slate-800">{n.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{n.msg}</div>
                      </div>
                      <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button className="text-[10px] text-violet-600 font-bold hover:text-violet-700">
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Event CTA */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shrink-0">
          <Plus size={13} />
          <span className="hidden lg:inline">Novo Evento</span>
        </button>
      </div>
    </header>
  );
}
