import React, { useState } from "react";
import { 
  Leaf, Scale, ShieldCheck, Percent, FileText, CheckCircle2, Award, Plus, 
  HelpCircle, Sparkles, Database, Calculator, RefreshCw, Layers
} from "lucide-react";

interface EsgGovModuleProps {
  activeEvent: any;
}

export default function EsgGovModule({ activeEvent }: EsgGovModuleProps) {
  // ESG indicator state
  const [wasteRecycled, setWasteRecycled] = useState<number>(1450); // Kg
  const [co2Offset, setCo2Offset] = useState<number>(85); // %
  const [waterSaved, setWaterSaved] = useState<number>(8500); // Litres

  // Fiscal Calculator State
  const [ticketTierPrice, setTicketTierPrice] = useState<number>(150); // standard ticket price BRL
  const [ticketQty, setTicketQty] = useState<number>(2000); // qty sold
  const [issRate, setIssRate] = useState<number>(5); // ISS local tax % (default 5)
  const [corporateRetention, setCorporateRetention] = useState<number>(1.5); // ICMS / IRRF retention %

  // Contracts & Insurance Policies state
  const [contracts, setContracts] = useState([
    { id: "c-101", vendor: "Ambulâncias UTI Vida", type: "Prestação Serviços", expiry: "2026-08-30", insurancePolicy: "POL-AMB-99821", status: "Vigente" },
    { id: "c-102", vendor: "Prefeitura Municipal (CET)", type: "Alvará Trânsito", expiry: "2026-07-28", insurancePolicy: "POL-CIVIL-0021", status: "Vigente" },
    { id: "c-103", vendor: "Som & Estruturas Gid", type: "Locação Equipamentos", expiry: "2026-07-15", insurancePolicy: "POL-EQUIP-1102", status: "Em Assinatura" },
  ]);

  // Calculations for Fiscal module
  const grossRevenue = ticketTierPrice * ticketQty;
  const calculatedIss = grossRevenue * (issRate / 100);
  const calculatedRetention = grossRevenue * (corporateRetention / 100);
  const netRevenue = grossRevenue - calculatedIss - calculatedRetention;

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="esg-gov-container">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL A: GOVERNANÇA ESG INDICATORS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="h-4 w-4" />
              Painel de Sustentabilidade & Indicadores ESG
            </h4>
            <span className="text-[10px] font-mono text-emerald-400">CERTIFICADO BRONZE</span>
          </div>

          <p className="text-xs text-slate-400">Monitoramento e auditoria de resíduos, pegada de carbono e inclusão de acessibilidade:</p>

          <div className="space-y-4">
            {/* Carbon Offset Slider represent */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Compensação Carbono Neutro</span>
                <strong className="text-teal-400">{co2Offset}% Compensado</strong>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-teal-500 h-full transition-all" style={{ width: `${co2Offset}%` }}></div>
              </div>
            </div>

            {/* Recycling weight counter */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Lixo Coletado e Reciclado:</span>
                <strong className="text-emerald-400 font-mono">{wasteRecycled.toLocaleString()} Kg</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setWasteRecycled(prev => prev + 250);
                    setCo2Offset(prev => Math.min(100, prev + 3));
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded py-1.5 text-[10px] font-mono text-slate-300"
                >
                  Pesar +250 Kg de Resíduos Reciclados
                </button>
              </div>
            </div>

            {/* Water Savings */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Reuso Controlado de Água:</span>
                <strong className="text-cyan-400">{waterSaved.toLocaleString()} L</strong>
              </div>
              <span className="text-[9px] text-slate-500 block leading-none font-mono">
                ✓ Copos reutilizáveis economizaram cerca de 1.8 copos descartáveis/pax
              </span>
            </div>

            {/* Diversity, inclusion & Accessibility checks */}
            <div className="space-y-2 pt-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Auditoria de Acessibilidade (ISO 20121)</span>
              {[
                { label: "Plano de Rotas de Cadeirantes mapeado", checked: true },
                { label: "Intérpretes de Libras contratados para palco", checked: true },
                { label: "Sinalização tátil instalada nos portais", checked: false },
              ].map((chk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <span className={chk.checked ? "text-emerald-400 font-bold" : "text-amber-500"}>
                    {chk.checked ? "✓" : "⚡"}
                  </span>
                  <span>{chk.label}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* PANEL B: CENTRAL JURÍDICA & SEGUROS APÓLICES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-indigo-400" />
              Central Jurídica & Apólices de Seguros
            </h4>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-1.5 rounded">
              GOVERNANÇA
            </span>
          </div>

          <p className="text-xs text-slate-400">Armazenamento de licenças, alvarás, conformidade de certidões e vigências contratuais:</p>

          <div className="space-y-2">
            {contracts.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-2">
                <div className="flex justify-between">
                  <strong className="text-slate-200">{c.vendor}</strong>
                  <span className={`text-[9px] font-mono font-bold px-1 rounded uppercase ${
                    c.status === 'Vigente' ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                  }`}>
                    {c.status}
                  </span>
                </div>
                
                <div className="text-[10px] text-slate-400 space-y-1 font-mono leading-none">
                  <div>Tipo: {c.type}</div>
                  <div>Seguro Responsabilidade: {c.insurancePolicy}</div>
                  <div className="text-slate-500">Expira em: {c.expiry}</div>
                </div>

                {c.status === 'Em Assinatura' && (
                  <div className="text-right pt-1.5 border-t border-slate-900">
                    <button 
                      onClick={() => {
                        setContracts(prev => prev.map(con => con.id === c.id ? { ...con, status: 'Vigente' } : con));
                        alert(`Contrato com "${c.vendor}" assinado e registrado sob cadeia de blocos de auditoria legal.`);
                      }}
                      className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-mono"
                    >
                      Assinar Digitalmente (Token)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-500 leading-normal font-mono">
            <strong>Vigência Geral Seguros:</strong> Apólice Coletiva de Acidentes Pessoais para Participantes (Bradesco Seguros - #AP-22091-C8) ativa para até 15.000 pessoas simultâneas.
          </div>

        </div>

        {/* PANEL C: FISCAL INTEGRATOR & AUTOMATIC TAXES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-cyan-400" />
              Central de Gestão Fiscal & NF-e (ERP)
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">AUTOMATIZADO</span>
          </div>

          <p className="text-xs text-slate-400">Simulador de apuração de tributação nacional e municipal sobre a venda de ingressos do evento:</p>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase block">Preço do Ingresso Selecionado (BRL):</label>
              <input
                type="number"
                value={ticketTierPrice}
                onChange={(e) => setTicketTierPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase block">Quantidade Vendida Simulada:</label>
              <input
                type="number"
                value={ticketQty}
                onChange={(e) => setTicketQty(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Calculations widget */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Faturamento Bruto:</span>
                <span className="text-slate-200">R$ {grossRevenue.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) ISS Simples ({issRate}%):</span>
                <span>R$ {calculatedIss.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Retenção Fed. ({corporateRetention}%):</span>
                <span>R$ {calculatedRetention.toLocaleString("pt-BR")}</span>
              </div>
              <div className="border-t border-slate-900 pt-1.5 flex justify-between font-bold text-slate-200 text-sm">
                <span>Líquido Estimado:</span>
                <span className="text-emerald-400">R$ {netRevenue.toLocaleString("pt-BR")}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Lote de ${ticketQty} NFS-e emitido digitalmente para processamento junto à Prefeitura Sede!\nChave MD5 do Protocolo Fiscal: eb42-fc10-b992-1c22`);
              }}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-bold text-xs py-2 rounded-xl transition-colors"
              style={{ minHeight: "40px" }}
            >
              Simular Emissão NF-e em Lote
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
