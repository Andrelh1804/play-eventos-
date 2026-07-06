import React from "react";
import {
  Activity,
  Map,
  FolderKanban,
  CheckSquare,
  QrCode,
  DollarSign,
  Users,
  Award,
  ShoppingBag,
  LifeBuoy,
  BrainCircuit,
  LogOut,
  Sparkles,
  TrendingUp,
  UserCheck,
  Shield,
  Cpu
} from "lucide-react";

export type SidebarTab =
  | 'coe'
  | 'events'
  | 'timeline'
  | 'checklist'
  | 'ticketing'
  | 'finance'
  | 'crm'
  | 'sports'
  | 'marketplace'
  | 'chamados'
  | 'staff'
  | 'analytics'
  | 'rbac'
  | 'enterprise';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  userPermissions: Record<SidebarTab, boolean>;
  currentUser: { id: string; email: string; name: string } | null;
  userRoleName: string;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  copilotOpen,
  setCopilotOpen,
  userPermissions,
  currentUser,
  userRoleName,
  onLogout
}: SidebarProps) {
  const menuItems: Array<{
    id: SidebarTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    { id: 'coe',         label: 'Centro de Operações (COE)',  icon: <Activity  size={16} className="text-red-400"    /> , badge: 'LIVE' },
    { id: 'events',      label: 'Eventos & Espaços',          icon: <Map       size={16} />                                              },
    { id: 'timeline',    label: 'Cronograma & Kanban',        icon: <FolderKanban size={16} />                                          },
    { id: 'checklist',   label: 'Checklist & IA Planejador',  icon: <CheckSquare  size={16} className="text-purple-400" />, badge: 'IA' },
    { id: 'ticketing',   label: 'Venda & Check-in',           icon: <QrCode    size={16} />                                              },
    { id: 'finance',     label: 'Financeiro ERP',             icon: <DollarSign size={16} className="text-emerald-400" />, badge: 'Split' },
    { id: 'crm',         label: 'CRM & Contratos',            icon: <Users     size={16} />                                              },
    { id: 'sports',      label: 'Eventos Esportivos',         icon: <Award     size={16} className="text-amber-400"  />, badge: 'Chip'  },
    { id: 'marketplace', label: 'Marketplace Fornecedores',   icon: <ShoppingBag size={16} />                                           },
    { id: 'chamados',    label: 'Central de Chamados',        icon: <LifeBuoy  size={16} className="text-indigo-400" />, badge: 'SLA'   },
    { id: 'staff',       label: 'Staff & Voluntários',        icon: <UserCheck size={16} className="text-violet-400" />, badge: 'XP'   },
    { id: 'analytics',   label: 'BI & Inteligência Preditiva',icon: <TrendingUp size={16} className="text-cyan-400" />, badge: 'PRED'  },
    { id: 'rbac',        label: 'Controle de Acesso (RBAC)',  icon: <Shield    size={16} className="text-indigo-400" />, badge: 'SEC'  },
    { id: 'enterprise',  label: 'Painel EventOS (Fase 4)',    icon: <Cpu       size={16} className="text-fuchsia-400" />, badge: 'CORP'},
  ];

  return (
    <aside
      className="w-full lg:w-72 bg-[#090d16] border-r border-slate-800 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-65px)] sticky top-[65px] z-30 select-none"
      id="app-sidebar"
    >
      {/* Brand Logo Block */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800 bg-[#0c1220]/60">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
          <span className="text-black font-black text-sm tracking-tight">P+</span>
        </div>
        <div>
          <span className="text-white font-black text-sm tracking-wider block">
            PLAY<span className="text-[#FFE211] font-extrabold">+</span>EVENTOS
          </span>
          <span className="text-[9px] text-[#FFE211] font-bold uppercase tracking-widest block font-mono">
            ENTERPRISE SaaS
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
        <p className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold mb-3">
          Módulos Corporativos
        </p>

        {menuItems.map((item) => {
          if (!userPermissions[item.id]) return null;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`sidebar-tab-${item.id}`}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Copilot shortcut */}
        <div className="pt-4 mt-3 border-t border-slate-800/60 space-y-1">
          <p className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold mb-2">
            Assistente IA
          </p>
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              copilotOpen
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 font-bold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <BrainCircuit size={16} className={copilotOpen ? 'text-white' : 'text-yellow-400'} />
            <span>PLAY+ Cognitive</span>
            <Sparkles size={12} className="ml-auto text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
        {currentUser && (
          <div className="flex items-center gap-2.5 p-2 bg-slate-900/50 rounded-lg border border-slate-800/40">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner shrink-0">
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[9px] font-mono text-slate-500 truncate">{userRoleName}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-slate-800 hover:text-red-400 text-slate-500 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Sair do Sistema"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
        <div className="text-center font-mono text-[9px] text-slate-600 leading-normal mt-2.5">
          <div>EventOS v8.0-Enterprise · Sessão Criptografada</div>
        </div>
      </div>
    </aside>
  );
}
