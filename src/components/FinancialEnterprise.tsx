import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sliders, 
  PieChart, 
  Grid, 
  Percent, 
  FileSpreadsheet,
  Layers
} from "lucide-react";
import { Transaction, Event } from "../types";

interface FinancialEnterpriseProps {
  transactions: Transaction[];
  events: Event[];
  activeEventId: string;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

export default function FinancialEnterprise({
  transactions,
  events,
  activeEventId,
  addTransaction
}: FinancialEnterpriseProps) {
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txAmount, setTxAmount] = useState(1000);
  const [txCategory, setTxCategory] = useState("Marketing");
  const [txDescription, setTxDescription] = useState("");
  const [txCostCenter, setTxCostCenter] = useState("Marketing");

  // Payment Split state
  const [splitAmount, setSplitAmount] = useState(10000);
  const [splitProdPercent, setSplitProdPercent] = useState(70);
  const [splitVenuePercent, setSplitVenuePercent] = useState(20);
  const [splitTaxPercent, setSplitTaxPercent] = useState(10);

  const activeEvent = events.find(e => e.id === activeEventId);
  const activeTx = transactions.filter(t => t.eventId === activeEventId);

  // Financial calculations
  const totalIncome = activeTx.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = activeTx.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription || txAmount <= 0) return;
    addTransaction({
      eventId: activeEventId,
      type: txType,
      amount: Number(txAmount),
      category: txCategory,
      description: txDescription,
      date: new Date().toISOString().split('T')[0],
      centerOfCost: txCostCenter
    });
    setTxDescription("");
    setTxAmount(1000);
    setShowAddTx(false);
  };

  // Split calculations
  const prodSplitVal = (splitAmount * splitProdPercent) / 100;
  const venueSplitVal = (splitAmount * splitVenuePercent) / 100;
  const taxSplitVal = (splitAmount * splitTaxPercent) / 100;

  // DRE calculation values
  const grossReceita = totalIncome;
  const deductions = totalIncome * 0.05; // 5% simulated processing taxes
  const netReceita = grossReceita - deductions;
  const operacoesGerais = activeTx.filter(t => t.type === 'expense' && t.centerOfCost === 'Operações').reduce((acc, curr) => acc + curr.amount, 0);
  const infraestruturaGerais = activeTx.filter(t => t.type === 'expense' && t.centerOfCost === 'Infraestrutura').reduce((acc, curr) => acc + curr.amount, 0);
  const marketingGerais = activeTx.filter(t => t.type === 'expense' && (t.centerOfCost === 'Marketing' || t.centerOfCost === 'Comercial')).reduce((acc, curr) => acc + curr.amount, 0);
  const logisticaGerais = activeTx.filter(t => t.type === 'expense' && t.centerOfCost === 'Logística').reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalDespesasOperacionais = totalExpense;
  const ebitda = netReceita - totalDespesasOperacionais;

  return (
    <div className="space-y-8" id="financial-enterprise-view">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display">ERP Financeiro Enterprise</h2>
          <p className="text-xs text-slate-400 mt-0.5">Fluxo de caixa consolidado, DRE inteligente e split de pagamentos</p>
        </div>

        <button
          onClick={() => setShowAddTx(!showAddTx)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <Plus className="h-4 w-4" />
          {showAddTx ? "Fechar Lançamento" : "Novo Lançamento Financeiro"}
        </button>
      </div>

      {/* Add New Transaction Form */}
      {showAddTx && (
        <form onSubmit={handleCreateTx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">Nova Transação (Crédito / Débito)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Tipo de Lançamento</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    txType === 'income' 
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🟢 Receita (Crédito)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    txType === 'expense' 
                      ? 'bg-rose-950 border-rose-500 text-rose-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🔴 Despesa (Débito)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Valor (R$)</label>
              <input
                type="number"
                value={txAmount}
                onChange={(e) => setTxAmount(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Categoria</label>
              <select
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Venda Ingressos">Venda de Ingressos/Inscrições</option>
                <option value="Patrocínio">Cota de Patrocínio</option>
                <option value="Aluguel Estrutura">Aluguel de Infraestrutura</option>
                <option value="Segurança">Segurança & Limpeza</option>
                <option value="Marketing">Marketing / Tráfego pago</option>
                <option value="Locação Espaço">Aluguel do Espaço / Pavilhão</option>
                <option value="Catering">Catering e Alimentação</option>
                <option value="Atração">Cachê / Atração Artística</option>
                <option value="Outros">Outras Despesas</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Centro de Custos</label>
              <select
                value={txCostCenter}
                onChange={(e) => setTxCostCenter(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="Comercial">Comercial</option>
                <option value="Marketing">Marketing</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Operações">Operações</option>
                <option value="Logística">Logística</option>
                <option value="Jurídico">Jurídico</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Descrição Detalhada</label>
            <input
              type="text"
              value={txDescription}
              onChange={(e) => setTxDescription(e.target.value)}
              placeholder="Ex: Pagamento 50% de sinal de geradores de energia"
              className="w-full bg-slate-950 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      )}

      {/* Cashflow summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="cashflow-grid">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total de Receitas (Crédito)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><ArrowUpRight className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-bold font-mono text-white">R$ {totalIncome.toLocaleString("pt-BR")}</p>
          <p className="text-[10px] text-slate-500 mt-2">Soma acumulada de patrocínios e ingressos vendidos.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total de Despesas (Débito)</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400"><ArrowDownRight className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-bold font-mono text-white">R$ {totalExpense.toLocaleString("pt-BR")}</p>
          <p className="text-[10px] text-slate-500 mt-2">Catering, infraestrutura, segurança e licenças homologadas.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Saldo Consolidado</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"><DollarSign className="h-4 w-4" /></div>
          </div>
          <p className={`text-2xl font-bold font-mono ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            R$ {netBalance.toLocaleString("pt-BR")}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">Lucro líquido atual antes dos impostos tributários trimestrais.</p>
        </div>
      </div>

      {/* Lower section: DRE and Split Simulator side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="finance-split-dre">
        
        {/* Payment Split Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
              <PieChart className="h-4 w-4 text-cyan-400" />
              Simulador de Split de Pagamentos (Pix/Cartão)
            </h3>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded uppercase font-semibold">Gateway Ativo</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Valor Total da Venda a Dividir (R$)</label>
              <input
                type="number"
                value={splitAmount}
                onChange={(e) => setSplitAmount(Number(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 px-4 py-2 rounded-xl border border-slate-800 text-sm font-mono focus:outline-none"
                min="10"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Organizador %</label>
                <input
                  type="number"
                  value={splitProdPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSplitProdPercent(val);
                    setSplitVenuePercent(100 - val - splitTaxPercent);
                  }}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-center font-mono focus:outline-none"
                  max="100"
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Dono Espaço %</label>
                <input
                  type="number"
                  value={splitVenuePercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSplitVenuePercent(val);
                    setSplitProdPercent(100 - val - splitTaxPercent);
                  }}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-center font-mono focus:outline-none"
                  max="100"
                  min="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Taxa EventOS %</label>
                <input
                  type="number"
                  value={splitTaxPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSplitTaxPercent(val);
                    setSplitVenuePercent(100 - val - splitProdPercent);
                  }}
                  className="w-full bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-center font-mono focus:outline-none"
                  max="100"
                  min="0"
                />
              </div>
            </div>

            {/* Split visual diagram representation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/85 space-y-4">
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Projeção da Divisão no Pix / Checkout</p>
              
              <div className="h-6 w-full rounded-lg overflow-hidden flex">
                <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full text-center flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ width: `${splitProdPercent}%` }} title="Produtor">PROD</div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full text-center flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ width: `${splitVenuePercent}%` }} title="Espaço">ESPAÇO</div>
                <div className="bg-gradient-to-r from-purple-500 to-rose-500 h-full text-center flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ width: `${splitTaxPercent}%` }} title="Taxa">TAXA</div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-400">
                <div className="border-l-2 border-cyan-500 pl-2">
                  <div className="text-[10px] text-slate-500 uppercase">Organizador</div>
                  <strong className="text-slate-200">R$ {prodSplitVal.toLocaleString("pt-BR")}</strong>
                </div>
                <div className="border-l-2 border-indigo-500 pl-2">
                  <div className="text-[10px] text-slate-500 uppercase">Espaço/Venue</div>
                  <strong className="text-slate-200">R$ {venueSplitVal.toLocaleString("pt-BR")}</strong>
                </div>
                <div className="border-l-2 border-purple-500 pl-2">
                  <div className="text-[10px] text-slate-500 uppercase">Taxa EventOS</div>
                  <strong className="text-slate-200">R$ {taxSplitVal.toLocaleString("pt-BR")}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DRE (Demonstração do Resultado de Exercício) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200 font-display flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
                Demonstrativo de Resultado de Exercício (DRE)
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Julho/2026</span>
            </div>

            <div className="space-y-2 text-xs font-mono" id="dre-table">
              {/* Row 1 */}
              <div className="flex justify-between items-center py-2 border-b border-slate-950">
                <span className="text-slate-300 font-semibold uppercase">1. Receita Bruta Global</span>
                <span className="text-emerald-400 font-bold">R$ {grossReceita.toLocaleString("pt-BR")}</span>
              </div>
              
              {/* Row 2 */}
              <div className="flex justify-between items-center py-1.5 text-slate-400 pl-4 border-b border-slate-950/40">
                <span>(-) Custos de Processamento & Gateway</span>
                <span>R$ {deductions.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 3 */}
              <div className="flex justify-between items-center py-2 border-b border-slate-950">
                <span className="text-slate-300 font-semibold uppercase">2. Receita Líquida</span>
                <span className="text-slate-200 font-bold">R$ {netReceita.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 4 */}
              <div className="flex justify-between items-center py-1.5 text-slate-400 pl-4 border-b border-slate-950/40">
                <span>(-) Despesas de Operações Gerais</span>
                <span>R$ {operacoesGerais.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 5 */}
              <div className="flex justify-between items-center py-1.5 text-slate-400 pl-4 border-b border-slate-950/40">
                <span>(-) Aluguéis de Infra & Som/Luz</span>
                <span>R$ {infraestruturaGerais.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 6 */}
              <div className="flex justify-between items-center py-1.5 text-slate-400 pl-4 border-b border-slate-950/40">
                <span>(-) Marketing, Tráfego & Divulgação</span>
                <span>R$ {marketingGerais.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 7 */}
              <div className="flex justify-between items-center py-2 border-b border-slate-950">
                <span className="text-slate-300 font-semibold uppercase">3. Total Custos Operacionais</span>
                <span className="text-slate-200 font-bold">R$ {totalDespesasOperacionais.toLocaleString("pt-BR")}</span>
              </div>

              {/* Row 8 */}
              <div className="flex justify-between items-center py-2.5 mt-2 bg-slate-950 px-3 rounded-lg border border-slate-800">
                <span className="text-slate-200 font-bold uppercase">Resultado Operacional (EBITDA)</span>
                <span className={`font-bold font-mono text-sm ${ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {ebitda.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center mt-4">
            Relatório consolidado sob conformidade com a Lei de Responsabilidade Fiscal e DRE simplificado.
          </div>
        </div>

      </div>
    </div>
  );
}
