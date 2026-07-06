import React, { useState, useEffect } from "react";
import { 
  Building, ShieldAlert, Activity, Leaf, Code, 
  Layers, Lock, Settings, Cpu, Tv, GraduationCap, Brain, Map,
  Users, Truck, GitFork, FileCheck2
} from "lucide-react";

// Import Modular Sub-Modules for Fase 3
import EccModule from "./enterprise/EccModule";
import TwinGisModule from "./enterprise/TwinGisModule";
import CrisisRulesModule from "./enterprise/CrisisRulesModule";
import EsgGovModule from "./enterprise/EsgGovModule";
import EngagementModule from "./enterprise/EngagementModule";
import LmsWikiModule from "./enterprise/LmsWikiModule";
import MediaStreamModule from "./enterprise/MediaStreamModule";
import AiAgentsModule from "./enterprise/AiAgentsModule";

// Import Modular Sub-Modules for Fase 4
import PortalsModule from "./enterprise/PortalsModule";
import LogisticsModule from "./enterprise/LogisticsModule";
import AutomationBiModule from "./enterprise/AutomationBiModule";
import ComplianceModule from "./enterprise/ComplianceModule";

interface EventOSEnterpriseProps {
  events: any[];
  activeEventId: string;
}

// Sub-Tab types for EventOS v4.0 (Fase 4 Integrated Corporate Ecosystem)
type EnterpriseSubTab = 
  | 'ecc' 
  | 'twin_gis' 
  | 'crisis_rules' 
  | 'esg_gov'
  | 'portals'
  | 'logistics'
  | 'autobi'
  | 'engagement' 
  | 'lms_wiki' 
  | 'media_stream' 
  | 'ai_agents'
  | 'compliance';

export default function EventOSEnterprise({ events, activeEventId }: EventOSEnterpriseProps) {
  const [activeSubTab, setActiveSubTab] = useState<EnterpriseSubTab>('ecc');
  const [activeEvent, setActiveEvent] = useState<any>(events.find(e => e.id === activeEventId) || events[0]);

  useEffect(() => {
    const ev = events.find(e => e.id === activeEventId);
    if (ev) setActiveEvent(ev);
  }, [activeEventId, events]);

  // Render the selected advanced enterprise module
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'ecc':
        return <EccModule activeEvent={activeEvent} />;
      case 'twin_gis':
        return <TwinGisModule activeEvent={activeEvent} />;
      case 'crisis_rules':
        return <CrisisRulesModule activeEvent={activeEvent} />;
      case 'esg_gov':
        return <EsgGovModule activeEvent={activeEvent} />;
      case 'portals':
        return <PortalsModule activeEvent={activeEvent} />;
      case 'logistics':
        return <LogisticsModule activeEvent={activeEvent} />;
      case 'autobi':
        return <AutomationBiModule activeEvent={activeEvent} />;
      case 'engagement':
        return <EngagementModule activeEvent={activeEvent} />;
      case 'lms_wiki':
        return <LmsWikiModule activeEvent={activeEvent} />;
      case 'media_stream':
        return <MediaStreamModule activeEvent={activeEvent} />;
      case 'ai_agents':
        return <AiAgentsModule activeEvent={activeEvent} />;
      case 'compliance':
        return <ComplianceModule />;
      default:
        return <EccModule activeEvent={activeEvent} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="eventos-enterprise-module">
      
      {/* Corporate Heading Header */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-mono border border-fuchsia-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">EventOS v4.0</span>
            <span className="text-slate-500 text-xs font-mono">Fase 4: Ecossistema Corporativo Integrado</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 font-display">EventOS Strategic Cockpit</h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Centro de comando tático do Event Operating System (EventOS) da <strong className="text-slate-200">PLAY+EVENTOS</strong>. Controle unificado de portais de stakeholders (Clientes, Patrocinadores, Fornecedores), logística de alvarás, cerimonial de dignatários e automação de regras mestre (DRE/ERP).
          </p>
        </div>

        {/* Global Active Event indicator */}
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-fuchsia-950/40 text-fuchsia-400 border border-fuchsia-500/15 rounded-lg">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 uppercase leading-none">Contexto Ativo</div>
            <span className="text-xs font-bold text-slate-200 leading-normal block max-w-[200px] truncate">{activeEvent?.name || "Nenhum evento focado"}</span>
          </div>
        </div>
      </div>

      {/* Main Module Horizontal Navigation Tabs (11 tabs grouping Fase 3 & Fase 4 features) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 overflow-x-auto" id="enterprise-tabs-nav">
        {[
          { id: 'ecc', label: 'ECC Command Center', icon: Activity },
          { id: 'twin_gis', label: 'Gêmeo Digital & GIS', icon: Map },
          { id: 'crisis_rules', label: 'Central de Crise & Regras', icon: ShieldAlert },
          { id: 'esg_gov', label: 'Governança, Fiscal & ESG', icon: Leaf },
          { id: 'portals', label: 'Ecossistema de Portais', icon: Users },
          { id: 'logistics', label: 'Gestão de Logística', icon: Truck },
          { id: 'autobi', label: 'Automação, BI & DRE', icon: GitFork },
          { id: 'engagement', label: 'Engajamento & Matchmaking', icon: Brain },
          { id: 'lms_wiki', label: 'POPs Wiki & Treinamento LMS', icon: GraduationCap },
          { id: 'media_stream', label: 'Streaming & Acessibilidade', icon: Tv },
          { id: 'ai_agents', label: 'IA Specialist Agents Lab', icon: Cpu },
          { id: 'compliance', label: 'Auditoria & Go-Live Hub', icon: FileCheck2 },
        ].map((sub) => {
          const isSelected = activeSubTab === sub.id;
          const Icon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as EnterpriseSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-sans transition-all shrink-0 cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 border-slate-700 text-white shadow-lg shadow-fuchsia-500/5'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
              id={`enterprise-tab-btn-${sub.id}`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? 'text-fuchsia-400' : 'text-slate-500'}`} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Sub Module Tab Content */}
      <div className="min-h-[450px]">
        {renderSubTabContent()}
      </div>

    </div>
  );
}
