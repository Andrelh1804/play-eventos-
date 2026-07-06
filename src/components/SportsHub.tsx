import React, { useState } from "react";
import { 
  Award, 
  Plus, 
  Search, 
  CheckCircle, 
  FileText, 
  Timer, 
  Printer, 
  Download, 
  Shirt,
  X,
  Sparkles
} from "lucide-react";
import { Athlete, Event } from "../types";

interface SportsHubProps {
  athletes: Athlete[];
  events: Event[];
  activeEventId: string;
  addAthlete: (ath: Omit<Athlete, 'id'>) => void;
  updateAthleteStatus: (id: string, status: Athlete['status'], finishTime?: string) => void;
}

export default function SportsHub({
  athletes,
  events,
  activeEventId,
  addAthlete,
  updateAthleteStatus
}: SportsHubProps) {
  const [showAddAthlete, setShowAddAthlete] = useState(false);
  const [athName, setAthName] = useState("");
  const [athBib, setAthBib] = useState("");
  const [athCategory, setAthCategory] = useState("Speed Elite");
  const [athAgeGroup, setAthAgeGroup] = useState("30-39 anos");
  const [athShirtSize, setAthShirtSize] = useState<Athlete['shirtSize']>("M");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Selected athlete for printable certificate modal
  const [selectedAthleteIdForCert, setSelectedAthleteIdForCert] = useState<string | null>(null);

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeAthletes = athletes.filter(a => a.eventId === activeEventId);

  const filteredAthletes = activeAthletes.filter(ath => 
    ath.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ath.bib.includes(searchQuery)
  );

  const handleCreateAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athName || !athBib) return;
    addAthlete({
      eventId: activeEventId,
      name: athName,
      bib: athBib,
      category: athCategory,
      ageGroup: athAgeGroup,
      shirtSize: athShirtSize,
      status: "registered"
    });
    setAthName("");
    setAthBib("");
    setShowAddAthlete(false);
  };

  const triggerSimulatedFinish = (athId: string) => {
    // Generate random realistic speed finish time: "01:XX:YY"
    const minutes = Math.floor(Math.random() * 20) + 10; // 10 to 29 mins
    const seconds = Math.floor(Math.random() * 60);
    const timeStr = `01:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateAthleteStatus(athId, 'finished', timeStr);
  };

  const activeCertAthlete = athletes.find(a => a.id === selectedAthleteIdForCert);

  return (
    <div className="space-y-8" id="sports-hub-view">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Eventos Esportivos & Cronometragem</h2>
          <p className="text-xs text-slate-400 mt-0.5">Inscrição de corredores/atletas, categorias, chips RFID e emissão de certificados</p>
        </div>

        <button
          onClick={() => setShowAddAthlete(!showAddAthlete)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="h-4 w-4" />
          {showAddAthlete ? "Fechar Formulário" : "Inscrever Atleta Manual"}
        </button>
      </div>

      {/* Add Athlete Form */}
      {showAddAthlete && (
        <form onSubmit={handleCreateAthlete} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-3xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Nova Inscrição de Atleta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Nome Completo do Atleta</label>
              <input
                type="text"
                value={athName}
                onChange={(e) => setAthName(e.target.value)}
                placeholder="Ex: Bruna Maria Albuquerque"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Número do Peito / Chip ID (Bib)</label>
              <input
                type="text"
                value={athBib}
                onChange={(e) => setAthBib(e.target.value)}
                placeholder="Ex: 512"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Categoria</label>
              <input
                type="text"
                value={athCategory}
                onChange={(e) => setAthCategory(e.target.value)}
                placeholder="Ex: Feminino Elite"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Faixa Etária</label>
              <input
                type="text"
                value={athAgeGroup}
                onChange={(e) => setAthAgeGroup(e.target.value)}
                placeholder="Ex: 18-29 anos"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs text-slate-400">Tamanho da Camiseta do Kit</label>
              <div className="flex gap-2">
                {(['P', 'M', 'G', 'GG'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setAthShirtSize(sz)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                      athShirtSize === sz 
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Tamanho {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl"
            >
              Inscrever Atleta
            </button>
          </div>
        </form>
      )}

      {/* Athletes ledger display */}
      <div className="space-y-4">
        {activeEvent?.category === 'sports' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar atleta por nome ou número do peito (Bib)..."
                  className="w-full bg-slate-950 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                        <th className="p-3.5">Bib / Nome</th>
                        <th className="p-3.5">Categoria / Faixa</th>
                        <th className="p-3.5 text-center">Camisa Kit</th>
                        <th className="p-3.5">Status Telemetria</th>
                        <th className="p-3.5 text-right">Ação Operador</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {filteredAthletes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">Nenhum atleta inscrito encontrado.</td>
                        </tr>
                      ) : (
                        filteredAthletes.map((ath) => (
                          <tr key={ath.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-900 text-slate-300 font-bold px-2 py-1 rounded font-mono border border-slate-800 text-[11px] leading-none shrink-0">#{ath.bib}</span>
                                <div>
                                  <p className="font-semibold text-slate-200">{ath.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <p className="text-slate-300 font-medium">{ath.category}</p>
                              <p className="text-[10px] text-slate-500">{ath.ageGroup}</p>
                            </td>
                            <td className="p-3.5 text-center font-mono">
                              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
                                <Shirt className="h-3 w-3 text-cyan-400" />
                                {ath.shirtSize}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {ath.status === 'registered' && (
                                <span className="text-slate-500 font-medium">Inscrito (Pendente Kit)</span>
                              )}
                              {ath.status === 'checked_in' && (
                                <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                                  <Timer className="h-3.5 w-3.5 animate-pulse" />
                                  Na Pista / Ativo
                                </span>
                              )}
                              {ath.status === 'finished' && (
                                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Concluído ({ath.finishTime})
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              {ath.status === 'registered' && (
                                <button
                                  onClick={() => updateAthleteStatus(ath.id, 'checked_in')}
                                  className="text-[10px] bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 px-2.5 py-1.5 rounded-lg font-bold"
                                  style={{ minHeight: '44px' }}
                                >
                                  Entregar Kit
                                </button>
                              )}
                              {ath.status === 'checked_in' && (
                                <button
                                  onClick={() => triggerSimulatedFinish(ath.id)}
                                  className="text-[10px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-2.5 py-1.5 rounded-lg"
                                  style={{ minHeight: '44px' }}
                                >
                                  Cruzar Chegada
                                </button>
                              )}
                              {ath.status === 'finished' && (
                                <button
                                  onClick={() => setSelectedAthleteIdForCert(ath.id)}
                                  className="text-[10px] bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 inline-flex"
                                  style={{ minHeight: '44px' }}
                                >
                                  <Award className="h-3.5 w-3.5 text-indigo-400" />
                                  Emitir Certificado
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Stats sidebar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300 border-b border-slate-800 pb-2">Resultados e Quadro</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Total de Atletas Inscritos:</span>
                  <strong className="text-slate-200 font-mono text-sm">{activeAthletes.length}</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Cruzaram a Chegada (Finished):</span>
                  <strong className="text-emerald-400 font-mono text-sm">{activeAthletes.filter(a => a.status === 'finished').length}</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-400">Ainda correndo na pista:</span>
                  <strong className="text-cyan-400 font-mono text-sm">{activeAthletes.filter(a => a.status === 'checked_in').length}</strong>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <Award className="h-10 w-10 text-slate-600 opacity-40 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-300">Este módulo é voltado para Eventos Esportivos.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">Para experimentar a telemetria, resultados e emissor de certificados, selecione o evento <strong>"Copa Play+ de Ciclismo 2026"</strong> no cabeçalho superior.</p>
          </div>
        )}
      </div>

      {/* Render Certificate Modal overlay if selected */}
      {selectedAthleteIdForCert && activeCertAthlete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 max-w-xl w-full relative space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Close button */}
            <button 
              onClick={() => setSelectedAthleteIdForCert(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Certificate frame layout */}
            <div className="border-4 border-double border-indigo-950 rounded-2xl p-6 bg-slate-950 space-y-6 text-center relative overflow-hidden" id="print-certificate-area">
              {/* Decorative design stamps */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>

              <div className="space-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10 mb-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xs text-indigo-400 uppercase tracking-widest leading-none">Certificado de Desempenho</h3>
                <p className="text-[10px] text-slate-500 font-mono">PLAY+EVENTOS EventOS Enterprise</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs text-slate-400">Certificamos com louvor que o atleta</p>
                <h4 className="text-lg font-bold text-white font-display uppercase tracking-tight">{activeCertAthlete.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  concluiu com sucesso o circuito da <strong>{activeEvent?.name}</strong>, cruzando a linha de chegada oficial do percurso.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-900 pt-4 font-mono text-xs text-slate-300">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase">Tempo Oficial</p>
                  <strong className="text-emerald-400 font-semibold">{activeCertAthlete.finishTime}</strong>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase">Categoria</p>
                  <strong className="text-slate-200 font-semibold truncate block">{activeCertAthlete.category}</strong>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase">Número (Bib)</p>
                  <strong className="text-slate-200 font-semibold">#{activeCertAthlete.bib}</strong>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                <span>Assinado digitalmente por {activeEvent?.venue} em {activeEvent?.date}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end font-mono">
              <button
                onClick={() => {
                  alert("Preparando PDF e enviando para o email registrado do atleta...");
                }}
                className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition-all font-semibold"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                Baixar PDF
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs px-4 py-2 rounded-xl transition-all font-semibold"
              >
                <Printer className="h-4 w-4" />
                Imprimir Certificado
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
