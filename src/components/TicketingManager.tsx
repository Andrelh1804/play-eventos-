import React, { useState } from "react";
import { 
  QrCode, 
  Plus, 
  Users, 
  Search, 
  CheckCircle, 
  XCircle, 
  Smartphone, 
  DollarSign,
  UserCheck,
  Wallet,
  UserPlus,
  Mail,
  CreditCard
} from "lucide-react";
import { TicketTier, TicketSale, Event } from "../types";

interface TicketingManagerProps {
  ticketTiers: TicketTier[];
  ticketSales: TicketSale[];
  events: Event[];
  activeEventId: string;
  addTicketTier: (tier: Omit<TicketTier, 'id'>) => void;
  addTicketSale: (sale: Omit<TicketSale, 'id'>) => void;
  toggleCheckIn: (saleId: string) => void;
}

export default function TicketingManager({
  ticketTiers,
  ticketSales,
  events,
  activeEventId,
  addTicketTier,
  addTicketSale,
  toggleCheckIn
}: TicketingManagerProps) {
  const [showAddTier, setShowAddTier] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [tierName, setTierName] = useState("");
  const [tierPrice, setTierPrice] = useState(100);
  const [tierCapacity, setTierCapacity] = useState(500);

  const [saleBuyerName, setSaleBuyerName] = useState("");
  const [saleBuyerEmail, setSaleBuyerEmail] = useState("");
  const [saleTierId, setSaleTierId] = useState("");
  const [salePaymentMethod, setSalePaymentMethod] = useState<TicketSale['paymentMethod']>("pix");

  const [searchQuery, setSearchQuery] = useState("");

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeTiers = ticketTiers.filter(t => t.eventId === activeEventId);
  const activeSales = ticketSales.filter(s => s.eventId === activeEventId);

  const filteredSales = activeSales.filter(sale => 
    sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierName) return;
    addTicketTier({
      eventId: activeEventId,
      name: tierName,
      price: Number(tierPrice),
      capacity: Number(tierCapacity),
      sold: 0
    });
    setTierName("");
    setTierPrice(100);
    setTierCapacity(500);
    setShowAddTier(false);
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleBuyerName || !saleBuyerEmail || !saleTierId) return;
    addTicketSale({
      eventId: activeEventId,
      tierId: saleTierId,
      buyerName: saleBuyerName,
      buyerEmail: saleBuyerEmail,
      timestamp: new Date().toISOString(),
      checkedIn: false,
      paymentMethod: salePaymentMethod
    });
    setSaleBuyerName("");
    setSaleBuyerEmail("");
    setSaleTierId("");
    setSalePaymentMethod("pix");
    setShowAddSale(false);
  };

  const getPaymentBadge = (method: TicketSale['paymentMethod']) => {
    switch (method) {
      case 'pix': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'credit_card': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const totalRevenue = activeTiers.reduce((acc, t) => acc + (t.sold * t.price), 0);
  const totalSold = activeTiers.reduce((acc, t) => acc + t.sold, 0);
  const totalCheckedIn = activeSales.filter(s => s.checkedIn).length;

  return (
    <div className="space-y-8" id="ticketing-manager-view">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">Ticketing & Controle de Acesso Enterprise</h2>
          <p className="text-xs text-slate-400 mt-0.5">Lotes de venda, registro de participantes, QR Code e check-in físico</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setShowAddSale(!showAddSale); setShowAddTier(false); }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            {showAddSale ? "Fechar" : "Registrar Participante"}
          </button>
          <button
            onClick={() => { setShowAddTier(!showAddTier); setShowAddSale(false); }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
          >
            <Plus className="h-4 w-4" />
            {showAddTier ? "Fechar Formulário" : "Criar Lote / Categoria"}
          </button>
        </div>
      </div>

      {showAddSale && (
        <form onSubmit={handleCreateSale} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Registrar Venda / Inscrição de Participante</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><UserPlus className="h-3 w-3" /> Nome Completo</label>
              <input
                type="text"
                value={saleBuyerName}
                onChange={(e) => setSaleBuyerName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><Mail className="h-3 w-3" /> E-mail do Participante</label>
              <input
                type="email"
                value={saleBuyerEmail}
                onChange={(e) => setSaleBuyerEmail(e.target.value)}
                placeholder="joao@email.com"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Categoria / Lote</label>
              <select
                value={saleTierId}
                onChange={(e) => setSaleTierId(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                required
              >
                <option value="">-- Selecionar Lote --</option>
                {activeTiers.map(t => (
                  <option key={t.id} value={t.id} disabled={t.sold >= t.capacity}>
                    {t.name} — R$ {t.price} ({t.capacity - t.sold} vagas restantes)
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1.5"><CreditCard className="h-3 w-3" /> Forma de Pagamento</label>
              <select
                value={salePaymentMethod}
                onChange={(e) => setSalePaymentMethod(e.target.value as TicketSale['paymentMethod'])}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="pix">PIX</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowAddSale(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl">Cancelar</button>
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs px-5 py-2 rounded-xl">
              Confirmar Registro
            </button>
          </div>
        </form>
      )}

      {showAddTier && (
        <form onSubmit={handleCreateTier} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Novo Lote de Ingressos/Inscrições</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1 sm:col-span-3">
              <label className="text-xs text-slate-400">Nome do Lote/Categoria</label>
              <input
                type="text"
                value={tierName}
                onChange={(e) => setTierName(e.target.value)}
                placeholder="Ex: Lote 1 - Área VIP"
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Preço do Ingresso (R$)</label>
              <input
                type="number"
                value={tierPrice}
                onChange={(e) => setTierPrice(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                min="0"
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs text-slate-400">Capacidade Máxima do Lote</label>
              <input
                type="number"
                value={tierCapacity}
                onChange={(e) => setTierCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="submit" className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl">
              Criar Lote Comercial
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg"><Users className="h-4 w-4 text-cyan-400" /></div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Total Inscritos</div>
            <div className="text-lg font-bold font-mono text-white">{totalSold}</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><UserCheck className="h-4 w-4 text-emerald-400" /></div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Credenciados</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{totalCheckedIn}</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg"><DollarSign className="h-4 w-4 text-indigo-400" /></div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">Receita Estimada</div>
            <div className="text-lg font-bold font-mono text-white">R$ {totalRevenue.toLocaleString("pt-BR")}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="ticketing-tiers-grid">
        {activeTiers.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-slate-500 text-xs">Nenhum lote cadastrado. Crie o primeiro lote de ingressos acima.</div>
        ) : (
          activeTiers.map((tier) => {
            const percentageSold = Math.round((tier.sold / tier.capacity) * 100);
            return (
              <div key={tier.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold font-display text-white leading-tight">{tier.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {tier.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-400 font-mono">R$ {tier.price}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Vendidos: <strong className="text-slate-200 font-mono">{tier.sold}</strong> / {tier.capacity}</span>
                    <span className="font-mono text-cyan-400 font-semibold">{percentageSold}%</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentageSold}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-950">
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3 text-emerald-400" /> Receita Estimada</span>
                  <span className="font-mono text-slate-300 font-semibold">R$ {(tier.sold * tier.price).toLocaleString("pt-BR")}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="checkin-panel">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-cyan-400" />
              Painel de Credenciamento & Check-In
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Controle de acesso presencial — registre check-in/out de cada participante</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="font-mono">{totalCheckedIn}/{activeSales.length} presentes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Estatísticas de Acesso</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Aguardando credenciamento:</span>
                <span className="font-mono text-amber-400 font-semibold">{activeSales.filter(s => !s.checkedIn).length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Credenciados com sucesso:</span>
                <span className="font-mono text-emerald-400 font-semibold">{totalCheckedIn}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total de inscritos:</span>
                <span className="font-mono text-slate-200 font-semibold">{activeSales.length}</span>
              </div>
              {activeSales.length > 0 && (
                <div className="pt-2">
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((totalCheckedIn / activeSales.length) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{Math.round((totalCheckedIn / activeSales.length) * 100)}% credenciados</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Recepção Integrada
              </div>
              <span className="text-[10px] font-mono text-slate-500">CANAL #01</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por participante, email ou ID do ticket..."
                className="w-full bg-slate-950 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Participante</th>
                      <th className="p-3.5">Categoria / Lote</th>
                      <th className="p-3.5 hidden sm:table-cell">Pagamento</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {filteredSales.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          {activeSales.length === 0 
                            ? "Nenhum participante registrado. Use o botão \"Registrar Participante\" para adicionar."
                            : "Nenhum participante encontrado para o filtro de busca."
                          }
                        </td>
                      </tr>
                    ) : (
                      filteredSales.map((sale) => {
                        const tier = ticketTiers.find(t => t.id === sale.tierId);
                        return (
                          <tr key={sale.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-200">{sale.buyerName}</p>
                              <p className="text-[10px] text-slate-500">{sale.buyerEmail}</p>
                            </td>
                            <td className="p-3.5 text-slate-300 font-medium">
                              {tier?.name || "Inscrição Geral"}
                            </td>
                            <td className="p-3.5 hidden sm:table-cell">
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase ${getPaymentBadge(sale.paymentMethod)}`}>
                                {sale.paymentMethod === 'credit_card' ? 'Cartão' : sale.paymentMethod === 'boleto' ? 'Boleto' : 'PIX'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {sale.checkedIn ? (
                                <div>
                                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Presente
                                  </span>
                                  {sale.checkedInAt && (
                                    <p className="text-[10px] text-slate-500 mt-0.5">{new Date(sale.checkedInAt).toLocaleTimeString("pt-BR")}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-500 font-medium">Aguardando</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => toggleCheckIn(sale.id)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                  sale.checkedIn 
                                    ? 'bg-rose-950 border-rose-500/20 text-rose-400 hover:bg-rose-900' 
                                    : 'bg-emerald-950 border-emerald-500/20 text-emerald-400 hover:bg-emerald-900'
                                }`}
                                style={{ minHeight: '44px', minWidth: '85px' }}
                              >
                                {sale.checkedIn ? 'Reverter' : 'Check-In'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
