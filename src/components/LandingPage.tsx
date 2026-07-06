import React from "react";
import { 
  Shield, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Compass, 
  LineChart, 
  ArrowRight, 
  Globe, 
  Activity, 
  Users, 
  ShoppingBag,
  Zap
} from "lucide-react";
import PlayLogo from "./PlayLogo";

interface LandingPageProps {
  onEnterPlatform: () => void;
  totalEventsCount: number;
}

export default function LandingPage({ onEnterPlatform, totalEventsCount }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Premium Ambient Glow Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-yellow-500/5 to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[800px] left-1/4 w-[400px] h-[400px] bg-yellow-500/[0.02] rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[200px] right-1/4 w-[500px] h-[500px] bg-yellow-500/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header / Navbar */}
      <nav className="relative z-10 border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlayLogo size="xs" />
          <span className="h-5 w-px bg-zinc-800 hidden sm:block"></span>
          <span className="text-[10px] font-mono text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 tracking-wider uppercase hidden sm:inline-block">
            V8.0 Enterprise
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterPlatform}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-display font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(234,179,8,0.25)] hover:shadow-[0_4px_25px_rgba(234,179,8,0.4)] active:scale-[0.98]"
          >
            Acessar Plataforma
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        <div className="animate-in fade-in slide-in-from-top-6 duration-700">
          <PlayLogo size="xl" showReflection={true} className="mx-auto" />
        </div>

        <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-1000 delay-200">
          <h2 className="text-sm font-mono tracking-[0.25em] text-yellow-500 uppercase font-bold">
            Autonomous Event Ecosystem (AEE)
          </h2>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
            O Sistema Operacional Cognitivo para <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Eventos Globais</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Unifique gestão operacional, gêmeos digitais 2.0, finanças com split inteligente, inteligência artificial integrada e governança enterprise em uma única plataforma hiperconectada.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in duration-1000 delay-300">
          <button
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-display font-bold text-base hover:from-yellow-400 hover:to-amber-400 shadow-[0_4px_30px_rgba(234,179,8,0.25)] hover:shadow-[0_4px_35px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Entrar no Workspace Core
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-500/30 text-zinc-300 font-medium text-base transition-all flex items-center justify-center"
          >
            Conhecer Funcionalidades
          </a>
        </div>

        {/* Live System Stats */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center font-mono">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-500">{totalEventsCount}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Eventos Ativos</div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Níveis de Permissão (RBAC)</div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Sincronia Firebase Realtime</div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-500">11+</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Agentes de IA Cognitiva</div>
          </div>
        </div>
      </section>

      {/* Pillars / Features Bento Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono tracking-widest text-yellow-500 uppercase bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 font-bold">
            Pilares da Tecnologia
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Infraestrutura Modular de Alta Performance
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            Tudo o que organizadores de eventos complexos e governos locais precisam para monitoramento em tempo real.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Event Knowledge Graph */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Event Knowledge Graph (Fase 1)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Relacionamento automático inteligente entre eventos, equipes, fornecedores, contratos, ativos e participantes para insights rápidos e integridade operacional total.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>Tecnologia Semântica Core</span>
              <Activity className="h-3.5 w-3.5 animate-pulse text-yellow-500" />
            </div>
          </div>

          {/* Card 2: Digital Twin 2.0 */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Gêmeo Digital 2.0 (Fase 2)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Representação viva do evento em tempo real: acompanhe o fluxo de público, status de energia, internet, ambulâncias UTI, brigadistas e condições climáticas instantaneamente.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>Telemetria Realtime</span>
              <Shield className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

          {/* Card 3: AI Autônoma & Agentes */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Agentes Cognitivos de IA (Fase 3)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Agentes autônomos de IA atuando como Diretores (Comercial, Operações, Financeiro) com memória própria, ferramentas e geração de planos auditáveis com um clique.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>IA Generativa Avançada</span>
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

          {/* Card 4: Finance Cloud */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Event Finance Cloud (Fase 9)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Controle financeiro consolidado de faturamento, split avançado de pagamentos para parceiros, DRE em tempo real, centro de custos e previsão preditiva de bilheteria.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>ERP & Contabilidade Integrados</span>
              <LineChart className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

          {/* Card 5: Marketplace Fornecedores */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Marketplace Global (Fase 5)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Contratação integrada de equipes de segurança, buffet, sonorização de grande porte, UTI móvel e brigadas. Homologação digital instantânea com assinatura de contratos.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>B2B Event Marketplace</span>
              <Users className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

          {/* Card 6: Observabilidade & NOC */}
          <div className="bg-zinc-950 border border-zinc-900 hover:border-yellow-500/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 transition-all">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Observabilidade & NOC (Fase 11)</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Cockpit operacional unificado mapeando alertas críticos e correlacionando chamados de suporte a infraestrutura, com logs auditados em conformidade com as diretivas.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600 group-hover:text-yellow-500/80 transition-all flex items-center gap-1.5">
              <span>NOC de Incidentes</span>
              <Globe className="h-3.5 w-3.5 text-yellow-500" />
            </div>
          </div>

        </div>
      </section>

      {/* Dashboard Preview Segment */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 bg-zinc-950/20">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
          <div className="space-y-6 lg:max-w-md">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/25 rounded-lg px-3 py-1 text-xs font-mono text-yellow-500">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              Sincronia Total de dados
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Acesso Unificado White-Label Multi-Tenant
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Mude entre diferentes holdings, produtoras ou prefeituras municipais em segundos com dados segregados por criptografia de sessão e credenciamento RFID.
            </p>
            <ul className="space-y-3 text-xs text-zinc-300 font-mono">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                Autenticação segura via Tokens JWT
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                Auditoria de Logs em tempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                Controle de Acesso Baseado em Funções (RBAC)
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full bg-black/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 font-mono text-xs text-zinc-400 space-y-4 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
              <span className="text-[10px] text-zinc-600">PLAY+ EVENTOS CONSOLE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="border-b border-zinc-900 pb-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30"></span>
              </div>
              <span className="text-[10px] text-zinc-500 ml-2">AEE COGNITIVE MONITOR</span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-zinc-900/50 pb-1">
                <span className="text-zinc-500">&gt;_ Initializing Event Knowledge Graph...</span>
                <span className="text-yellow-500">[OK]</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/50 pb-1">
                <span className="text-zinc-500">&gt;_ Digital Twin 2.0 telemetry sync:</span>
                <span className="text-emerald-500">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/50 pb-1">
                <span className="text-zinc-500">&gt;_ Active Copilot instances:</span>
                <span className="text-white">AEE Director (Autonomous)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/50 pb-1">
                <span className="text-zinc-500">&gt;_ Split billing routing tables:</span>
                <span className="text-white">Active (Split: 85% Produtor / 15% Play+)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">&gt;_ Enterprise network security:</span>
                <span className="text-emerald-400">SECURE (JWT SHA256)</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button 
                onClick={onEnterPlatform}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/30 rounded-xl text-yellow-500 font-bold transition-all flex items-center gap-2"
              >
                Simular Interface de Operações
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
          Pronto para liderar a nova era de eventos autônomos?
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-sm">
          Acesse a central cognitiva, defina papéis e distribua responsabilidades de forma digital e automatizada.
        </p>
        <div className="pt-4">
          <button
            onClick={onEnterPlatform}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black font-display font-bold text-base hover:from-yellow-400 hover:to-amber-400 shadow-[0_4px_30px_rgba(234,179,8,0.25)] transition-all inline-flex items-center gap-2 group active:scale-[0.98]"
          >
            Acessar o Core do Ecossistema
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-xs text-zinc-500 font-mono space-y-2">
        <PlayLogo size="xs" className="opacity-70 mb-2" />
        <p>© 2026 PLAY+EVENTOS OS S.A. Todos os direitos reservados.</p>
        <p className="text-[10px] text-zinc-600">
          Sincronia com Firestore Realtime Database Ativa (PRODUÇÃO)
        </p>
      </footer>

    </div>
  );
}
