import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar, { SidebarTab } from "./components/Sidebar";
import DashboardCOE from "./components/DashboardCOE";
import EventPlanner from "./components/EventPlanner";
import AgendaSchedule from "./components/AgendaSchedule";
import Checklists from "./components/Checklists";
import TicketingManager from "./components/TicketingManager";
import FinancialEnterprise from "./components/FinancialEnterprise";
import CRMComercial from "./components/CRMComercial";
import SportsHub from "./components/SportsHub";
import AICopilot from "./components/AICopilot";
import MarketplaceFornecedores from "./components/MarketplaceFornecedores";
import CentralChamados from "./components/CentralChamados";
import StaffVolunteers from "./components/StaffVolunteers";
import BiAnalytics from "./components/BiAnalytics";
import RbacPanel from "./components/RbacPanel";
import EventOSEnterprise from "./components/EventOSEnterprise";

import { auth } from "./lib/firebase";
import { signOut } from "firebase/auth";
import { loadCollection, saveDocument, deleteDocument } from "./lib/firestoreService";
import { logPlatformEvent } from "./lib/auditLogger";
import LoginScreen from "./components/LoginScreen";
import LandingPage from "./components/LandingPage";

import { 
  initialEvents, 
  initialTasks, 
  initialChecklists, 
  initialTicketTiers, 
  initialTicketSales, 
  initialTransactions, 
  initialCRMContacts, 
  initialContracts, 
  initialAthletes, 
  initialProviders, 
  initialServiceTickets 
} from "./data";

import { 
  Event, 
  Task, 
  ChecklistItem, 
  TicketTier, 
  TicketSale, 
  Transaction, 
  CRMContact, 
  Contract, 
  Athlete, 
  Provider, 
  ServiceTicket,
  EventTemplate,
  CustomRole,
  PlatformUser,
  StaffMember
} from "./types";

const initialTemplates: EventTemplate[] = [
  {
    id: "tpl-1",
    name: "Copa de Ciclismo / Corrida de Rua",
    description: "Template esportivo padronizado com chip rfid, batedores de policiamento, ambulância de suporte de vida UTI e postos de hidratação numerados.",
    category: "sports",
    venue: "Parque da Orla & Circuito Centro",
    capacity: 1000,
    tasks: [
      { title: "Protocolar licença de fechamento de via pública CET", description: "Pedir interdição do trânsito na prefeitura local", status: "pending", dueDate: "2026-08-10", assignee: "Renata Abreu (Jurídico)", priority: "high" },
      { title: "Contratar UTI móvel de suporte de vida (Ambulâncias)", description: "Assinar contrato de suporte médico emergencial dedicado", status: "pending", dueDate: "2026-08-15", assignee: "Carlos Lima (Produção)", priority: "high" }
    ],
    checklists: [
      { title: "Montar painel eletrônico de telemetria RFID", completed: false, category: "infra", priority: "high" },
      { title: "Sinalizar curvas perigosas com cones e staffs operacionais", completed: false, category: "security", priority: "high" },
      { title: "Distribuir grades de contenção de proteção no pórtico de chegada", completed: false, category: "infra", priority: "medium" }
    ],
    ticketTiers: [
      { name: "Inscrição Geral Atleta", price: 120, capacity: 800, sold: 0 },
      { name: "Kit Premium + Camisa Oficial", price: 230, capacity: 200, sold: 0 }
    ]
  },
  {
    id: "tpl-2",
    name: "Fórum Corporativo B2B / Convenções",
    description: "Template executivo com credenciamento automatizado RFID, tradução simultânea internacional, auditórios de acústica e lounges VIP catering.",
    category: "corporate",
    venue: "Centro de Convenções Rebouças",
    capacity: 1500,
    tasks: [
      { title: "Ajustar grade de palestrantes e assessores VIP", description: "Entrar em contato com os assessores de imprensa e palestrantes", status: "pending", dueDate: "2026-09-01", assignee: "Mariana Costa (CRM/Vendas)", priority: "high" },
      { title: "Homologar buffet premium de catering do lounge VIP", description: "Escolher o cardápio executivo de café e almoço premium", status: "pending", dueDate: "2026-09-10", assignee: "Carlos Lima (Produção)", priority: "medium" }
    ],
    checklists: [
      { title: "Validar áudio e projetores de alta fidelidade das plenárias", completed: false, category: "infra", priority: "high" },
      { title: "Instalar roteador WiFi de fibra dedicada de 1GB", completed: false, category: "infra", priority: "high" }
    ],
    ticketTiers: [
      { name: "Passaporte Executivo 2 Dias", price: 490, capacity: 1300, sold: 0 },
      { name: "VIP Experience Master", price: 1250, capacity: 200, sold: 0 }
    ]
  }
];

const initialRoles: CustomRole[] = [
  {
    id: "admin",
    name: "Administrador Geral",
    description: "Perfil do sistema com acesso total irrestrito a todos os módulos e configurações de segurança.",
    isSystem: true,
    permissions: {
      coe: true, events: true, timeline: true, checklist: true, ticketing: true,
      finance: true, crm: true, sports: true, marketplace: true, chamados: true,
      staff: true, analytics: true, rbac: true, enterprise: true
    }
  },
  {
    id: "operacional",
    name: "Gerente Operacional",
    description: "Perfil voltado ao planejamento tático, cronogramas, checklists operacionais e gestão de chamados do COE.",
    isSystem: false,
    permissions: {
      coe: true, events: true, timeline: true, checklist: true, ticketing: false,
      finance: false, crm: false, sports: true, marketplace: true, chamados: true,
      staff: true, analytics: false, rbac: false, enterprise: true
    }
  },
  {
    id: "financeiro",
    name: "Diretor Financeiro",
    description: "Perfil dedicado ao controle de receitas, despesas, bilheteria, lotes de ingressos e análises preditivas de faturamento.",
    isSystem: false,
    permissions: {
      coe: true, events: false, timeline: false, checklist: false, ticketing: true,
      finance: true, crm: true, sports: false, marketplace: true, chamados: false,
      staff: false, analytics: true, rbac: false, enterprise: true
    }
  },
  {
    id: "staff_campo",
    name: "Staff de Campo / Apoio",
    description: "Perfil simplificado para suporte presencial, visualização de checklists operacionais e triagem rápida de chamados de TI/infra.",
    isSystem: false,
    permissions: {
      coe: false, events: false, timeline: false, checklist: true, ticketing: false,
      finance: false, crm: false, sports: false, marketplace: false, chamados: true,
      staff: true, analytics: false, rbac: false, enterprise: false
    }
  }
];

const initialUsers: PlatformUser[] = [
  { id: "usr-1", name: "André Luis (CEO)", email: "andre.luishenr91@gmail.com", roleId: "admin", status: "active" },
  { id: "usr-2", name: "Bruno Ramos (Ops Manager)", email: "bruno.ramos@playeventos.com.br", roleId: "operacional", status: "active" },
  { id: "usr-3", name: "Carla Souza (CFO)", email: "carla.souza@playeventos.com.br", roleId: "financeiro", status: "active" },
  { id: "usr-4", name: "Lucas Mendes (Supervisor Staff)", email: "lucas.staff@playeventos.com.br", roleId: "staff_campo", status: "active" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("coe");
  const [activeEventId, setActiveEventId] = useState("evt-1");
  const [tenant, setTenant] = useState("Play+ Holding Brasil");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [viewingLanding, setViewingLanding] = useState(true);

  // Event Templates State
  const [templates, setTemplates] = useState<EventTemplate[]>(initialTemplates);

  // Firebase Authentication & Loading States
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState<string>("");

  // RBAC (Role-Based Access Control) States
  const [roles, setRoles] = useState<CustomRole[]>(initialRoles);
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [viewAsRoleId, setViewAsRoleId] = useState<string>("");

  // Core database tables in React state
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [checklists, setChecklists] = useState<ChecklistItem[]>(initialChecklists);
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>(initialTicketTiers);
  const [ticketSales, setTicketSales] = useState<TicketSale[]>(initialTicketSales);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [contacts, setContacts] = useState<CRMContact[]>(initialCRMContacts);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(initialServiceTickets);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  // Sync Status state
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  // Trigger brief sync on any local change
  const triggerBriefSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 800);
  };

  // Get active Firebase authenticated user and their permissions
  const activeUser = users.find(u => u.id === activeUserId);
  const activeUserRole = roles.find(r => r.id === activeUser?.roleId);
  const basePermissions = activeUserRole?.permissions || {
    coe: true, events: true, timeline: true, checklist: true, ticketing: true,
    finance: true, crm: true, sports: true, marketplace: true, chamados: true,
    staff: true, analytics: true, rbac: true, enterprise: true
  };
  // If viewAsRoleId is set and different from own role, apply that role's permissions instead
  const viewRole = viewAsRoleId ? roles.find(r => r.id === viewAsRoleId) : null;
  const userPermissions = viewRole ? viewRole.permissions : basePermissions;

  // Enforce tab permissions upon simulated user or permission change
  useEffect(() => {
    if (!userPermissions[activeTab]) {
      const allowedTabs: SidebarTab[] = [
        'coe', 'events', 'timeline', 'checklist', 'ticketing', 'finance', 
        'crm', 'sports', 'marketplace', 'chamados', 'staff', 'analytics', 'rbac'
      ];
      const firstAllowed = allowedTabs.find(tab => userPermissions[tab]);
      if (firstAllowed) {
        setActiveTab(firstAllowed);
      }
    }
  }, [activeUserId, userPermissions, activeTab]);

  // 1. Authenticate with Firebase & Load all collections in real-time from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setSyncStatus('syncing');
        try {
          const token = await user.getIdToken();
          setJwtToken(token);

          // Fetch roles & users first
          const loadedRoles = await loadCollection<CustomRole>("roles", initialRoles);
          const loadedUsers = await loadCollection<PlatformUser>("users", initialUsers);

          let profile = loadedUsers.find(u => u.id === user.uid);
          if (!profile) {
            profile = {
              id: user.uid,
              name: user.displayName || user.email?.split("@")[0] || "Novo Usuário",
              email: user.email || "",
              roleId: "admin", // default role for self sign-up
              status: "active" as const
            };
            await saveDocument("users", user.uid, profile);
            loadedUsers.push(profile);
          }

          setRoles(loadedRoles);
          setUsers(loadedUsers);
          setActiveUserId(user.uid);
          setFirebaseUser(user);
          // Initialize view-as role to the user's actual assigned role
          const loggedUserProfile = loadedUsers.find(u => u.id === user.uid);
          if (loggedUserProfile?.roleId) {
            setViewAsRoleId(loggedUserProfile.roleId);
          }

          // Fetch other business collections from Firestore
          const loadedEvents = await loadCollection<Event>("eventos_events", initialEvents);
          const loadedTasks = await loadCollection<Task>("eventos_tasks", initialTasks);
          const loadedChecklists = await loadCollection<ChecklistItem>("eventos_checklists", initialChecklists);
          const loadedTiers = await loadCollection<TicketTier>("eventos_ticketTiers", initialTicketTiers);
          const loadedSales = await loadCollection<TicketSale>("eventos_ticketSales", initialTicketSales);
          const loadedTransactions = await loadCollection<Transaction>("eventos_transactions", initialTransactions);
          const loadedContacts = await loadCollection<CRMContact>("eventos_contacts", initialCRMContacts);
          const loadedContracts = await loadCollection<Contract>("eventos_contracts", initialContracts);
          const loadedAthletes = await loadCollection<Athlete>("eventos_athletes", initialAthletes);
          const loadedProviders = await loadCollection<Provider>("eventos_providers", initialProviders);
          const loadedServiceTickets = await loadCollection<ServiceTicket>("eventos_serviceTickets", initialServiceTickets);
          const loadedStaff = await loadCollection<StaffMember>("eventos_staff", []);

          setEvents(loadedEvents);
          setTasks(loadedTasks);
          setChecklists(loadedChecklists);
          setTicketTiers(loadedTiers);
          setTicketSales(loadedSales);
          setTransactions(loadedTransactions);
          setContacts(loadedContacts);
          setContracts(loadedContracts);
          setAthletes(loadedAthletes);
          setProviders(loadedProviders);
          setServiceTickets(loadedServiceTickets);
          setStaffMembers(loadedStaff);

          setSyncStatus('synced');

          // Log Audit Event
          await logPlatformEvent(
            user.uid,
            profile.name,
            profile.email,
            `Sessão de auditoria autenticada com sucesso via JWT`,
            "Acesso"
          );
        } catch (err) {
          console.error("Erro na inicialização do Firestore:", err);
          setSyncStatus('idle');
        }
      } else {
        setFirebaseUser(null);
        setActiveUserId("");
        setJwtToken("");
        setSyncStatus('idle');
      }
      setFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Continuous synchronization effects back to Firestore upon state changes (Debounced/React-Batched)
  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    events.forEach(async (item) => {
      await saveDocument("eventos_events", item.id, item);
    });
  }, [events, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    tasks.forEach(async (item) => {
      await saveDocument("eventos_tasks", item.id, item);
    });
  }, [tasks, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    checklists.forEach(async (item) => {
      await saveDocument("eventos_checklists", item.id, item);
    });
  }, [checklists, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    ticketTiers.forEach(async (item) => {
      await saveDocument("eventos_ticketTiers", item.id, item);
    });
  }, [ticketTiers, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    ticketSales.forEach(async (item) => {
      await saveDocument("eventos_ticketSales", item.id, item);
    });
  }, [ticketSales, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    transactions.forEach(async (item) => {
      await saveDocument("eventos_transactions", item.id, item);
    });
  }, [transactions, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    contacts.forEach(async (item) => {
      await saveDocument("eventos_contacts", item.id, item);
    });
  }, [contacts, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    contracts.forEach(async (item) => {
      await saveDocument("eventos_contracts", item.id, item);
    });
  }, [contracts, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    athletes.forEach(async (item) => {
      await saveDocument("eventos_athletes", item.id, item);
    });
  }, [athletes, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    providers.forEach(async (item) => {
      await saveDocument("eventos_providers", item.id, item);
    });
  }, [providers, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    serviceTickets.forEach(async (item) => {
      await saveDocument("eventos_serviceTickets", item.id, item);
    });
  }, [serviceTickets, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    staffMembers.forEach(async (item) => {
      await saveDocument("eventos_staff", item.id, item);
    });
  }, [staffMembers, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    users.forEach(async (item) => {
      await saveDocument("users", item.id, item);
    });
  }, [users, firebaseLoading, firebaseUser]);

  useEffect(() => {
    if (firebaseLoading || !firebaseUser) return;
    roles.forEach(async (item) => {
      await saveDocument("roles", item.id, item);
    });
  }, [roles, firebaseLoading, firebaseUser]);

  // State modification handlers
  const handleAddEvent = (newEvent: Omit<Event, 'id'>, selectedTemplateId?: string) => {
    const id = `evt-${Date.now()}`;
    setEvents(prev => [...prev, { ...newEvent, id }]);
    
    // If a template is chosen, clone its tasks, checklists, and ticket tiers
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        // Clone tasks
        const clonedTasks: Task[] = template.tasks.map((t, idx) => ({
          ...t,
          id: `tsk-tpl-${Date.now()}-${idx}`,
          eventId: id,
          dueDate: newEvent.date // align due dates with event date
        }));
        setTasks(prev => [...clonedTasks, ...prev]);

        // Clone checklists
        const clonedChecklists: ChecklistItem[] = template.checklists.map((c, idx) => ({
          ...c,
          id: `chk-tpl-${Date.now()}-${idx}`,
          eventId: id
        }));
        setChecklists(prev => [...clonedChecklists, ...prev]);

        // Clone ticket tiers
        const clonedTiers: TicketTier[] = template.ticketTiers.map((t, idx) => ({
          ...t,
          id: `tier-tpl-${Date.now()}-${idx}`,
          eventId: id
        }));
        setTicketTiers(prev => [...clonedTiers, ...prev]);
      }
    } else {
      // Create a default ticket tier if none exist
      const defaultTier: TicketTier = {
        id: `tier-${Date.now()}`,
        eventId: id,
        name: "Lote Geral Regular",
        price: 150,
        capacity: newEvent.capacity || 1000,
        sold: 0
      };
      setTicketTiers(prev => [defaultTier, ...prev]);
    }

    setActiveEventId(id);
    triggerBriefSync();
  };

  const handleSaveEventAsTemplate = (eventId: string, templateName: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const eventTasks = tasks.filter(t => t.eventId === eventId).map(t => ({
      title: t.title,
      description: t.description,
      status: 'pending' as const,
      dueDate: t.dueDate,
      assignee: t.assignee || "Staff Geral",
      priority: t.priority
    }));

    const eventChecklists = checklists.filter(c => c.eventId === eventId).map(c => ({
      title: c.title,
      completed: false,
      category: c.category,
      priority: c.priority
    }));

    const eventTiers = ticketTiers.filter(t => t.eventId === eventId).map(t => ({
      name: t.name,
      price: t.price,
      capacity: t.capacity,
      sold: 0
    }));

    const newTemplate: EventTemplate = {
      id: `tpl-${Date.now()}`,
      name: templateName,
      description: `Template criado a partir do evento "${event.name}".`,
      category: event.category,
      venue: event.venue,
      capacity: event.capacity,
      tasks: eventTasks,
      checklists: eventChecklists,
      ticketTiers: eventTiers
    };

    setTemplates(prev => [...prev, newTemplate]);
    triggerBriefSync();
  };

  const handleUpdateTicketTierPrice = (id: string, price: number) => {
    setTicketTiers(prev => prev.map(t => t.id === id ? { ...t, price } : t));
    triggerBriefSync();
  };


  const handleDeleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    await deleteDocument("eventos_events", id);
    triggerBriefSync();
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const id = `tsk-${Date.now()}`;
    setTasks(prev => [...prev, { ...newTask, id }]);
    triggerBriefSync();
  };

  const handleUpdateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    triggerBriefSync();
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await deleteDocument("eventos_tasks", id);
    triggerBriefSync();
  };

  const handleAddChecklistItem = (item: Omit<ChecklistItem, 'id'>) => {
    const id = `chk-${Date.now()}`;
    setChecklists(prev => [...prev, { ...item, id }]);
    triggerBriefSync();
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklists(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
    triggerBriefSync();
  };

  const handleDeleteChecklistItem = async (id: string) => {
    setChecklists(prev => prev.filter(c => c.id !== id));
    await deleteDocument("eventos_checklists", id);
    triggerBriefSync();
  };

  const handleAddTicketTier = (tier: Omit<TicketTier, 'id'>) => {
    const id = `tier-${Date.now()}`;
    setTicketTiers(prev => [...prev, { ...tier, id }]);
    triggerBriefSync();
  };

  const handleAddTicketSale = (sale: Omit<TicketSale, 'id'>) => {
    const id = `sale-${Date.now()}`;
    const newSale = { ...sale, id };
    setTicketSales(prev => [...prev, newSale]);
    setTicketTiers(prev => prev.map(t => t.id === sale.tierId ? { ...t, sold: t.sold + 1 } : t));

    const tier = ticketTiers.find(t => t.id === sale.tierId);
    if (tier) {
      handleAddTransaction({
        eventId: sale.eventId,
        type: 'income',
        amount: tier.price,
        category: 'Venda de Ingresso',
        description: `Ingresso: ${tier.name} — ${sale.buyerName} (${sale.paymentMethod.toUpperCase()})`,
        date: new Date().toISOString().split('T')[0],
        centerOfCost: 'Bilheteria'
      });
    }

    if (activeUser) {
      logPlatformEvent(
        activeUser.id,
        activeUser.name,
        activeUser.email,
        `Nova venda de ingresso registrada: ${sale.buyerName} — lote ${tier?.name || sale.tierId}`,
        "Bilheteria",
        newSale
      );
    }
    triggerBriefSync();
  };

  const handleToggleCheckIn = (saleId: string) => {
    setTicketSales(prev => prev.map(s => {
      if (s.id === saleId) {
        const isNowCheckedIn = !s.checkedIn;
        const updated = {
          ...s,
          checkedIn: isNowCheckedIn,
          checkedInAt: isNowCheckedIn ? new Date().toISOString() : undefined
        };
        if (activeUser && isNowCheckedIn) {
          logPlatformEvent(
            activeUser.id,
            activeUser.name,
            activeUser.email,
            `Credenciamento RFID validado para o participante: ${s.buyerName} (${s.buyerEmail})`,
            "Operações",
            updated
          );
        }
        return updated;
      }
      return s;
    }));
    triggerBriefSync();
  };

  const handleAddTransaction = (tx: Omit<Transaction, 'id'>) => {
    const id = `tx-${Date.now()}`;
    const newTx = { ...tx, id };
    setTransactions(prev => [newTx, ...prev]);
    triggerBriefSync();

    if (activeUser) {
      logPlatformEvent(
        activeUser.id,
        activeUser.name,
        activeUser.email,
        `Fluxo de Pagamento registrado: ${tx.description} - R$ ${tx.amount.toLocaleString("pt-BR")} (${tx.type === 'income' ? 'Crédito' : 'Débito'})`,
        "Finanças",
        newTx
      );
    }
  };

  const handleAddContact = (contact: Omit<CRMContact, 'id'>) => {
    const id = `crm-${Date.now()}`;
    setContacts(prev => [...prev, { ...contact, id }]);
    triggerBriefSync();
  };

  const handleSignContract = (contractId: string) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        const signed = {
          ...c,
          status: 'signed' as const,
          signedDate: new Date().toISOString().split('T')[0]
        };

        if (activeUser) {
          logPlatformEvent(
            activeUser.id,
            activeUser.name,
            activeUser.email,
            `Alteração Contratual / Homologação Digital assinada com ${c.supplierName} - Objeto: ${c.contractName}`,
            "Contratos",
            signed
          );
        }
        return signed;
      }
      return c;
    }));
    triggerBriefSync();
  };

  const handleAddAthlete = (ath: Omit<Athlete, 'id'>) => {
    const id = `ath-${Date.now()}`;
    setAthletes(prev => [...prev, { ...ath, id }]);
    triggerBriefSync();
  };

  const handleUpdateAthleteStatus = (id: string, status: Athlete['status'], finishTime?: string) => {
    setAthletes(prev => prev.map(a => a.id === id ? { ...a, status, finishTime } : a));
    triggerBriefSync();
  };

  const handleAddServiceTicket = (tkt: Omit<ServiceTicket, 'id'>) => {
    const id = `tkt-${Date.now()}`;
    setServiceTickets(prev => [{ ...tkt, id }, ...prev]);
    triggerBriefSync();
  };

  const handleResolveServiceTicket = (id: string) => {
    setServiceTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
    triggerBriefSync();
  };

  // Staff management handlers
  const handleAddStaff = (member: Omit<StaffMember, 'id'>) => {
    const id = `staff-${Date.now()}`;
    setStaffMembers(prev => [...prev, { ...member, id }]);
    triggerBriefSync();
  };

  const handleRewardStaff = (staffId: string) => {
    setStaffMembers(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextPoints = s.points + 150;
        const nextTasks = s.completedTasksCount + 1;
        const newBadges = [...s.badges];
        if (nextTasks >= 10 && !newBadges.includes("Assiduidade Perfeita")) newBadges.push("Assiduidade Perfeita");
        if (nextPoints >= 2000 && !newBadges.includes("Mestre da Produção")) newBadges.push("Mestre da Produção");
        return { ...s, points: nextPoints, completedTasksCount: nextTasks, badges: newBadges };
      }
      return s;
    }));
    triggerBriefSync();
  };

  const handleUpdateStaffRating = (staffId: string, rating: number) => {
    setStaffMembers(prev => prev.map(s => {
      if (s.id === staffId) {
        const newBadges = [...s.badges];
        if (rating === 5 && !newBadges.includes("Estrela do Evento")) newBadges.push("Estrela do Evento");
        return { ...s, rating, badges: newBadges };
      }
      return s;
    }));
    triggerBriefSync();
  };

  const handleContractProvider = (providerId: string, contracted: boolean) => {
    setProviders(prev => prev.map(p =>
      p.id === providerId ? { ...p, status: contracted ? 'contracted' : 'available' } : p
    ));
    triggerBriefSync();
  };

  // Apply AI Cognitive Generated Plan Data directly to event structures
  const handleApplyAIGeneratedPlan = (aiData: any) => {
    if (!aiData) return;

    // 1. Map timeline to tasks
    const newTasks: Task[] = (aiData.timeline || []).map((item: any, idx: number) => ({
      id: `tsk-ai-${Date.now()}-${idx}`,
      eventId: activeEventId,
      title: item.title,
      description: item.description,
      status: 'pending',
      dueDate: new Date(Date.now() + (idx * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignee: 'Sugerido pela IA',
      priority: idx % 2 === 0 ? 'high' : 'medium'
    }));

    // 2. Map proposed checklists
    const newChecklists: ChecklistItem[] = (aiData.checklists || []).map((item: any, idx: number) => ({
      id: `chk-ai-${Date.now()}-${idx}`,
      eventId: activeEventId,
      title: item.title,
      completed: false,
      category: item.category || 'production',
      priority: item.priority || 'medium'
    }));

    // 3. Map pricing suggestions to Ticket Tiers (sold starts at 0 — only real sales increment this)
    const newTiers: TicketTier[] = (aiData.pricingSuggestions || []).map((item: any, idx: number) => ({
      id: `tier-ai-${Date.now()}-${idx}`,
      eventId: activeEventId,
      name: item.name,
      price: Number(item.price) || 150,
      capacity: 1000,
      sold: 0
    }));

    setTasks(prev => [...newTasks, ...prev]);
    setChecklists(prev => [...newChecklists, ...prev]);
    setTicketTiers(prev => [...newTiers, ...prev]);

    triggerBriefSync();
  };

  // Render current active panel based on tab selections
  const renderMainContent = () => {
    switch (activeTab) {
      case "coe":
        return (
          <DashboardCOE 
            ticketTiers={ticketTiers}
            ticketSales={ticketSales}
            transactions={transactions}
            serviceTickets={serviceTickets}
            events={events}
            activeEventId={activeEventId}
            addTransaction={handleAddTransaction}
          />
        );
      case "events":
        return (
          <EventPlanner 
            events={events}
            activeEventId={activeEventId}
            setActiveEventId={setActiveEventId}
            addEvent={handleAddEvent}
            deleteEvent={handleDeleteEvent}
            templates={templates}
            saveEventAsTemplate={handleSaveEventAsTemplate}
          />
        );
      case "timeline":
        return (
          <AgendaSchedule 
            tasks={tasks}
            events={events}
            activeEventId={activeEventId}
            addTask={handleAddTask}
            updateTaskStatus={handleUpdateTaskStatus}
            deleteTask={handleDeleteTask}
          />
        );
      case "checklist":
        return (
          <Checklists 
            checklists={checklists}
            events={events}
            activeEventId={activeEventId}
            addChecklistItem={handleAddChecklistItem}
            toggleChecklistItem={handleToggleChecklistItem}
            deleteChecklistItem={handleDeleteChecklistItem}
            applyAIGeneratedPlan={handleApplyAIGeneratedPlan}
          />
        );
      case "ticketing":
        return (
          <TicketingManager 
            ticketTiers={ticketTiers}
            ticketSales={ticketSales}
            events={events}
            activeEventId={activeEventId}
            addTicketTier={handleAddTicketTier}
            addTicketSale={handleAddTicketSale}
            toggleCheckIn={handleToggleCheckIn}
          />
        );
      case "finance":
        return (
          <FinancialEnterprise 
            transactions={transactions}
            events={events}
            activeEventId={activeEventId}
            addTransaction={handleAddTransaction}
          />
        );
      case "crm":
        return (
          <CRMComercial 
            contacts={contacts}
            contracts={contracts}
            addContact={handleAddContact}
            signContract={handleSignContract}
          />
        );
      case "sports":
        return (
          <SportsHub 
            athletes={athletes}
            events={events}
            activeEventId={activeEventId}
            addAthlete={handleAddAthlete}
            updateAthleteStatus={handleUpdateAthleteStatus}
          />
        );
      case "marketplace":
        return (
          <MarketplaceFornecedores 
            providers={providers}
            activeEventId={activeEventId}
            contractProvider={handleContractProvider}
          />
        );
      case "chamados":
        return (
          <CentralChamados 
            serviceTickets={serviceTickets}
            activeEventId={activeEventId}
            addServiceTicket={handleAddServiceTicket}
            resolveServiceTicket={handleResolveServiceTicket}
          />
        );
      case "staff":
        return (
          <StaffVolunteers 
            events={events}
            activeEventId={activeEventId}
            staffMembers={staffMembers}
            addStaff={handleAddStaff}
            rewardStaff={handleRewardStaff}
            updateStaffRating={handleUpdateStaffRating}
          />
        );
      case "analytics":
        return (
          <BiAnalytics 
            events={events}
            activeEventId={activeEventId}
            ticketTiers={ticketTiers}
            transactions={transactions}
            updateTicketTierPrice={handleUpdateTicketTierPrice}
          />
        );
      case "rbac":
        return (
          <RbacPanel 
            roles={roles}
            users={users}
            activeUserId={activeUserId}
            setRoles={setRoles}
            setUsers={setUsers}
            setActiveUserId={setActiveUserId}
          />
        );
      case "enterprise":
        return (
          <EventOSEnterprise 
            events={events}
            activeEventId={activeEventId}
          />
        );
      default:
        return (
          <div className="text-center py-20 text-slate-500">
            Módulo em desenvolvimento operacional.
          </div>
        );
    }
  };

  const handleLogout = async () => {
    try {
      if (activeUser) {
        await logPlatformEvent(
          activeUser.id,
          activeUser.name,
          activeUser.email,
          "Sessão finalizada de forma segura pelo usuário",
          "Acesso"
        );
      }
      setViewingLanding(true);
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const handleAuthSuccess = (uid: string, email: string, name: string) => {
    // Reactive auth listener handles state updates automatically
  };

  if (firebaseLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4 font-sans text-zinc-100" id="firebase-loading-spinner">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-900 border-t-yellow-500 animate-spin"></div>
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-xs font-bold tracking-widest font-mono text-yellow-500 uppercase">Sincronia Firebase Ativa</h4>
          <p className="text-xs text-zinc-500">Conectando ao EventOS Cognitive Core...</p>
        </div>
      </div>
    );
  }

  if (viewingLanding) {
    return (
      <LandingPage 
        onEnterPlatform={() => setViewingLanding(false)} 
        totalEventsCount={events.length} 
      />
    );
  }

  if (!firebaseUser) {
    return (
      <LoginScreen 
        roles={roles} 
        onAuthSuccess={handleAuthSuccess} 
        onBackToLanding={() => setViewingLanding(true)}
      />
    );
  }

  const currentUserData = {
    id: activeUserId,
    email: firebaseUser.email || "",
    name: activeUser?.name || firebaseUser.email?.split("@")[0] || "Operador"
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="play-eventos-root">
      
      {/* Top Main Navigation Header */}
      <Header 
        events={events}
        activeEventId={activeEventId}
        setActiveEventId={setActiveEventId}
        tenantName={tenant}
        setTenantName={setTenant}
        syncStatus={syncStatus}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Drawer/Sidebar Panel */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          copilotOpen={copilotOpen}
          setCopilotOpen={setCopilotOpen}
          userPermissions={userPermissions}
          currentUser={currentUserData}
          userRoleName={activeUserRole?.name || "Operador Autorizado"}
          onLogout={handleLogout}
          roles={roles}
          viewAsRoleId={viewAsRoleId || activeUser?.roleId || "admin"}
          onChangeViewRole={setViewAsRoleId}
        />

        {/* Dynamic Main Workspace stage */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto" style={{ minWidth: 0 }}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Split page with active Copilot or Full Workspace */}
            {copilotOpen ? (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  {renderMainContent()}
                </div>
                <div>
                  <AICopilot 
                    events={events}
                    activeEventId={activeEventId}
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                {renderMainContent()}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Humble Legal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-4 text-center text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-8">
        <span>© 2026 PLAY+EVENTOS OS S.A. Todos os direitos reservados.</span>
        <span className="flex items-center gap-1.5 justify-center">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Ambiente Cloud Run Ingress Protegido (Sessão JWT Segura)
        </span>
      </footer>

    </div>
  );
}
