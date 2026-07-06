import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ListTodo, 
  Plus, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  User, 
  AlertCircle,
  TrendingUp,
  Inbox
} from "lucide-react";
import { Task, Event } from "../types";

interface AgendaScheduleProps {
  tasks: Task[];
  events: Event[];
  activeEventId: string;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  deleteTask: (id: string) => void;
}

export default function AgendaSchedule({
  tasks,
  events,
  activeEventId,
  addTask,
  updateTaskStatus,
  deleteTask
}: AgendaScheduleProps) {
  const [activeView, setActiveView] = useState<'kanban' | 'calendar' | 'timeline'>('kanban');
  const [showAddTask, setShowAddTask] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<Task['priority']>("medium");

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeTasks = tasks.filter(t => t.eventId === activeEventId);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addTask({
      eventId: activeEventId,
      title,
      description,
      status: "pending",
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      assignee: assignee || "Não atribuído",
      priority
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    setAssignee("");
    setPriority("medium");
    setShowAddTask(false);
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Timeline items calculation relative to event date
  const timelineDates = [
    { label: "Planejamento Prévio (90 dias antes)", offset: -90 },
    { label: "Divulgação Ativa (60 dias antes)", offset: -60 },
    { label: "Produção Crítica (30 dias antes)", offset: -30 },
    { label: "Montagem Local (1 dia antes)", offset: -1 },
    { label: "Execução Oficial (Dia D)", offset: 0 }
  ];

  return (
    <div className="space-y-6" id="agenda-schedule-view">
      {/* Tab toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Cronograma Operacional & Kanban</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestão tática de entregas e tarefas da equipe</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveView('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'kanban' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanban de Tarefas
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'timeline' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gantt Simplificado
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Calendário Integrado
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {activeView === 'kanban' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick task trigger */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/15"
            >
              <Plus className="h-4 w-4" />
              {showAddTask ? "Cancelar Nova Tarefa" : "Criar Nova Tarefa"}
            </button>
          </div>

          {showAddTask && (
            <form onSubmit={handleCreateTask} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Registrar Atividade Operacional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs text-slate-400">Título da Tarefa</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Contratar grades de isolamento"
                    className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Data Limite de Entrega</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Responsável (Staff)</label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Nome da pessoa ou departamento"
                    className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs text-slate-400">Prioridade</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p as Task['priority'])}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border ${
                          priority === p 
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {p === 'high' ? '⚡ Alta' : p === 'medium' ? 'Média' : 'Baixa'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs text-slate-400">Detalhamento e Instruções</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Instruções para a equipe de staff realizar a tarefa com segurança..."
                    className="w-full h-16 bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl"
                >
                  Registrar Atividade
                </button>
              </div>
            </form>
          )}

          {/* Kanban Board columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['pending', 'in_progress', 'completed'] as const).map((status) => {
              const columnTasks = activeTasks.filter(t => t.status === status);
              const columnTitle = status === 'pending' ? 'Pendente' : status === 'in_progress' ? 'Em Andamento' : 'Concluído';
              const columnColor = status === 'pending' ? 'border-slate-800' : status === 'in_progress' ? 'border-cyan-500/30' : 'border-emerald-500/30';

              return (
                <div key={status} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          status === 'pending' ? 'bg-slate-400' : status === 'in_progress' ? 'bg-cyan-400' : 'bg-emerald-400'
                        }`}></span>
                        <h3 className="text-sm font-semibold text-slate-200 font-display">{columnTitle}</h3>
                      </div>
                      <span className="text-[11px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full font-semibold border border-slate-800">{columnTasks.length}</span>
                    </div>

                    <div className="space-y-3">
                      {columnTasks.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                          <Inbox className="h-6 w-6 opacity-30" />
                          <span>Nenhuma atividade nesta fase</span>
                        </div>
                      ) : (
                        columnTasks.map((tsk) => (
                          <div key={tsk.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm group">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getPriorityBadge(tsk.priority)}`}>
                                {tsk.priority === 'high' ? 'ALTA' : tsk.priority === 'medium' ? 'MÉDIA' : 'BAIXA'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {tsk.dueDate}
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors leading-normal">{tsk.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{tsk.description}</p>
                            
                            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400 border-t border-slate-900 pt-2">
                              <User className="h-3 w-3 text-slate-500" />
                              <span className="truncate">{tsk.assignee}</span>
                            </div>

                            {/* Control Actions to move task */}
                            <div className="mt-3 flex items-center gap-1.5 justify-end">
                              {status === 'pending' && (
                                <button
                                  onClick={() => updateTaskStatus(tsk.id, 'in_progress')}
                                  className="text-[10px] bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1"
                                >
                                  Iniciar <ArrowRight className="h-3 w-3" />
                                </button>
                              )}
                              {status === 'in_progress' && (
                                <button
                                  onClick={() => updateTaskStatus(tsk.id, 'completed')}
                                  className="text-[10px] bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1"
                                >
                                  Concluir <CheckCircle className="h-3 w-3 text-emerald-400" />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteTask(tsk.id)}
                                className="text-[10px] text-slate-600 hover:text-rose-400 transition-colors px-1 ml-auto"
                                title="Remover atividade"
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Gantt Simplificado (Timeline View) */}
      {activeView === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Gantt de Produção do Evento</h3>
            <p className="text-xs text-slate-400 mt-1">Marco temporal de execução regressiva com base na data do evento: <strong>{activeEvent?.date}</strong></p>
          </div>

          <div className="space-y-6 relative border-l border-slate-800 pl-4 ml-2">
            {timelineDates.map((item, i) => {
              // Filter active tasks that fall under this range
              const isEventDay = item.offset === 0;
              return (
                <div key={i} className="relative group">
                  {/* Timeline bullet */}
                  <span className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    isEventDay ? 'bg-rose-500 animate-pulse' : 'bg-cyan-500'
                  }`}></span>

                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400">{item.label}</span>
                    <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3 max-w-2xl">
                      <p className="text-xs text-slate-400 leading-normal font-medium">Requisitos Recomendados:</p>
                      <ul className="text-xs text-slate-400 list-disc list-inside mt-1.5 space-y-1">
                        {item.offset === -90 && <li>Definição do plano comercial e precificação dos primeiros lotes.</li>}
                        {item.offset === -60 && <li>Início da divulgação em redes e liberação de patrocínios no pipeline.</li>}
                        {item.offset === -30 && <li>Assinatura de contratos críticos com fornecedores homologados.</li>}
                        {item.offset === -1 && <li>Vistoria técnica de som, luz, LED, internet dedicada e geradores de contingência.</li>}
                        {item.offset === 0 && <li>Check-in de participantes por QR Code/RFID, monitoramento COE ativo e transmissão.</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendário Integrado */}
      {activeView === 'calendar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Calendário Integrado</h3>
              <p className="text-xs text-slate-400 mt-1">Visualização mensal de prazos de staff e datas do evento</p>
            </div>
            <span className="text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl">Julho 2026</span>
          </div>

          {/* Simple Mock Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
              <div key={d} className="text-slate-500 font-semibold py-2">{d}</div>
            ))}
            {/* Empty days padding */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-4 bg-slate-950/20 border border-slate-950 rounded-lg min-h-[60px] opacity-20"></div>
            ))}
            {/* Days 1 to 28 */}
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              const hasEvent = day === 15; // Event 1 is July 15
              const hasTask = day === 10 || day === 12;

              return (
                <div key={day} className={`p-2 bg-slate-950 border border-slate-900 rounded-lg min-h-[60px] flex flex-col justify-between items-center transition-all ${
                  hasEvent ? 'border-cyan-500 bg-cyan-950/15' : 'hover:border-slate-800'
                }`}>
                  <span className={`text-xs font-semibold ${hasEvent ? 'text-cyan-400' : 'text-slate-400'}`}>{day}</span>
                  
                  {hasEvent && (
                    <span className="text-[8px] bg-cyan-500 text-white leading-none font-sans px-1 py-0.5 rounded truncate w-full mt-1 font-semibold block">CICLISMO PRO</span>
                  )}
                  {hasTask && (
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse mt-1" title="Prazo de atividade de staff"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
