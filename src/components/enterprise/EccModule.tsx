import React, { useState, useEffect } from "react";
import { 
  Activity, CloudRain, Sun, Wind, Users, Shield, Zap, Wifi, 
  Flame, HelpCircle, RefreshCw, Layers, AlertCircle, Play, CheckCircle2, TrendingUp, DollarSign
} from "lucide-react";

interface EccModuleProps {
  activeEvent: any;
}

export default function EccModule({ activeEvent }: EccModuleProps) {
  // Console monitoring layouts
  const [layoutMode, setLayoutMode] = useState<'exec' | 'ops' | 'wall' | 'mobile'>('ops');
  
  // Real-time sensors state
  const [checkedInCount, setCheckedInCount] = useState(2405);
  const [insideCount, setInsideCount] = useState(1982);
  const [entryRate, setEntryRate] = useState(45); // pax/min
  const [exitRate, setExitRate] = useState(12); // pax/min
  const [weatherCondition, setWeatherCondition] = useState({ temp: 24, wind: 28, uv: 5.2, rain: 15 });
  const [generatorFuel, setGeneratorFuel] = useState(82); // %
  const [networkLoad, setNetworkLoad] = useState(64); // %
  
  // Alerts list
  const [alerts, setAlerts] = useState([
    { id: "a1", type: "CRÍTICO", text: "Sensor de Corrente do Gerador Auxiliar 2 acusou flutuação", time: "21:30", color: "text-rose-400 bg-rose-950/40 border-rose-500/20" },
    { id: "a2", type: "AVISO", text: "Taxa de entrada do Portão B atingindo 90% da capacidade nominal", time: "21:32", color: "text-amber-400 bg-amber-950/40 border-amber-500/20" },
    { id: "a3", type: "INFO", text: "Ambulância UTI 1 reposicionada no Setor Sul", time: "21:34", color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/20" },
  ]);

  // Simulate real-time data jitter
  useEffect(() => {
    const timer = setInterval(() => {
      // Checked in and Inside counts jitter
      setCheckedInCount(prev => {
        const next = prev + Math.floor(Math.random() * 5);
        return next > (activeEvent?.capacity || 5000) ? activeEvent?.capacity : next;
      });
      setInsideCount(prev => {
        const next = prev + Math.floor(Math.random() * 6) - Math.floor(Math.random() * 2);
        return next > checkedInCount ? checkedInCount : next < 0 ? 0 : next;
      });
      setEntryRate(prev => {
        const delta = Math.floor(Math.random() * 11) - 5;
        const next = prev + delta;
        return next < 5 ? 5 : next > 120 ? 120 : next;
      });
      setExitRate(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 1 ? 1 : next > 40 ? 40 : next;
      });
      // Generator fuel draining slowly
      setGeneratorFuel(prev => (prev > 10 ? +(prev - 0.01).toFixed(2) : 98));
    }, 4000);

    return () => clearInterval(timer);
  }, [activeEvent, checkedInCount]);

  // Dismiss alert
  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6" id="ecc-module-container">
      {/* Top Header of the Center */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">ECC Live Connection Active</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100 font-display mt-0.5">Event Command Center (ECC) - Centro de Comando</h3>
        </div>

        {/* View Layout Controls */}
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'exec', label: 'Executivo' },
            { id: 'ops', label: 'Operacional (NOC)' },
            { id: 'wall', label: 'Videowall' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setLayoutMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-mono font-bold transition-all ${
                layoutMode === mode.id
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid depending on Layout Selection */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: CRITICAL SYSTEM ALERTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Painel de Alertas Ativos
            </h4>
            <span className="text-[10px] font-mono bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
              SLA ATIVO
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-mono">Nenhum incidente crítico registrado</p>
              </div>
            ) : (
              alerts.map((al) => (
                <div key={al.id} className={`p-3 rounded-lg border text-xs space-y-1.5 ${al.color}`}>
                  <div className="flex justify-between items-center font-mono text-[9px] font-bold">
                    <span>{al.type}</span>
                    <span>{al.time}</span>
                  </div>
                  <p className="font-sans leading-relaxed text-slate-300 text-[11px]">{al.text}</p>
                  <div className="flex justify-end gap-1.5 font-mono text-[9px] pt-1 border-t border-slate-900/35">
                    <button 
                      onClick={() => dismissAlert(al.id)}
                      className="hover:underline text-slate-400 hover:text-slate-200"
                    >
                      Dispensar
                    </button>
                    <span className="text-slate-600">|</span>
                    <button 
                      onClick={() => alert(`Direcionando incidente operacional: "${al.text}" para supervisor do setor.`)}
                      className="text-cyan-400 hover:underline"
                    >
                      Escalar UTI/Equipe
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Trigger alarm mock for user */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Simulação de Rádio Interno</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => {
                  setAlerts(prev => [
                    { id: Date.now().toString(), type: "CRÍTICO", text: "Alarme Meteorológico: Ventos de 46 km/h detectados na arena", time: new Date().toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"}), color: "text-rose-400 bg-rose-950/40 border-rose-500/20" },
                    ...prev
                  ]);
                }}
                className="bg-rose-950/30 border border-rose-800 text-rose-400 hover:bg-rose-900/40 text-[10px] font-mono font-bold py-1.5 rounded transition-colors text-center"
              >
                Gatilho Clima
              </button>
              <button 
                onClick={() => {
                  setAlerts(prev => [
                    { id: Date.now().toString(), type: "AVISO", text: "Superlotação no Setor de Alimentação (Food Park)", time: new Date().toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"}), color: "text-amber-400 bg-amber-950/40 border-amber-500/20" },
                    ...prev
                  ]);
                }}
                className="bg-amber-950/30 border border-amber-800 text-amber-400 hover:bg-amber-900/40 text-[10px] font-mono font-bold py-1.5 rounded transition-colors text-center"
              >
                Superlotação
              </button>
            </div>
          </div>
        </div>

        {/* CENTER EXECUTIVE: REAL-TIME GRAPHICS & telemetry */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* NOC Widgets Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Live Crowd Widget */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Público Presente</span>
                <Users className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-mono font-bold text-slate-100">{insideCount.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-slate-500">Do total de {checkedInCount} escaneados</div>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (insideCount / (activeEvent?.capacity || 5000)) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 leading-none">
                <span>Capacidade: {activeEvent?.capacity || 5000}</span>
                <span className="text-cyan-400">{( (insideCount / (activeEvent?.capacity || 5000)) * 100 ).toFixed(1)}%</span>
              </div>
            </div>

            {/* Ingress / Egress Flow */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Fluxo de Portaria</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-850 text-center">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block">Entrada</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">+{entryRate} pax/m</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-850 text-center">
                  <span className="text-[8px] font-mono text-slate-500 uppercase block">Saída</span>
                  <span className="text-sm font-mono font-bold text-slate-300">-{exitRate} pax/m</span>
                </div>
              </div>
            </div>

            {/* Weather & Contingency state */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Clima & Alertas</span>
                {weatherCondition.wind > 35 ? <CloudRain className="h-4 w-4 text-rose-500 animate-bounce" /> : <Sun className="h-4 w-4 text-amber-500" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-mono font-bold text-slate-100">{weatherCondition.temp}°C</span>
                  <span className="text-[10px] font-mono text-slate-400">Vento: {weatherCondition.wind} km/h</span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 leading-tight">
                  UV: {weatherCondition.uv} • Probabilidade Chuva: {weatherCondition.rain}%
                </div>
              </div>
              <div className={`p-1.5 rounded text-[9px] font-mono text-center border ${
                weatherCondition.wind > 30 
                  ? 'bg-rose-950/40 text-rose-400 border-rose-800/30 animate-pulse' 
                  : 'bg-slate-950 text-slate-400 border-slate-850'
              }`}>
                {weatherCondition.wind > 30 ? "⚠️ ALERTA: Ventania alta. Equipe notificada" : "✓ Clima estável sem restrições"}
              </div>
            </div>

            {/* Smart Infrastructure (IOT) */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide">Telemetria IoT</span>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gerador C1:</span>
                  <span className={generatorFuel < 20 ? "text-rose-400" : "text-emerald-400"}>{generatorFuel}% Comb.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rede Fibra:</span>
                  <span className="text-slate-300">Online (1.1 Gbps)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Catracas RFID:</span>
                  <span className="text-emerald-400">22 Onlines / 22</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive operational/executive monitors panels */}
          {layoutMode === 'ops' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Mapeamento de Postos & Recursos em Campo
                </h4>
                <span className="text-[10px] font-mono text-slate-500">Atualizado a cada 5s</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Ambulance Dispatches */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wide block">Ambulâncias & Médicos</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>UTI Móvel 1 (Norte):</span>
                      <span className="text-slate-500 font-mono">LIVRE</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>UTI Móvel 2 (Sul):</span>
                      <span className="text-amber-400 font-mono">EM DESLOCAMENTO</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Posto Avançado 1:</span>
                      <span className="text-emerald-400 font-mono">OPERANDO (2 Leitos)</span>
                    </div>
                  </div>
                </div>

                {/* Grid Power and redundancy */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide block">Rede Elétrica & Geradores</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Alimentação CEMIG:</span>
                      <span className="text-emerald-400 font-mono">ESTÁVEL (220V)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gerador Heimer 500:</span>
                      <span className="text-slate-500 font-mono">STAND-BY READY</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gerador STEMAC 300:</span>
                      <span className="text-slate-500 font-mono">STAND-BY READY</span>
                    </div>
                  </div>
                </div>

                {/* Operations Staff Communications */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide block">Infraestrutura & Redes</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Portão Principal:</span>
                      <span className="text-emerald-400 font-mono">LIBERADO</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Portaria Staff & Credenciados:</span>
                      <span className="text-emerald-400 font-mono">CONTR. ACESSO</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Wi-Fi Produção:</span>
                      <span className="text-cyan-400 font-mono">Ativo (640 Mbps)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* General Command actions buttons */}
              <div className="bg-indigo-950/25 border border-indigo-500/20 p-3 rounded-lg flex items-center justify-between text-xs gap-4">
                <div className="text-slate-300">
                  <strong className="text-white">Procedimentos Operacionais (SOP):</strong> Em caso de tempestade com raios num raio de 10km, proceda com o encerramento temporário de palcos elevados.
                </div>
                <button 
                  onClick={() => alert("Comitê de Crise alertado com plano de emergência!")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold px-3 py-1.5 rounded shrink-0"
                >
                  Despachar Comunicado COE
                </button>
              </div>

            </div>
          )}

          {layoutMode === 'exec' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Desempenho Comercial & Previsão ERP (Visão Executiva)
                </h4>
                <span className="text-[10px] font-mono text-slate-500">Live Forecast</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Receita Estimada vs Realizada</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    R$ {(insideCount * 145).toLocaleString("pt-BR")}
                  </div>
                  <p className="text-xs text-slate-400">
                    Calculado com base em ticket médio consumido por participante escaneado na arena mais as cotas de patrocinadores validadas no portfólio.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Eficiência Operacional SLA</span>
                  <div className="text-2xl font-bold text-slate-200 font-mono">98.4%</div>
                  <p className="text-xs text-slate-400">
                    Média de tempo de atendimento para chamados operacionais e incidentes médicos resolvidos dentro da janela de SLA de 15 minutos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {layoutMode === 'wall' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl"></div>
              <div className="max-w-md mx-auto space-y-2 py-4">
                <div className="w-10 h-10 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30">
                  <Layers className="h-5 w-5 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 font-display">NOC Videowall Mode</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Modo projetor otimizado para exibição contínua em monitores de grande formato na sala de comando. Todos os painéis alternam a cada 15 segundos para monitoramento preventivo 360°.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => alert("Exibindo Videowall em Tela Cheia no terminal físico do organizador.")}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-4 py-2 rounded-lg font-bold"
                  >
                    Ativar Modo Projetor Fullscreen
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
