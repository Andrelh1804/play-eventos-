import React, { useState } from "react";
import { 
  Users, 
  Award, 
  CheckCircle, 
  Star, 
  UserPlus, 
  Trophy, 
  Zap, 
  UserCheck, 
  Sparkles, 
  Flame, 
  AlertCircle
} from "lucide-react";
import { StaffMember, Event } from "../types";

interface StaffVolunteersProps {
  events: Event[];
  activeEventId: string;
  staffMembers: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  rewardStaff: (id: string) => void;
  updateStaffRating: (id: string, rating: number) => void;
}

const availableBadges = [
  { id: "perfect_attendance", name: "Assiduidade Perfeita", description: "Presença integral confirmada em 100% dos turnos", icon: Trophy, color: "text-amber-400 border-amber-500/20 bg-amber-950/20" },
  { id: "star_performer", name: "Estrela do Evento", description: "Avaliação técnica perfeita de 5.0 estrelas", icon: Star, color: "text-purple-400 border-purple-500/20 bg-purple-950/20" },
  { id: "quick_support", name: "Suporte Rápido", description: "Atendimento de chamados COE abaixo da média do SLA", icon: Zap, color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20" },
  { id: "infra_master", name: "Mestre da Infraestrutura", description: "Sucesso na montagem elétrica e de palcos", icon: Flame, color: "text-rose-400 border-rose-500/20 bg-rose-950/20" },
  { id: "eco_guardian", name: "Eco-Guardião", description: "Destinação exemplar de lixo e limpeza da arena", icon: CheckCircle, color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20" }
];

export default function StaffVolunteers({
  events,
  activeEventId,
  staffMembers,
  addStaff,
  rewardStaff,
  updateStaffRating
}: StaffVolunteersProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffMember['role']>("volunteer");
  const [department, setDepartment] = useState<StaffMember['department']>("Produção");

  const leaderboard = [...staffMembers].sort((a, b) => b.points - a.points);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addStaff({
      name,
      role,
      department,
      points: 200,
      rating: 4.5,
      attendance: 100,
      badges: ["Membro Oficial"],
      completedTasksCount: 0
    });
    setName("");
    setRole("volunteer");
    setDepartment("Produção");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="staff-gamification-view">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Staff & Voluntários (Gamificação)</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestão de equipes, engajamento por pontos, medalhas de competência e ranking operacional</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/15"
        >
          <UserPlus className="h-4 w-4" />
          {showAddForm ? "Fechar Cadastro" : "Cadastrar Integrante"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddStaff} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Novo Integrante do Time Operacional</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1 sm:col-span-1">
              <label className="text-xs text-slate-400 font-medium">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Cargo / Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="volunteer">Voluntário</option>
                <option value="staff">Staff Técnico</option>
                <option value="coordinator">Coordenador de Arena</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Departamento</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as StaffMember['department'])}
                className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="Produção">Produção Geral</option>
                <option value="TI">Suporte de TI / WiFi</option>
                <option value="Segurança">Segurança</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl"
            >
              Confirmar Contratação / Cadastro
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-semibold font-display text-slate-200">Classificação Geral (Leaderboard)</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold bg-cyan-950 border border-cyan-500/15 px-2 py-0.5 rounded">
              COE PLAY+POINTS
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500">Nenhum membro cadastrado.</p>
              <p className="text-[11px] text-slate-600">Clique em "Cadastrar Integrante" para adicionar staff e voluntários.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((member, idx) => {
                const medalColor = 
                  idx === 0 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  idx === 1 ? "bg-slate-300/20 text-slate-300 border-slate-300/30" :
                  idx === 2 ? "bg-amber-700/20 text-amber-600 border-amber-700/30" :
                  "bg-slate-950 text-slate-500 border-slate-850";

                return (
                  <div 
                    key={member.id} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                      idx === 0 
                        ? "bg-slate-950 border-amber-500/20 shadow-md shadow-amber-500/2" 
                        : "bg-slate-950 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${medalColor}`}>
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">{member.name}</h4>
                          <span className={`text-[9px] font-semibold font-mono px-1.5 py-0.2 rounded border ${
                            member.role === 'coordinator' ? 'bg-purple-950/40 text-purple-400 border-purple-500/15' :
                            member.role === 'staff' ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/15' :
                            'bg-slate-850 text-slate-400 border-slate-700'
                          }`}>
                            {member.role === 'coordinator' ? 'Coordenador' : member.role === 'staff' ? 'Staff' : 'Voluntário'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[10px] text-slate-500 font-mono">Depto: <strong className="text-slate-400">{member.department}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] text-slate-500 font-mono">Presença: <strong className="text-slate-300">{member.attendance}%</strong></span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] text-slate-500 font-mono">Tarefas: <strong className="text-slate-300">{member.completedTasksCount}</strong></span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.badges.map((badgeName, bidx) => (
                            <span key={bidx} className="text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                              <Sparkles className="h-2 w-2 text-indigo-400" />
                              {badgeName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center gap-2 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Pontuação</div>
                          <div className="text-sm font-mono font-bold text-purple-400 flex items-center justify-end gap-1">
                            <Zap className="h-3.5 w-3.5 fill-current text-purple-400" />
                            {member.points} <span className="text-[10px] text-slate-500">XP</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-mono text-slate-500">Nota Operacional</span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => updateStaffRating(member.id, star)}
                                className={`p-0.5 transition-colors ${
                                  star <= Math.round(member.rating) ? "text-amber-400" : "text-slate-700 hover:text-slate-500"
                                }`}
                                title={`Avaliar com ${star} estrelas`}
                              >
                                <Star className="h-3.5 w-3.5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => rewardStaff(member.id)}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-slate-200 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        style={{ minHeight: "44px" }}
                      >
                        <UserCheck className="h-3.5 w-3.5 text-purple-400" />
                        Concluir Tarefa (+150 XP)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold font-display text-slate-200">Insígnias Disponíveis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Conquistas atribuídas por desempenho e assiduidade</p>
            </div>

            <div className="space-y-3.5">
              {availableBadges.map((badge) => {
                const IconComp = badge.icon;
                return (
                  <div key={badge.id} className="flex gap-3 items-start p-3 bg-slate-950 rounded-xl border border-slate-850">
                    <div className={`p-2 rounded-xl border shrink-0 ${badge.color}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{badge.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-purple-500/10 rounded-2xl p-5 space-y-3 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <Award className="h-8 w-8 text-purple-400 mx-auto" />
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">Campanha Especial de Engajamento</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Voluntários e Staff com mais de <strong>2000 XP</strong> ao final do evento receberão certificado oficial de elite assinado pela holding corporativa e bonificação técnica!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
