import React, { useState } from "react";
import { 
  Users, 
  Briefcase, 
  Plus, 
  ChevronRight, 
  CheckCircle, 
  FileText, 
  PenTool, 
  TrendingUp, 
  DollarSign,
  Smartphone,
  CheckSquare,
  Sparkles
} from "lucide-react";
import { CRMContact, Contract } from "../types";

interface CRMComercialProps {
  contacts: CRMContact[];
  contracts: Contract[];
  addContact: (contact: Omit<CRMContact, 'id'>) => void;
  signContract: (contractId: string) => void;
}

export default function CRMComercial({
  contacts,
  contracts,
  addContact,
  signContract
}: CRMComercialProps) {
  const [showAddContact, setShowAddContact] = useState(false);
  const [cName, setCName] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cRole, setCRole] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cStatus, setCStatus] = useState<CRMContact['status']>("lead");
  const [cValue, setCValue] = useState(25000);
  const [cType, setCType] = useState<CRMContact['type']>("sponsor");

  // Selected contract for electronic signature drawer
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [signedName, setSignedName] = useState("");
  const [isSigning, setIsSigning] = useState(false);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cCompany) return;
    addContact({
      name: cName,
      company: cCompany,
      role: cRole || "Representante",
      email: cEmail || "contato@empresa.com",
      phone: cPhone || "(11) 99999-9999",
      status: cStatus,
      value: Number(cValue),
      type: cType
    });
    // Clear form
    setCName("");
    setCCompany("");
    setCRole("");
    setCEmail("");
    setCPhone("");
    setCStatus("lead");
    setCValue(25000);
    setCType("sponsor");
    setShowAddContact(false);
  };

  const [signSuccess, setSignSuccess] = useState(false);

  const handleExecuteSignature = () => {
    if (!selectedContractId || !signedName) {
      alert("Por favor digite o nome completo para assinar eletronicamente.");
      return;
    }
    signContract(selectedContractId);
    setSignSuccess(true);
    setIsSigning(false);
    setSignedName("");
    setTimeout(() => {
      setSelectedContractId(null);
      setSignSuccess(false);
    }, 3000);
  };

  const pipelineColumns = [
    { id: 'lead', label: 'Lead / Prospecção', color: 'border-slate-800 text-slate-400' },
    { id: 'contacted', label: 'Contato Realizado', color: 'border-cyan-500/20 text-cyan-400' },
    { id: 'negotiation', label: 'Proposta / Negociação', color: 'border-amber-500/20 text-amber-400' },
    { id: 'signed', label: 'Fechado / Ativo', color: 'border-emerald-500/20 text-emerald-400' }
  ] as const;

  const currentSigningContract = contracts.find(c => c.id === selectedContractId);

  return (
    <div className="space-y-8" id="crm-view">
      {/* Overview section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">CRM Comercial & Contratos Enterprise</h2>
          <p className="text-xs text-slate-400 mt-0.5">Pipeline de patrocinadores, propostas ativas e assinatura digital</p>
        </div>

        <button
          onClick={() => setShowAddContact(!showAddContact)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="h-4 w-4" />
          {showAddContact ? "Fechar Form" : "Novo Lead Comercial"}
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddContact && (
        <form onSubmit={handleCreateContact} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-3xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Registrar Contato / Patrocinador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Nome do Contato</label>
              <input
                type="text"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Ex: Carlos Ghosn"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Empresa / Instituição</label>
              <input
                type="text"
                value={cCompany}
                onChange={(e) => setCCompany(e.target.value)}
                placeholder="Ex: Coca-Cola Brasil"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Cargo</label>
              <input
                type="text"
                value={cRole}
                onChange={(e) => setCRole(e.target.value)}
                placeholder="Ex: Gerente de Eventos"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Valor Estimado do Contrato (R$)</label>
              <input
                type="number"
                value={cValue}
                onChange={(e) => setCValue(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
                min="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">E-mail</label>
              <input
                type="email"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                placeholder="carlos@empresa.com"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Celular / WhatsApp</label>
              <input
                type="text"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Tipo</label>
              <select
                value={cType}
                onChange={(e) => setCType(e.target.value as CRMContact['type'])}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm cursor-pointer"
              >
                <option value="sponsor">Patrocinador</option>
                <option value="contractor">Contratante</option>
                <option value="partner">Parceiro Institucional</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Fase Atual Pipeline</label>
              <select
                value={cStatus}
                onChange={(e) => setCStatus(e.target.value as CRMContact['status'])}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm cursor-pointer"
              >
                <option value="lead">Lead / Prospecção</option>
                <option value="contacted">Contato Realizado</option>
                <option value="negotiation">Proposta / Negociação</option>
                <option value="signed">Contrato Assinado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all"
            >
              Registrar no CRM
            </button>
          </div>
        </form>
      )}

      {/* Kanban Pipeline Display */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">Pipeline de Vendas & Captação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="crm-pipeline">
          {pipelineColumns.map((col) => {
            const colContacts = contacts.filter(c => c.status === col.id);
            const colSum = colContacts.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div key={col.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-[11px] font-bold font-display text-slate-200">{col.label}</span>
                    <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded-full font-semibold border border-slate-800">{colContacts.length}</span>
                  </div>

                  <div className="space-y-2">
                    {colContacts.map((con) => (
                      <div key={con.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2 hover:border-slate-700 transition-all">
                        <div>
                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{con.type === 'sponsor' ? 'PATROCÍNIO' : 'PARCERIA'}</div>
                          <strong className="text-xs text-slate-200 block font-semibold leading-tight">{con.company}</strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{con.name} ({con.role})</span>
                        </div>

                        {con.value > 0 && (
                          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-semibold border-t border-slate-900 pt-1.5 mt-2">
                            <span>Estimado:</span>
                            <span>R$ {con.value.toLocaleString("pt-BR")}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800/60 pt-2.5 mt-4 text-right">
                  <span className="text-[10px] text-slate-500 font-mono">Total: </span>
                  <strong className="text-xs font-mono text-slate-300">R$ {colSum.toLocaleString("pt-BR")}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contract Signature Module */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="contracts-module">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-cyan-400" />
              Gestão de Contratos & Assinatura Eletrônica (White-Label)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Termos, fornecedores e parcerias com validade jurídica</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Assinatura Segura</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contracts list */}
          <div className="lg:col-span-2 space-y-3">
            {contracts.map((ctr) => (
              <div key={ctr.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded leading-none border uppercase ${
                      ctr.status === 'signed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/10' : 'bg-amber-950 text-amber-400 border-amber-500/10'
                    }`}>
                      {ctr.status === 'signed' ? 'Assinado' : 'Pendente Assinatura'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Contrato: {ctr.id}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 leading-tight">{ctr.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Parte: {ctr.partyName} ({ctr.partyType}) • Valor: R$ {ctr.value.toLocaleString("pt-BR")}</p>
                </div>

                <div className="flex gap-2 self-stretch sm:self-auto shrink-0">
                  <button
                    onClick={() => setSelectedContractId(ctr.id)}
                    className="flex-1 sm:flex-initial text-[10px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-medium px-3 py-2 rounded-lg text-center"
                  >
                    Visualizar Termos
                  </button>
                  {ctr.status !== 'signed' && (
                    <button
                      onClick={() => {
                        setSelectedContractId(ctr.id);
                        setIsSigning(true);
                      }}
                      className="flex-1 sm:flex-initial text-[10px] bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1"
                    >
                      <PenTool className="h-3 w-3" />
                      Assinar Digital
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Electronic Signature Pad Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[250px]">
            {signSuccess ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4 space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">Contrato Assinado com Sucesso</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">O contrato foi marcado como assinado e registrado no sistema.</p>
              </div>
            ) : selectedContractId ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest mb-1">
                    {isSigning ? 'Assinatura Eletrônica' : 'Termos do Contrato'}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-semibold leading-tight line-clamp-1">{currentSigningContract?.title}</p>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 max-h-[140px] overflow-y-auto text-[11px] text-slate-400 leading-relaxed mt-2.5">
                    {currentSigningContract?.content}
                  </div>
                </div>

                {isSigning ? (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-mono uppercase">Digite o Nome Completo para Assinar</label>
                      <input
                        type="text"
                        value={signedName}
                        onChange={(e) => setSignedName(e.target.value)}
                        placeholder="Ex: Carlos Ghosn de Souza"
                        className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
                      />
                    </div>

                    {/* Virtual pad box */}
                    <div className="h-16 w-full border border-dashed border-slate-800 rounded-lg bg-slate-900/60 p-2 flex items-center justify-center relative select-none">
                      {signedName ? (
                        <span className="font-serif italic text-lg text-slate-300 select-none tracking-wide">{signedName}</span>
                      ) : (
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Sua assinatura aparecerá aqui</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsSigning(false);
                          setSignedName("");
                        }}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleExecuteSignature}
                        className="flex-1 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSigning(true)}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold mt-4"
                  >
                    Ir para Assinatura
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                <FileText className="h-8 w-8 text-slate-600 opacity-40 mb-3" />
                <p className="text-xs text-slate-400 font-medium">Nenhum contrato selecionado</p>
                <p className="text-[10px] text-slate-500 leading-normal mt-1.5">Clique em "Visualizar Termos" ou "Assinar" em qualquer contrato ao lado para acionar o painel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
