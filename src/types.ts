export interface Event {
  id: string;
  name: string;
  date: string;
  endDate: string;
  description: string;
  category: 'corporate' | 'sports' | 'show_festival' | 'wedding_social' | 'government' | 'other';
  venue: string;
  capacity: number;
  status: 'planning' | 'active' | 'live' | 'completed';
  logoUrl?: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ChecklistItem {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
  category: 'infra' | 'security' | 'marketing' | 'finance' | 'legal' | 'production' | 'sports';
  priority: 'low' | 'medium' | 'high';
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
}

export interface TicketSale {
  id: string;
  eventId: string;
  tierId: string;
  buyerName: string;
  buyerEmail: string;
  timestamp: string;
  checkedIn: boolean;
  checkedInAt?: string;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
}

export interface Transaction {
  id: string;
  eventId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  centerOfCost: string;
}

export interface CRMContact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  status: 'lead' | 'contacted' | 'negotiation' | 'signed';
  value: number;
  type: 'sponsor' | 'contractor' | 'partner';
}

export interface Contract {
  id: string;
  title: string;
  partyName: string;
  partyType: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'expired';
  value: number;
  signedDate?: string;
  content: string;
}

export interface Athlete {
  id: string;
  eventId: string;
  name: string;
  bib: string;
  category: string;
  ageGroup: string;
  shirtSize: 'P' | 'M' | 'G' | 'GG';
  status: 'registered' | 'checked_in' | 'finished';
  finishTime?: string; // e.g. "01:24:53"
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  cost: number;
  status: 'available' | 'contracted';
  phone: string;
}

export interface ServiceTicket {
  id: string;
  eventId: string;
  title: string;
  department: 'TI' | 'Limpeza' | 'Segurança' | 'Infraestrutura' | 'Produção';
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: string;
  assignee?: string;
}

export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: Event['category'];
  venue: string;
  capacity: number;
  tasks: Omit<Task, 'id' | 'eventId'>[];
  checklists: Omit<ChecklistItem, 'id' | 'eventId'>[];
  ticketTiers: Omit<TicketTier, 'id' | 'eventId'>[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'volunteer' | 'staff' | 'coordinator';
  department: 'TI' | 'Limpeza' | 'Segurança' | 'Infraestrutura' | 'Produção';
  points: number;
  rating: number;
  attendance: number;
  badges: string[];
  completedTasksCount: number;
}

export type SidebarTab = 
  | 'coe' 
  | 'events' 
  | 'timeline' 
  | 'checklist' 
  | 'ticketing' 
  | 'finance' 
  | 'crm' 
  | 'sports' 
  | 'marketplace' 
  | 'chamados'
  | 'staff'
  | 'analytics'
  | 'rbac'
  | 'enterprise';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<SidebarTab, boolean>;
  isSystem?: boolean; // system-defined roles like Administrator cannot be deleted
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'inactive';
}

