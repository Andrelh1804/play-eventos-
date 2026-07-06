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
    icon: React.ComponentType<any>;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'coe', label: 'Centro de Operações (COE)', icon: Activity, badge: 'LIVE', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { id: 'events', label: 'Eventos & Espaços', icon: Map },
    { id: 'timeline', label: 'Cronograma & Kanban', icon: FolderKanban },
    { id: 'checklist', label: 'Checklist & IA Planejador', icon: CheckSquare, badge: 'IA', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'ticketing', label: 'Venda & Check-in', icon: QrCode },
    { id: 'finance', label: 'Financeiro ERP', icon: DollarSign, badge: 'Split', badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'crm', label: 'CRM & Contratos', icon: Users },
    { id: 'sports', label: 'Eventos Esportivos', icon: Award, badge: 'Chip', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'marketplace', label: 'Marketplace Fornecedores', icon: ShoppingBag },
    { id: 'chamados', label: 'Central de Chamados', icon: LifeBuoy, badge: 'SLA', badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'staff', label: 'Staff & Voluntários', icon: UserCheck, badge: 'XP', badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'analytics', label: 'BI & Inteligência Preditiva', icon: TrendingUp, badge: 'PRED', badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { id: 'rbac', label: 'Controle de Acesso (RBAC)', icon: Shield, badge: 'SEC', badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'enterprise', label: 'Painel EventOS (Fase 4)', icon: Cpu, badge: 'CORP', badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' }
  ];


  return (
    <aside className="w-full lg:w-72 bg-black border-r border-zinc-900 flex flex-col justify-between shrink-0 h-auto lg:h-[calc(100vh-73px)] sticky top-[73px] z-30" id="app-sidebar">
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {/* Navigation items */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold mb-3">Módulos do Sistema</p>
          {menuItems.map((item) => {
            if (!userPermissions[item.id]) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-zinc-900 border-l-4 border-yellow-500 text-yellow-500' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
                id={`sidebar-tab-${item.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-[18px] w-[18px] transition-colors ${
                    isActive ? 'text-yellow-500' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border leading-none tracking-wide font-semibold ${
                    item.badgeColor || 'bg-zinc-850 text-zinc-400 border-zinc-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Copilot shortcut status indicator */}
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 shadow-lg shadow-black/10">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="h-4 w-4 text-yellow-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200 font-display">PLAY+ COGNITIVE</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">Assessor de inteligência artificial ativo e contextualizado.</p>
          <button 
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium py-1.5 px-3 rounded-lg text-xs transition-all shadow-md shadow-yellow-500/20 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            {copilotOpen ? 'Ocultar Assessor' : 'Chamar Assessor'}
          </button>
        </div>
      </div>

      {/* User profile & Logout footer info inside Sidebar */}
      <div className="p-4 border-t border-zinc-900 bg-black space-y-3">
        {currentUser && (
          <div className="flex items-center justify-between bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-500 to-amber-500 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-black uppercase">{currentUser.name.slice(0, 2)}</span>
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-zinc-200 truncate">{currentUser.name}</span>
                <span className="block text-[9px] font-mono text-yellow-500 uppercase tracking-wider">{userRoleName}</span>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-zinc-800 hover:text-red-400 text-zinc-500 rounded-lg transition-colors cursor-pointer"
              title="Sair do Sistema"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="text-center font-mono text-[9px] text-zinc-600 leading-normal">
          <div>EventOS v8.0-Enterprise</div>
          <div>Criptografia de Sessão Ativa</div>
        </div>
      </div>
    </aside>
  );
}
