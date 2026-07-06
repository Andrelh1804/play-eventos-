import React, { useState } from "react";
import { 
  Compass, Map, MapPin, Layers, Radio, Send, Users, AlertTriangle, 
  HelpCircle, Sparkles, Navigation, Shield, CheckCircle2, Thermometer
} from "lucide-react";

interface TwinGisModuleProps {
  activeEvent: any;
}

export default function TwinGisModule({ activeEvent }: TwinGisModuleProps) {
  // Digital Twin state
  const [selectedStructure, setSelectedStructure] = useState<string>("stage");
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  
  // Geofencing state
  const [fenceActive, setFenceActive] = useState<boolean>(true);
  const [fenceViolationAlert, setFenceViolationAlert] = useState<string | null>(null);

  // Field Teams location coordinate simulator
  const [teams, setTeams] = useState([
    { id: "t1", name: "Segurança Patrulha Alpha", type: "Segurança", status: "Em Rota", pos: "Portão Norte", battery: "92%" },
    { id: "t2", name: "Ambulância UTI 2", type: "Médico", status: "Posto Fixo", pos: "Setor Sul (Acesso Médicos)", battery: "100%" },
    { id: "t3", name: "Coordenação de Palco 1", type: "Produção", status: "No Local", pos: "Bastidores Palco Principal", battery: "64%" },
    { id: "t4", name: "Carreta Logística Apoio", type: "Veículo", status: "Em Deslocamento", pos: "Acesso Carga/Descarga", battery: "80%" },
  ]);

  // Structure definitions for the digital twin
  const structures = {
    stage: { name: "Palco Principal (Live Area)", capacity: 2500, count: 1840, density: "Alta (Heatmap Vermelho)", temp: "26.4°C", soundLvl: "102 dB", status: "Show Ativo" },
    camarote: { name: "Camarotes Corporativos VIP", capacity: 400, count: 320, density: "Média (Heatmap Laranja)", temp: "22.1°C", soundLvl: "82 dB", status: "Coquetel Executivo" },
    foodpark: { name: "Food Park & Praça de Alimentação", capacity: 1500, count: 710, density: "Baixa (Heatmap Verde)", temp: "24.0°C", soundLvl: "74 dB", status: "Operacional" },
    parking: { name: "Estacionamento & Logística", capacity: 1000, count: 480, density: "Baixa (Heatmap Azul)", temp: "19.5°C", soundLvl: "60 dB", status: "Fluxo Normal" },
    expos: { name: "Estandes de Expositores (Expo)", capacity: 800, count: 210, density: "Baixa (Heatmap Azul)", temp: "21.8°C", soundLvl: "68 dB", status: "Visitação Aberta" }
  };

  const activeStruct = (structures as any)[selectedStructure] || structures.stage;

  // Simulate geofence violation
  const triggerSimulatedViolation = () => {
    setFenceViolationAlert("⚠️ CERCA VIRTUAL VIOLADA: Veículo não cadastrado entrou na Zona de Segurança Backstage (Portão 4)");
    setTimeout(() => {
      setFenceViolationAlert(null);
    }, 6000);
  };

  return (
    <div className="space-y-6" id="twin-gis-module-container">
      
      {/* Geofence violation warning overlay banner */}
      {fenceViolationAlert && (
        <div className="bg-rose-950 border border-rose-500/30 text-rose-200 p-3 rounded-xl flex items-center justify-between gap-4 animate-bounce text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{fenceViolationAlert}</span>
          </div>
          <button 
            onClick={() => setFenceViolationAlert(null)}
            className="underline hover:text-white"
          >
            Sinalizar Lida
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL A: DIGITAL TWIN LAYOUT BLUEPRINT (SVG/interactive map) */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="space-y-0.5">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Gêmeo Digital (Digital Twin 3D)
              </h4>
              <p className="text-[10px] text-slate-400">Clique nas estruturas da arena abaixo para extrair a telemetria ao vivo</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Heatmap Térmico</span>
              <button 
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                  showHeatmap ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20' : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                {showHeatmap ? "Habilitado" : "Desabilitado"}
              </button>
            </div>
          </div>

          {/* Interactive Blueprint Vector Map */}
          <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 min-h-[260px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Ambient Background decoration simulating grid coordinates */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            {/* Stadium/Festival layout represent */}
            <div className="grid grid-cols-3 gap-3 relative z-10 my-auto">
              
              {/* Stage Block */}
              <div 
                onClick={() => setSelectedStructure("stage")}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 ${
                  selectedStructure === 'stage' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-500">SETOR OESTE</div>
                <h5 className="text-xs font-bold text-slate-200">PALCO PRINCIPAL</h5>
                {showHeatmap && (
                  <div className="w-4 h-4 rounded-full bg-rose-500 blur-sm mx-auto animate-ping" title="Heatmap: Densidade Alta"></div>
                )}
                <span className="text-[10px] font-mono text-slate-400">1.840 Pax</span>
              </div>

              {/* VIP Lounge Block */}
              <div 
                onClick={() => setSelectedStructure("camarote")}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 ${
                  selectedStructure === 'camarote' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-500">SETOR ELEVADO</div>
                <h5 className="text-xs font-bold text-slate-200">CAMAROTE VIP</h5>
                {showHeatmap && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 blur-sm mx-auto" title="Heatmap: Densidade Média"></div>
                )}
                <span className="text-[10px] font-mono text-slate-400">320 Pax</span>
              </div>

              {/* Food Park Block */}
              <div 
                onClick={() => setSelectedStructure("foodpark")}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 ${
                  selectedStructure === 'foodpark' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-500">SETOR SUL</div>
                <h5 className="text-xs font-bold text-slate-200">FOOD PARK</h5>
                {showHeatmap && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 blur-sm mx-auto" title="Heatmap: Densidade Baixa"></div>
                )}
                <span className="text-[10px] font-mono text-slate-400">710 Pax</span>
              </div>

              {/* Parking Log Block */}
              <div 
                onClick={() => setSelectedStructure("parking")}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 col-span-2 ${
                  selectedStructure === 'parking' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-500">SETOR EXTERNO</div>
                <h5 className="text-xs font-bold text-slate-200">ESTACIONAMENTO & ACESSO DE CARGA</h5>
                {showHeatmap && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 blur-sm mx-auto" title="Heatmap: Densidade Nula"></div>
                )}
                <span className="text-[10px] font-mono text-slate-400">480 Carros</span>
              </div>

              {/* Expo Stands Block */}
              <div 
                onClick={() => setSelectedStructure("expos")}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1.5 ${
                  selectedStructure === 'expos' 
                    ? 'border-cyan-500 bg-cyan-950/20' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[9px] text-slate-500">SETOR LESTE</div>
                <h5 className="text-xs font-bold text-slate-200">ESTANDES EXPO</h5>
                {showHeatmap && (
                  <div className="w-3 h-3 rounded-full bg-blue-500 blur-sm mx-auto" title="Heatmap: Densidade Baixa"></div>
                )}
                <span className="text-[10px] font-mono text-slate-400">210 Pax</span>
              </div>

            </div>

            {/* Selected structure specs layout */}
            <div className="border-t border-slate-900 pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-500">Estrutura Ativa: </span>
                <strong className="text-slate-200">{activeStruct.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Status Operação: </span>
                <strong className="text-cyan-400">{activeStruct.status}</strong>
              </div>
              <div>
                <span className="text-slate-500">Lotação: </span>
                <strong className="text-slate-300">{activeStruct.count} / {activeStruct.capacity} pax</strong>
              </div>
              <div className="flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-500">Climatização Interna: </span>
                <strong className="text-slate-300">{activeStruct.temp}</strong>
              </div>
              <div>
                <span className="text-slate-500">Poluição Sonora: </span>
                <strong className="text-amber-400">{activeStruct.soundLvl}</strong>
              </div>
            </div>

          </div>

        </div>

        {/* PANEL B: GIS & MAPS GEOLOCATION AND FIELD TEAMS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Map className="h-4 w-4 text-emerald-400" />
              Sistemas GIS (Localização de Equipes)
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 rounded">
              GPS ATIVO
            </span>
          </div>

          <p className="text-xs text-slate-400">Rastreamento de equipes em campo equipadas com pulseiras RFID e transmissores georreferenciados:</p>

          <div className="space-y-2">
            {teams.map((t) => (
              <div key={t.id} className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    {t.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-1 rounded">
                    {t.type}
                  </span>
                </div>
                
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Posição GPS: {t.pos}</span>
                  <span className="text-slate-500">Bateria: {t.battery}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 text-[9px] font-mono">
                  <span>Status: <strong className="text-slate-300">{t.status}</strong></span>
                  <button 
                    onClick={() => {
                      const msg = prompt(`Enviar comando de rádio para ${t.name}:`);
                      if (msg) alert(`Mensagem despachada via Rádio UHF: "${msg}"`);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    Chamar no Rádio
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Virtual Geofencing toggler card */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-300 block">Geofencing (Cerca Virtual)</span>
                <span className="text-[9px] font-mono text-slate-500">Limitação eletrônica de perímetros</span>
              </div>
              <button 
                onClick={() => {
                  setFenceActive(!fenceActive);
                  alert(`Cerca virtual de exclusão ${!fenceActive ? 'habilitada' : 'desabilitada'}.`);
                }}
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition-colors ${
                  fenceActive ? 'bg-red-950/40 text-red-400 border-red-500/25' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {fenceActive ? "Ativo" : "Desativado"}
              </button>
            </div>

            {fenceActive && (
              <div className="space-y-2">
                <div className="text-[9px] text-slate-500 leading-normal font-mono">
                  ✓ Zona Protegida Backstage configurada. Perímetro: r=35m em torno de Coordenadas (LAT -19.92, LNG -43.94)
                </div>
                <button 
                  onClick={triggerSimulatedViolation}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-850 text-[10px] font-mono text-slate-300 py-1 rounded"
                >
                  Simular Invasão de Cerca
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
