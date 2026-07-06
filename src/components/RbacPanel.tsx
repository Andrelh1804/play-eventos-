import React, { useState } from "react";
import { 
  Shield, 
  User, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  UserCheck, 
  Sliders, 
  Lock, 
  CheckSquare, 
  HelpCircle,
  Sparkles,
  Info,
  ShieldAlert,
  Save,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { CustomRole, PlatformUser, SidebarTab } from "../types";

interface RbacPanelProps {
  roles: CustomRole[];
  users: PlatformUser[];
  activeUserId: string;
  setRoles: React.Dispatch<React.SetStateAction<CustomRole[]>>;
  setUsers: React.Dispatch<React.SetStateAction<PlatformUser[]>>;
  setActiveUserId: (id: string) => void;
}

const moduleNames: Record<SidebarTab, { label: string; desc: string; category: 'operacao' | 'negocios' | 'sistema' }> = {
  coe: { label: "Centro de Operações (COE)", desc: "Acompanhamento em tempo real, painel de chamados e telemetria", category: 'operacao' },
  events: { label: "Eventos & Espaços", desc: "Cadastro de locais, layout de plantas e mapas de arenas", category: 'operacao' },
  timeline: { label: "Cronograma & Kanban", desc: "Quadro de tarefas cronológicas, delegação e prazos", category: 'operacao' },
  checklist: { label: "Checklist & IA Planejador", desc: "Plano operacional modular de tarefas recorrentes", category: 'operacao' },
  sports: { label: "Eventos Esportivos", desc: "Entrega de kits, telemetria com chip RFID e chips de corrida", category: 'operacao' },
  chamados: { label: "Central de Chamados", desc: "Triagem de chamados COE, status de SLA e manutenção", category: 'operacao' },
  staff: { label: "Staff & Voluntários", desc: "Gamificação de equipes, ranking de XP e nota de performance", category: 'operacao' },
  
  ticketing: { label: "Venda & Check-in", desc: "Configuração de lotes de ingressos, leitores QR Code e bilheteria", category: 'negocios' },
  finance: { label: "Financeiro ERP", desc: "Controle de despesas, receitas, split de notas e fluxo de caixa", category: 'negocios' },
  crm: { label: "CRM & Contratos", desc: "Gestão de patrocinadores, contatos B2B e contratos assinados", category: 'negocios' },
  marketplace: { label: "Marketplace Fornecedores", desc: "Cotação de som, LED, geradores, banheiros e palcos", category: 'negocios' },
  analytics: { label: "BI & Inteligência Preditiva", desc: "Previsão de demanda, velocidade de vendas e elasticidade de preço", category: 'negocios' },
  enterprise: { label: "EventOS Enterprise (Cockpit)", desc: "Suíte de governança, PMO, suprimentos, ativos e automação estratégica", category: 'sistema' },
  
  rbac: { label: "Controle de Acesso (RBAC)", desc: "Administração de perfis customizados e permissões de usuários", category: 'sistema' }
};

export default function RbacPanel({
  roles,
  users,
  activeUserId,
  setRoles,
  setUsers,
  setActiveUserId
}: RbacPanelProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "");
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // New Role Form States
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleBase, setNewRoleBase] = useState<string>("empty");

  // New User Form States
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<string>(roles[0]?.id || "");

  const activeRole = roles.find(r => r.id === selectedRoleId);
  const currentSimulatedUser = users.find(u => u.id === activeUserId);
  const currentSimulatedRole = roles.find(r => r.id === currentSimulatedUser?.roleId);

  // Toggle a single permission on the selected role
  const handleTogglePermission = (tab: SidebarTab) => {
    if (activeRole?.isSystem && activeRole.id === "admin") {
      // Don't allow editing system Administrator role to prevent locking yourself out
      return;
    }
    setRoles(prev => prev.map(role => {
      if (role.id === selectedRoleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [tab]: !role.permissions[tab]
          }
        };
      }
      return role;
    }));
  };

  // Bulk enable/disable for selected role
  const handleBulkPermissions = (action: 'all' | 'none' | 'operation' | 'business') => {
    if (activeRole?.isSystem && activeRole.id === "admin") return;
    
    setRoles(prev => prev.map(role => {
      if (role.id === selectedRoleId) {
        const nextPermissions = { ...role.permissions };
        
        Object.keys(nextPermissions).forEach((key) => {
          const tab = key as SidebarTab;
          const info = moduleNames[tab];
          
          if (action === 'all') nextPermissions[tab] = true;
          else if (action === 'none') {
            // Keep rbac enabled for system safety if it's admin or if we want to clear everything
            nextPermissions[tab] = tab === 'rbac' ? role.permissions.rbac : false;
          }
          else if (action === 'operation') {
            if (info?.category === 'operacao') nextPermissions[tab] = true;
          }
          else if (action === 'business') {
            if (info?.category === 'negocios') nextPermissions[tab] = true;
          }
        });

        return { ...role, permissions: nextPermissions };
      }
      return role;
    }));
  };

  // Add Custom Role Handler
  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const id = `role-${Date.now()}`;
    const baseRole = roles.find(r => r.id === newRoleBase);
    
    // Copy permissions from base role or start empty
    const permissions: Record<SidebarTab, boolean> = {
      coe: false, events: false, timeline: false, checklist: false, sports: false,
      chamados: false, staff: false, ticketing: false, finance: false, crm: false,
      marketplace: false, analytics: false, rbac: false, enterprise: false
    };

    if (baseRole) {
      Object.assign(permissions, baseRole.permissions);
    }

    const newRole: CustomRole = {
      id,
      name: newRoleName,
      description: newRoleDesc,
      permissions,
      isSystem: false
    };

    setRoles(prev => [...prev, newRole]);
    setSelectedRoleId(id);
    setNewRoleName("");
    setNewRoleDesc("");
    setNewRoleBase("empty");
    setShowAddRoleForm(false);
  };

  // Delete Custom Role Handler
  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      alert("Perfis de sistema não podem ser excluídos.");
      return;
    }

    // Check if any users are using this role
    const usersInRole = users.filter(u => u.roleId === roleId);
    if (usersInRole.length > 0) {
      alert(`Não é possível excluir este perfil. Existem ${usersInRole.length} usuário(s) vinculados a ele.`);
      return;
    }

    setRoles(prev => prev.filter(r => r.id !== roleId));
    if (selectedRoleId === roleId) {
      setSelectedRoleId(roles[0]?.id || "");
    }
  };

  // Add User Handler
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: PlatformUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      roleId: newUserRole,
      status: "active"
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserForm(false);
  };

  // Toggle user status active/inactive
  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'inactive' : 'active'
        };
      }
      return u;
    }));
  };

  // Change user's role
  const handleUserRoleChange = (userId: string, roleId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, roleId };
      }
      return u;
    }));
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    if (userId === activeUserId) {
      alert("Você não pode excluir o usuário simulado atualmente ativo.");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="rbac-module-view">
      
      {/* Interactive Simulator Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/10 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden" id="rbac-session-simulator">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Simulador de Sessão Ativa</span>
          </div>
          <h3 className="text-sm font-semibold text-white font-display">Teste as restrições em tempo real!</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Selecione qualquer usuário no seletor ao lado para <strong className="text-indigo-300">simular seu login instantaneamente</strong>. A barra lateral e os módulos acessíveis se ajustarão automaticamente às permissões configuradas.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 z-10 w-full md:w-auto" id="simulator-user-select-container">
          <div className="p-2 bg-indigo-950/40 rounded-lg border border-indigo-500/20">
            <UserCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="text-[9px] font-mono text-slate-500 uppercase">Usuário Logado</div>
            <select
              value={activeUserId}
              onChange={(e) => setActiveUserId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer w-full"
              id="simulator-user-select"
            >
              {users.map(u => {
                const r = roles.find(role => role.id === u.roleId);
                return (
                  <option key={u.id} value={u.id} className="bg-slate-950 text-slate-300">
                    {u.name} ({r?.name || 'Sem perfil'})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Main View Grid: Left (Roles & Permissions Editor), Right (Users Assignment) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns (2 span): Roles & Permissions Editor */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            {/* Roles Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-slate-200 font-display">Perfis de Acesso (Custom Roles)</h3>
                </div>
                <p className="text-xs text-slate-400">Configure as permissões granulares de visibilidade para cada perfil</p>
              </div>

              <button
                onClick={() => setShowAddRoleForm(!showAddRoleForm)}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/30 text-xs font-mono font-bold text-slate-300 px-3 py-2 rounded-xl transition-all"
                style={{ minHeight: "40px" }}
                id="btn-add-custom-role"
              >
                <Plus className="h-4 w-4 text-indigo-400" />
                Criar Perfil
              </button>
            </div>

            {/* Create Custom Role Form */}
            {showAddRoleForm && (
              <form onSubmit={handleAddRole} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-150" id="add-role-form">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase">Novo Perfil de Usuário</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-medium">Nome do Perfil</label>
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="Ex: Auditor Financeiro"
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-medium font-sans">Herdar Permissões Iniciais De</label>
                    <select
                      value={newRoleBase}
                      onChange={(e) => setNewRoleBase(e.target.value)}
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="empty">-- Iniciar em Branco (Sem permissões) --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[11px] text-slate-400 font-medium">Descrição / Propósito</label>
                    <input
                      type="text"
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      placeholder="Ex: Perfil restrito para auditoria de notas fiscais e fluxo de caixa"
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRoleForm(false)}
                    className="bg-slate-900 hover:bg-slate-850 text-slate-400 px-3.5 py-1.5 rounded-lg text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </form>
            )}

            {/* Profile Selection Tabs Row */}
            <div className="flex flex-wrap gap-2" id="rbac-role-selector-tabs">
              {roles.map(r => {
                const isSelected = r.id === selectedRoleId;
                const userCount = users.filter(u => u.roleId === r.id).length;

                return (
                  <div key={r.id} className="relative group">
                    <button
                      onClick={() => setSelectedRoleId(r.id)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold font-sans transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500/55 text-indigo-300 shadow-md shadow-indigo-500/5"
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                      }`}
                      id={`rbac-role-tab-${r.id}`}
                    >
                      <Shield className={`h-3.5 w-3.5 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                      <span>{r.name}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-900 text-slate-500"
                      }`}>
                        {userCount}
                      </span>
                    </button>
                    
                    {/* Delete button on hover for custom roles */}
                    {!r.isSystem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(r.id);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-rose-950 border border-rose-500/20 hover:bg-rose-900 text-rose-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Excluir Perfil"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role Info Alert */}
            {activeRole && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Propósito do Perfil: {activeRole.name} {activeRole.isSystem && <span className="text-[10px] font-mono text-indigo-400 font-bold ml-1 bg-indigo-950/40 border border-indigo-500/20 px-1.5 py-0.1 rounded">(Do Sistema)</span>}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{activeRole.description || "Nenhuma descrição fornecida para este perfil customizado."}</p>
                </div>
              </div>
            )}

            {/* Granular Permissions Matrix */}
            {activeRole && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold font-mono text-slate-300 uppercase">Matriz de Permissões de Módulo</h4>
                  
                  {/* Bulk Actions (disabled for admin system role) */}
                  {!activeRole.isSystem && (
                    <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
                      <button
                        onClick={() => handleBulkPermissions('all')}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300"
                      >
                        Habilitar Tudo
                      </button>
                      <button
                        onClick={() => handleBulkPermissions('none')}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300"
                      >
                        Desabilitar Tudo
                      </button>
                      <button
                        onClick={() => handleBulkPermissions('operation')}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-indigo-400"
                      >
                        Focar em Operação
                      </button>
                      <button
                        onClick={() => handleBulkPermissions('business')}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-emerald-400"
                      >
                        Focar em Negócios
                      </button>
                    </div>
                  )}
                </div>

                {/* System Admin Notice if editing admin */}
                {activeRole.isSystem && activeRole.id === "admin" && (
                  <div className="bg-amber-950/20 border border-amber-500/10 p-3 rounded-xl text-[11px] text-amber-400 font-mono flex items-center gap-2">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>Perfis nativos do sistema (Administrador) possuem privilégios totais blindados que não podem ser revogados para manter a integridade da plataforma.</span>
                  </div>
                )}

                {/* Grid of Permission Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="permissions-toggles-grid">
                  {(Object.keys(moduleNames) as SidebarTab[]).map((tab) => {
                    const info = moduleNames[tab];
                    const hasAccess = activeRole.permissions[tab];
                    const isDisabled = activeRole.isSystem && activeRole.id === "admin";

                    return (
                      <div 
                        key={tab}
                        onClick={() => !isDisabled && handleTogglePermission(tab)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 select-none ${
                          isDisabled ? "cursor-default" : "cursor-pointer"
                        } transition-all ${
                          hasAccess
                            ? "bg-slate-950 border-indigo-500/10 hover:border-indigo-500/25"
                            : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200">{info.label}</span>
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
                              info.category === 'operacao' ? 'bg-indigo-950/40 text-indigo-400 border-indigo-500/10' :
                              info.category === 'negocios' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/10' :
                              'bg-rose-950/40 text-rose-400 border-rose-500/10'
                            }`}>
                              {info.category === 'operacao' ? 'Operações' : info.category === 'negocios' ? 'Receita' : 'Sistema'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{info.desc}</p>
                        </div>

                        {/* Visual Switch Toggle */}
                        <div className="shrink-0">
                          {hasAccess ? (
                            <ToggleRight className={`h-6 w-6 ${isDisabled ? "text-slate-600" : "text-indigo-400"}`} />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-700" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Column: User Management / Assignment Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold font-display text-slate-200">Colaboradores & Perfis</h3>
                <p className="text-xs text-slate-400">Atribua perfis aos usuários do sistema</p>
              </div>

              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-850 p-2 rounded-xl transition-all"
                title="Cadastrar Novo Colaborador"
                style={{ minHeight: "40px" }}
              >
                <Plus className="h-4 w-4 text-cyan-400" />
              </button>
            </div>

            {/* Add User Form */}
            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150" id="add-user-form">
                <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase">Novo Usuário</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium">Nome</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ex: Pedro Henrique"
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium">Email institucional</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Ex: pedro@holding.com"
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-medium">Perfil de Acesso</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="bg-slate-900 text-slate-400 px-3 py-1 rounded-lg text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1 rounded-lg text-xs font-semibold"
                  >
                    Salvar Usuário
                  </button>
                </div>
              </form>
            )}

            {/* Users List with interactive Role selector inside cards */}
            <div className="space-y-3" id="rbac-users-list">
              {users.map(u => {
                const role = roles.find(r => r.id === u.roleId);
                const isActiveUserSimulated = u.id === activeUserId;

                return (
                  <div 
                    key={u.id}
                    className={`p-3.5 rounded-xl border flex flex-col gap-3 transition-all ${
                      isActiveUserSimulated 
                        ? "bg-indigo-950/20 border-indigo-500/25 shadow-md shadow-indigo-500/2"
                        : "bg-slate-950 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.status === 'active' ? 'bg-slate-900 text-slate-300' : 'bg-slate-950 text-slate-600'
                        }`}>
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-200 leading-none">{u.name}</h4>
                            {isActiveUserSimulated && (
                              <span className="text-[8px] font-bold font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/15 px-1.5 py-0.1 rounded uppercase">
                                Simulando
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{u.email}</span>
                        </div>
                      </div>

                      {/* Right corner delete/status toggles */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                            u.status === 'active' 
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/10 hover:bg-emerald-900/30' 
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'
                          }`}
                          title="Alternar Status Ativo/Inativo"
                        >
                          {u.status === 'active' ? 'Ativo' : 'Bloqueado'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={isActiveUserSimulated}
                          className={`p-1 rounded text-slate-600 hover:text-rose-400 transition-colors ${
                            isActiveUserSimulated ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          title="Remover Usuário"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Role Assign Selector */}
                    <div className="grid grid-cols-3 gap-2 items-center text-[11px] font-mono border-t border-slate-900/60 pt-2.5">
                      <span className="text-slate-500 uppercase text-[9px] font-bold">Perfil Vinculado</span>
                      <select
                        value={u.roleId}
                        onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                        className="col-span-2 bg-slate-900 text-slate-300 font-semibold px-2 py-1 rounded border border-slate-800 text-[11px] cursor-pointer focus:outline-none focus:border-indigo-500"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick Informational Tip Card */}
          <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900/20 border border-indigo-500/10 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">Segurança & Conformidade (LGPD)</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              De acordo com políticas rígidas de conformidade corporativa e LGPD, alterações na Matriz de Controle de Acesso geram automaticamente logs auditáveis criptografados assinados digitalmente.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
