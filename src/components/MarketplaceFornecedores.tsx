import React, { useState } from "react";
import { ShoppingBag, Star, Phone, Check, HelpCircle, Briefcase, Sliders, ArrowUpRight } from "lucide-react";
import { Provider } from "../types";

interface MarketplaceProps {
  providers: Provider[];
  activeEventId: string;
}

export default function MarketplaceFornecedores({ providers }: MarketplaceProps) {
  const [hiredIds, setHiredIds] = useState<string[]>(["prov-1", "prov-2"]);

  const toggleHire = (id: string) => {
    if (hiredIds.includes(id)) {
      setHiredIds(prev => prev.filter(i => i !== id));
    } else {
      setHiredIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6" id="marketplace-view">
      <div>
        <h2 className="text-xl font-bold text-white font-display">Marketplace de Fornecedores Homologados</h2>
        <p className="text-xs text-slate-400 mt-0.5">Catálogo unificado de staff, catering, limpeza, ambulâncias e som/luz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {providers.map((prov) => {
          const isHired = hiredIds.includes(prov.id);
          return (
            <div key={prov.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase bg-cyan-950 border border-cyan-500/15 px-2 py-0.5 rounded">
                    {prov.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {prov.rating}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-white font-display leading-tight">{prov.name}</h3>
                
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Phone className="h-3 w-3" />
                  {prov.phone}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-950 space-y-3">
                <div className="flex justify-between items-baseline text-xs font-mono">
                  <span className="text-slate-500">Valor Estimado:</span>
                  <span className="text-slate-200 font-semibold">R$ {prov.cost}/hora</span>
                </div>

                <button
                  onClick={() => toggleHire(prov.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isHired 
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {isHired ? (
                    <>
                      <Check className="h-4 w-4" />
                      Contratado
                    </>
                  ) : (
                    'Solicitar Contratação'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
