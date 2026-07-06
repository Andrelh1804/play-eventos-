import React, { useState } from "react";
import { 
  Tv, Play, Volume2, Eye, Download, Globe, Radio, Sparkles, Check, 
  HelpCircle, Accessibility, FileText, ArrowRight, HeartHandshake
} from "lucide-react";

interface MediaStreamModuleProps {
  activeEvent: any;
}

export default function MediaStreamModule({ activeEvent }: MediaStreamModuleProps) {
  // Live player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<string>("pt");
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [audioDescription, setAudioDescription] = useState<boolean>(false);

  // Subtitles content translation dictionary
  const subtitles = {
    pt: "Bem-vindos à transmissão oficial da Copa de Ciclismo PLAY+! Os atletas se posicionam na linha de partida.",
    en: "Welcome to the official broadcast of the PLAY+ Cycling Cup! The athletes are lining up on the starting grid.",
    es: "¡Bienvenidos a la transmisión oficial de la Copa de Ciclismo PLAY+! Los atletas se colocan en la línea de salida.",
    fr: "Bienvenue sur la diffusion officielle de la PLAY+ Cycling Cup! Les athlètes se positionnent sur la grille de départ."
  };

  // Audio description narration simulator content
  const audioDescNarration = "[Narração de Acessibilidade]: Uma vista panorâmica aérea mostra a arena esportiva lotada com arquibancadas decoradas em azul e fuchsia. O sol brilha forte. Os ciclistas vestem uniformes coloridos e ajustam seus capacetes.";

  // Media bank list
  const mediaBank = [
    { name: "Álbum de Fotos Oficiais - Portaria A (Lote 1)", format: "ZIP/PNG", size: "142 MB" },
    { name: "Entrevistas com Atletas Ganhadores do Km 15", format: "MP4/H264", size: "840 MB" },
    { name: "Gravação Completa da Câmera de Linha de Chegada", format: "MOV/ProRes", size: "4.2 GB" },
    { name: "Kit de Logos e Identidade Visual para Imprensa", format: "EPS/PDF", size: "28 MB" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-100" id="media-stream-container">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL A & B: LIVE PLAYER & ACCESSIBILITY (Col-Span-2) */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="h-4 w-4 text-fuchsia-400" />
              Streaming de Transmissão ao Vivo (Híbrido)
            </h4>
            <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/40 border border-fuchsia-500/20 px-1.5 rounded animate-pulse">
              LIVE BROADCAST
            </span>
          </div>

          <p className="text-xs text-slate-400">Canal de transmissão integrado para eventos híbridos com Closed Captions (Libras/Tradutor IA):</p>

          {/* Interactive Player Screen Mockup */}
          <div className="bg-slate-950 rounded-xl border border-slate-850 aspect-video relative flex flex-col justify-between overflow-hidden p-4">
            
            {/* Live indicator overlay */}
            <div className="flex justify-between items-center relative z-10">
              <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                AO VIVO
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                1080p60 • Bitrate: 4500kbps
              </span>
            </div>

            {/* Simulated Stream Visual Screen with cyclist mock */}
            <div className="text-center space-y-3 relative z-10 my-auto">
              {isPlaying ? (
                <div className="space-y-2 animate-pulse">
                  <span className="text-5xl block">🚴‍♂️💨</span>
                  <p className="text-xs font-mono font-bold text-slate-300">Transmitindo Sinal de Vídeo Principal...</p>
                </div>
              ) : (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-12 h-12 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white flex items-center justify-center mx-auto"
                >
                  <Play className="h-6 w-6 ml-1" />
                </button>
              )}
            </div>

            {/* Caption subtitles overlay */}
            {showCaptions && isPlaying && (
              <div className="text-center bg-slate-950/85 text-white border border-slate-850 text-xs font-sans font-bold p-2.5 rounded-lg max-w-md mx-auto relative z-10 leading-relaxed">
                {subtitles[activeLang as keyof typeof subtitles] || subtitles.pt}
              </div>
            )}

            {/* Player control toolbar */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-900/60 text-xs font-mono relative z-10">
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-slate-300 hover:text-white"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <span className="text-slate-700">|</span>
                <button 
                  onClick={() => alert("Rebobinando sinal para D-Dia Replay de 30 segundos nas câmeras auxiliares.")}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Instant Replay
                </button>
              </div>

              {/* Lang switcher controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[10px]">Legendas IA:</span>
                {["pt", "en", "es", "fr"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-1 rounded text-[9px] uppercase font-bold border transition-colors ${
                      activeLang === lang 
                        ? 'bg-fuchsia-950 text-fuchsia-400 border-fuchsia-500/30' 
                        : 'bg-slate-900 border-slate-850 text-slate-500'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Accessibility narration switcher */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-fuchsia-400" />
                <div>
                  <h5 className="text-xs font-bold text-slate-200">Recurso de Acessibilidade: Audiodescrição Narração</h5>
                  <p className="text-[10px] text-slate-500">Narração sintetizada por Inteligência Artificial para deficientes visuais</p>
                </div>
              </div>
              <button 
                onClick={() => setAudioDescription(!audioDescription)}
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded border transition-colors ${
                  audioDescription ? 'bg-fuchsia-950 text-fuchsia-400 border-fuchsia-500/25' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {audioDescription ? "Habilitado" : "Desabilitado"}
              </button>
            </div>

            {audioDescription && (
              <p className="text-xs text-fuchsia-300 font-sans italic leading-relaxed p-2.5 bg-fuchsia-950/20 border border-fuchsia-500/10 rounded-lg">
                {audioDescNarration}
              </p>
            )}
          </div>

        </div>

        {/* PANEL C: UNIFIED MEDIA BANK */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Download className="h-4 w-4 text-fuchsia-400" />
              Banco de Mídia Oficial (Imprensa & Acervo)
            </h4>
            <span className="text-[10px] font-mono text-slate-500">CONFORMIDADE DIGITAL</span>
          </div>

          <p className="text-xs text-slate-400">Download seguro de mídias, fotos oficiais e highlights gerados pela produção:</p>

          <div className="space-y-2.5">
            {mediaBank.map((media, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-200 block truncate max-w-[170px]" title={media.name}>
                    {media.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-1 rounded">
                    {media.format}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900/60">
                  <span>Tamanho: {media.size}</span>
                  <button 
                    onClick={() => alert(`Baixando arquivo "${media.name}" do servidor de assets EventOS.`)}
                    className="text-fuchsia-400 hover:underline"
                  >
                    Baixar Arquivo
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-500 leading-normal font-mono">
            <strong>Acordo de Direitos Autorais:</strong> Todo material baixado possui licenciamento aberto para fins de divulgação jornalística ou promocional esportiva associada ao evento.
          </div>

        </div>

      </div>

    </div>
  );
}
