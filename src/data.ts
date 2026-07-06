import { Event, Task, ChecklistItem, TicketTier, TicketSale, Transaction, CRMContact, Contract, Athlete, Provider, ServiceTicket } from "./types";

export const initialEvents: Event[] = [
  {
    id: "evt-1",
    name: "Copa Play+ de Ciclismo 2026",
    date: "2026-07-15",
    endDate: "2026-07-15",
    description: "Campeonato nacional de ciclismo de estrada com circuito urbano de 12km, integrando categorias amador, master e elite masculina/feminina.",
    category: "sports",
    venue: "Parque da Orla & Circuito Centro",
    capacity: 1500,
    status: "active",
    logoUrl: ""
  },
  {
    id: "evt-2",
    name: "ExpoTech Enterprise 2026",
    date: "2026-09-20",
    endDate: "2026-09-22",
    description: "Feira global de tecnologia e inteligência artificial, reunindo palestrantes de alto nível, startups de hardware/SaaS e rodadas de negócios B2B.",
    category: "corporate",
    venue: "Centro de Convenções Rebouças",
    capacity: 5000,
    status: "planning",
    logoUrl: ""
  },
  {
    id: "evt-3",
    name: "Festival Som do Sol 2026",
    date: "2026-05-10",
    endDate: "2026-05-11",
    description: "Festival de música indie e eletrônica nacional, com dois palcos principais, praça de alimentação com cervejarias locais e área vip lounge.",
    category: "show_festival",
    venue: "Arena Estádio Pacaembu",
    capacity: 12000,
    status: "completed",
    logoUrl: ""
  }
];

export const initialTasks: Task[] = [
  {
    id: "tsk-1",
    eventId: "evt-1",
    title: "Obter alvará de trânsito CET",
    description: "Protocolar pedido de interdição das vias públicas do circuito na prefeitura e CET.",
    status: "completed",
    dueDate: "2026-06-10",
    assignee: "Renata Abreu (Jurídico)",
    priority: "high"
  },
  {
    id: "tsk-2",
    eventId: "evt-1",
    title: "Contratação da equipe de cronometragem",
    description: "Assinar contrato com a empresa de chips e telemetria eletrônica por RFID.",
    status: "completed",
    dueDate: "2026-06-25",
    assignee: "Carlos Lima (Produção)",
    priority: "high"
  },
  {
    id: "tsk-3",
    eventId: "evt-1",
    title: "Montagem dos kits dos atletas",
    description: "Separar sacolas, camisetas, número de peito, chip de cronometragem e brindes.",
    status: "in_progress",
    dueDate: "2026-07-12",
    assignee: "Equipe Staff Geral",
    priority: "medium"
  },
  {
    id: "tsk-4",
    eventId: "evt-2",
    title: "Negociação de patrocínio Master",
    description: "Apresentar a cota de R$ 150k de branding para empresa líder de computação em nuvem.",
    status: "in_progress",
    dueDate: "2026-07-20",
    assignee: "Mariana Costa (CRM/Vendas)",
    priority: "high"
  },
  {
    id: "tsk-5",
    eventId: "evt-2",
    title: "Criação do site / Landing page oficial",
    description: "Desenvolver landing page de inscrições com cronograma de palestrantes e grade de trilhas.",
    status: "pending",
    dueDate: "2026-08-01",
    assignee: "Thiago Rocha (Marketing)",
    priority: "medium"
  },
  {
    id: "tsk-6",
    eventId: "evt-3",
    title: "Prestação de contas e fechamento financeiro",
    description: "Elaborar relatório de fluxo de caixa e encaminhar notas fiscais para o financeiro consolidar.",
    status: "completed",
    dueDate: "2026-05-25",
    assignee: "Patrícia Souza (Financeiro)",
    priority: "high"
  }
];

export const initialChecklists: ChecklistItem[] = [
  { id: "chk-1", eventId: "evt-1", title: "Validar layout de grades de proteção na chegada", completed: true, category: "infra", priority: "high" },
  { id: "chk-2", eventId: "evt-1", title: "Estocar 4.000 garrafas de água mineral nos postos de hidratação", completed: false, category: "production", priority: "high" },
  { id: "chk-3", eventId: "evt-1", title: "Contratação de batedores da polícia militar para escolta de pelotão", completed: true, category: "security", priority: "high" },
  { id: "chk-4", eventId: "evt-1", title: "Disparar SMS de alerta para atletas cadastrados com as regras da prova", completed: false, category: "marketing", priority: "medium" },
  { id: "chk-5", eventId: "evt-2", title: "Testar projetor e acústica do auditório principal", completed: false, category: "infra", priority: "high" },
  { id: "chk-6", eventId: "evt-2", title: "Contratar tradutores simultâneos para painéis internacionais", completed: false, category: "production", priority: "medium" },
  { id: "chk-7", eventId: "evt-3", title: "Verificar extintores e saídas de emergência aprovadas pelo corpo de bombeiros", completed: true, category: "security", priority: "high" }
];

export const initialTicketTiers: TicketTier[] = [
  { id: "tier-1", eventId: "evt-1", name: "Inscrição Geral Atleta", price: 120, capacity: 1000, sold: 840 },
  { id: "tier-2", eventId: "evt-1", name: "Inscrição Elite Profissional", price: 180, capacity: 200, sold: 125 },
  { id: "tier-3", eventId: "evt-1", name: "Kit Premium + Camisa Oficial", price: 250, capacity: 300, sold: 212 },
  { id: "tier-4", eventId: "evt-2", name: "Passaporte Geral 3 Dias", price: 450, capacity: 3500, sold: 1820 },
  { id: "tier-5", eventId: "evt-2", name: "Passaporte VIP Experience", price: 1200, capacity: 500, sold: 290 },
  { id: "tier-6", eventId: "evt-3", name: "Ingresso Inteira - Festival", price: 220, capacity: 8000, sold: 8000 },
  { id: "tier-7", eventId: "evt-3", name: "Ingresso Meia-Entrada / Solidário", price: 110, capacity: 4000, sold: 4000 }
];

export const initialTicketSales: TicketSale[] = [
  { id: "sale-1", eventId: "evt-1", tierId: "tier-1", buyerName: "Roberto Alencar", buyerEmail: "roberto@uol.com.br", timestamp: "2026-07-01T10:24:12Z", checkedIn: true, checkedInAt: "2026-07-15T06:45:00Z", paymentMethod: "pix" },
  { id: "sale-2", eventId: "evt-1", tierId: "tier-1", buyerName: "Fernanda Lima", buyerEmail: "fer.lima@gmail.com", timestamp: "2026-07-02T14:52:10Z", checkedIn: false, paymentMethod: "credit_card" },
  { id: "sale-3", eventId: "evt-1", tierId: "tier-2", buyerName: "Gustavo Franco", buyerEmail: "gustavo.franco@elite.com", timestamp: "2026-07-03T09:12:33Z", checkedIn: true, checkedInAt: "2026-07-15T06:32:11Z", paymentMethod: "pix" },
  { id: "sale-4", eventId: "evt-2", tierId: "tier-4", buyerName: "Juliana Santos", buyerEmail: "juliana.tech@startup.io", timestamp: "2026-07-04T17:05:01Z", checkedIn: false, paymentMethod: "credit_card" },
  { id: "sale-5", eventId: "evt-2", tierId: "tier-5", buyerName: "Arthur Azevedo", buyerEmail: "arthur@cloudventures.vc", timestamp: "2026-07-05T11:40:00Z", checkedIn: false, paymentMethod: "pix" }
];

export const initialTransactions: Transaction[] = [
  { id: "tx-1", eventId: "evt-1", type: "income", amount: 100800, category: "Venda Ingressos", description: "Lote 1 Inscrição Geral Atleta (840 unidades)", date: "2026-07-01", centerOfCost: "Comercial" },
  { id: "tx-2", eventId: "evt-1", type: "income", amount: 22500, category: "Venda Ingressos", description: "Lote 1 Inscrição Elite (125 unidades)", date: "2026-07-03", centerOfCost: "Comercial" },
  { id: "tx-3", eventId: "evt-1", type: "income", amount: 45000, category: "Patrocínio", description: "Cota Patrocínio Bronze - RedBull Brasil", date: "2026-07-04", centerOfCost: "Marketing" },
  { id: "tx-4", eventId: "evt-1", type: "expense", amount: 12000, category: "Aluguel Estrutura", description: "Locação de grades de proteção e pórtico inflável", date: "2026-07-02", centerOfCost: "Infraestrutura" },
  { id: "tx-5", eventId: "evt-1", type: "expense", amount: 8500, category: "Segurança", description: "Contratação de 35 seguranças privados habilitados", date: "2026-07-05", centerOfCost: "Operações" },
  { id: "tx-6", eventId: "evt-2", type: "income", amount: 819000, category: "Venda Ingressos", description: "Lote Geral Passaportes (1820 unidades)", date: "2026-07-04", centerOfCost: "Comercial" },
  { id: "tx-7", eventId: "evt-2", type: "expense", amount: 45000, category: "Locação Espaço", description: "Sinal de reserva de espaço de pavilhão de exposições", date: "2026-06-15", centerOfCost: "Logística" }
];

export const initialCRMContacts: CRMContact[] = [
  { id: "crm-1", name: "Carlos Ghosn", company: "Aliança Seguros", role: "Diretor de Marketing", email: "ghosn@aliancaseguros.com.br", phone: "(11) 98765-4321", status: "signed", value: 85000, type: "sponsor" },
  { id: "crm-2", name: "Alessandra Toledo", company: "Ultra Gás S.A.", role: "Gerente de Eventos", email: "alessandra.toledo@ultragas.com.br", phone: "(11) 91234-5678", status: "negotiation", value: 120000, type: "sponsor" },
  { id: "crm-3", name: "Fábio Medina", company: "Medina Eventos e Catering", role: "Sócio-Diretor", email: "fabio@medinacatering.com.br", phone: "(21) 99888-7766", status: "contacted", value: 45000, type: "contractor" },
  { id: "crm-4", name: "Bruna Kajiya", company: "Prefeitura Municipal SP", role: "Secretária de Esportes e Lazer", email: "bruna.semel@prefeitura.sp.gov.br", phone: "(11) 3344-5566", status: "signed", value: 0, type: "partner" }
];

export const initialContracts: Contract[] = [
  { id: "ctr-1", title: "Contrato de Patrocínio Gold - Aliança Seguros", partyName: "Aliança Seguros S.A.", partyType: "Patrocinador", status: "signed", value: 85000, signedDate: "2026-06-12", content: "Cláusula 1ª. O presente contrato tem por objeto a concessão de direitos de branding e espaço físico de 16m² no pavilhão do evento. Cláusula 2ª. A patrocinada compromete-se a expor a logomarca nos painéis de LED secundários e material promocional dos atletas." },
  { id: "ctr-2", title: "Locação de Painéis de LED e Som de Grande Porte", partyName: "Visual Pro Multimídia", partyType: "Fornecedor", status: "pending_signature", value: 34000, content: "Cláusula 1ª. Locação de 120 metros quadrados de painéis de LED P3.9 Outdoor de alta definição e sistema de som Line Array JBL. Cláusula 2ª. O contratante pagará 50% de sinal de reserva de equipamentos e 50% no dia da desmontagem." },
  { id: "ctr-3", title: "Prestação de Serviços Médicos - Ambulâncias UTI", partyName: "LifeSalva Emergências Médicas", partyType: "Fornecedor", status: "signed", value: 9200, signedDate: "2026-06-20", content: "Contratação de 2 ambulâncias tipo D (UTI Móvel) equipadas com desfibrilador, oxigênio, medicamentos críticos e equipe completa contendo 1 médico intensivista, 1 enfermeiro e 2 motoristas socorristas de prontidão por 12 horas seguidas." }
];

export const initialAthletes: Athlete[] = [
  { id: "ath-1", eventId: "evt-1", name: "Marcos Vinícius Silva", bib: "101", category: "Speed Master A", ageGroup: "30-39 anos", shirtSize: "M", status: "finished", finishTime: "01:18:24" },
  { id: "ath-2", eventId: "evt-1", name: "Renato Albuquerque", bib: "102", category: "Speed Elite", ageGroup: "18-29 anos", shirtSize: "P", status: "finished", finishTime: "01:12:45" },
  { id: "ath-3", eventId: "evt-1", name: "Bruna Maria Albuquerque", bib: "501", category: "Feminino Elite", ageGroup: "18-29 anos", shirtSize: "P", status: "finished", finishTime: "01:21:09" },
  { id: "ath-4", eventId: "evt-1", name: "Júlio Cesar Santos", bib: "103", category: "Speed Master B", ageGroup: "40-49 anos", shirtSize: "G", status: "checked_in" },
  { id: "ath-5", eventId: "evt-1", name: "Priscila Ferreira", bib: "502", category: "Feminino Amador", ageGroup: "30-39 anos", shirtSize: "M", status: "registered" }
];

export const initialProviders: Provider[] = [
  { id: "prov-1", name: "Alimentar Gourmet Buffet", category: "Catering", rating: 4.8, cost: 180, status: "contracted", phone: "(11) 98722-1111" },
  { id: "prov-2", name: "SegurMax Vigilância Armada", category: "Segurança", rating: 4.9, cost: 120, status: "contracted", phone: "(11) 97722-3344" },
  { id: "prov-3", name: "Portal da Ilusão Sonoplastia", category: "Audiovisual", rating: 4.5, cost: 250, status: "available", phone: "(11) 98833-4422" },
  { id: "prov-4", name: "EcoBrilho Limpeza Urbana", category: "Limpeza", rating: 4.7, cost: 80, status: "available", phone: "(11) 99111-2233" }
];

export const initialServiceTickets: ServiceTicket[] = [
  { id: "tkt-1", eventId: "evt-1", title: "Sinal de Wi-Fi caindo na tenda de imprensa", department: "TI", status: "in_progress", priority: "high", description: "O roteador principal da tenda de imprensa está sobrecarregado com conexões dos jornalistas. Necessário instalar ponto de acesso redundante com cabo de rede.", createdAt: "2026-07-05T08:30:00Z", assignee: "Marcos (TI)" },
  { id: "tkt-2", eventId: "evt-1", title: "Sujeira acumulada nos banheiros químicos VIP", department: "Limpeza", status: "open", priority: "medium", description: "Grande fluxo de participantes gerou acúmulo de lixo. Necessário acionar equipe volante para higienização e troca de insumos higiênicos.", createdAt: "2026-07-05T10:15:00Z" },
  { id: "tkt-3", eventId: "evt-1", title: "Grade de contenção deslocada na curva 3", department: "Infraestrutura", status: "closed", priority: "high", description: "Vento forte inclinou a placa inflável e deslocou duas grades metálicas de fixação. Equipe de pista realizou o reposicionamento com estacas adicionais.", createdAt: "2026-07-05T07:10:00Z", assignee: "Roberto (Pista)" }
];
