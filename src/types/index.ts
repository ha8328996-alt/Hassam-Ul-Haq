export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'User' | 'user' | string;

export interface OnboardingData {
  automationGoals?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  workspaceName?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  workspaceName: string;
  plan: 'free' | 'Free' | 'Starter' | 'Professional' | 'Business' | 'Enterprise' | string;
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData;
  createdAt?: string;
  updatedAt?: string;
}

export type AgentStatus = 'active' | 'inactive' | 'draft' | 'paused' | 'training' | string;

export interface AgentToolsConfig {
  webSearch: boolean;
  leadCapture: boolean;
  email: boolean;
  calendar: boolean;
  crm: boolean;
  webhook: boolean;
}

export interface AgentMemoryConfig {
  enableMemory: boolean;
  conversationMemory: boolean;
  customerInfo: boolean;
}

export interface AgentHumanHandoffConfig {
  enabled: boolean;
  condition: string;
}

export interface AgentKnowledgeConfig {
  name: string;
  description: string;
  sources: string[];
}

export interface Agent {
  id: string;
  user_id?: string;
  name: string;
  role: string;
  model: string;
  status: AgentStatus;
  totalExecutions: number;
  avgLatencyMs: number;
  successRate: number;
  description: string;
  systemPrompt: string;
  system_instructions?: string;
  temperature: number;
  capabilities: string[];
  lastActive: string;
  avatarIcon?: string;
  responseStyle?: 'Professional' | 'Friendly' | 'Concise' | 'Detailed';
  tools?: AgentToolsConfig;
  memory?: AgentMemoryConfig;
  humanHandoff?: AgentHumanHandoffConfig;
  knowledge?: AgentKnowledgeConfig;
  conversationsCount?: number;
  tasksCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AutomationTriggerType =
  | 'webhook'
  | 'lead_created'
  | 'email_received'
  | 'schedule'
  | 'slack_command'
  | 'web_form'
  | 'conversation_started'
  | string;

export type AutomationStatus = 'active' | 'paused' | 'draft' | string;

export type WorkflowNodeType = 'trigger' | 'ai_agent' | 'logic' | 'action' | 'utility';

export interface WorkflowConditionRule {
  id: string;
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'greater_or_equal'
    | 'less_or_equal'
    | 'is_empty'
    | 'is_not_empty';
  value: string;
}

export interface WorkflowNodeData {
  title?: string;
  description?: string;
  category?: string;
  icon?: string;
  triggerType?: string;
  leadSource?: string;
  frequency?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  timezone?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  webhookPath?: string;
  headers?: string;
  bodyFormat?: 'json' | 'form-data' | 'raw';
  formName?: string;
  eventType?: string;
  agentId?: string;
  agentName?: string;
  modelOverride?: string;
  instructionsOverride?: string;
  temperatureOverride?: number;
  responseFormat?: 'text' | 'json' | 'markdown';
  conditionLogic?: 'AND' | 'OR';
  rules?: WorkflowConditionRule[];
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  leadCompany?: string;
  leadStatus?: string;
  updateField?: string;
  updateValue?: string;
  emailRecipient?: string;
  emailSubject?: string;
  emailBody?: string;
  notifTitle?: string;
  notifMessage?: string;
  notifRecipient?: string;
  webhookUrl?: string;
  webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  webhookHeaders?: string;
  webhookBody?: string;
  conversationId?: string;
  conversationMessage?: string;
  conversationStatus?: string;
  delayDuration?: number;
  delayUnit?: 'seconds' | 'minutes' | 'hours' | 'days';
  variableName?: string;
  variableValue?: string;
  eventName?: string;
  logMessage?: string;
  executionStatus?: 'idle' | 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  executionLogs?: string[];
  [key: string]: any;
}

export interface WorkflowCanvasNode {
  id: string;
  type: WorkflowNodeType;
  nodeKey: string;
  title: string;
  description: string;
  category: 'Triggers' | 'AI' | 'Logic' | 'Actions' | 'Utility';
  icon: string;
  x: number;
  y: number;
  data: WorkflowNodeData;
}

export interface WorkflowCanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface WorkflowData {
  nodes: WorkflowCanvasNode[];
  edges: WorkflowCanvasEdge[];
}

export interface AutomationStep {
  id: string;
  type: 'trigger' | 'action';
  title: string;
  description: string;
  service: string;
}

export interface Automation {
  id: string;
  user_id?: string;
  name: string;
  description: string;
  category?: 'Lead Gen' | 'Customer Support' | 'CRM Sync' | 'Operations' | string;
  status: AutomationStatus;
  triggerType: AutomationTriggerType;
  steps: AutomationStep[];
  workflow_data?: WorkflowData;
  configuration?: Record<string, any>;
  runCount: number;
  successRate: number;
  lastRun: string;
  lastRunAt?: string;
  createdAt: string;
  updatedAt?: string;
  successfulRuns?: number;
  failedRuns?: number;
}

export type ChannelType = 'email' | 'slack' | 'whatsapp' | 'webchat';
export type ConversationStatus = 'ai_handled' | 'needs_human' | 'resolved';

export interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'human';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  channel: ChannelType;
  status: ConversationStatus;
  assignedAgent: string;
  sentiment: 'positive' | 'neutral' | 'urgent';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'converted'
  | 'lost'
  | 'unqualified'
  | string;

export interface Lead {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  score: number;
  status: LeadStatus;
  estimatedValue: number;
  source: string;
  country?: string;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
  aiNotes?: string;
  createdAt: string;
  updatedAt?: string;
  lastContacted?: string;
  lastActivity?: string;
}

export type LeadActivityType =
  | 'created'
  | 'status_changed'
  | 'note_added'
  | 'updated'
  | 'email'
  | 'automation'
  | 'ai_agent';

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id?: string;
  activity_type: LeadActivityType;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  user_id?: string;
  note: string;
  author_name?: string;
  created_at: string;
  updated_at?: string;
}

export type IntegrationCategory =
  | 'All'
  | 'Productivity'
  | 'Communication'
  | 'Developer Tools'
  | 'CRM'
  | 'Payment'
  | 'Database';

export type IntegrationStatus = 'connected' | 'disconnected' | 'setup_required' | 'pending';

export interface IntegrationConfiguration {
  webhookUrl?: string;
  webhookMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  webhookHeaders?: string | Record<string, string>;
  webhookEvents?: string[];
  accountEmail?: string;
  channelName?: string;
  spreadsheetId?: string;
  spreadsheetName?: string;
  fromName?: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'not_tested';
  lastTestMessage?: string;
  lastLatencyMs?: number;
  [key: string]: any;
}

export interface Integration {
  id: string;
  key: string;
  name: string;
  category: 'Productivity' | 'Communication' | 'Developer Tools' | 'CRM' | 'Payment' | 'Database';
  description: string;
  status: IntegrationStatus;
  lastSync?: string;
  authType: 'oauth' | 'api_key' | 'webhook';
  accountName?: string;
  setupRequired?: boolean;
  configuration?: IntegrationConfiguration;
  errorMessage?: string;
  iconName?: string;
  docsUrl?: string;
  eventsSupported?: string[];
}

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  triggerType: AutomationTriggerType;
  actionsCount: number;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  executionsEstimate: string;
  steps: AutomationStep[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  status: 'active' | 'invited';
  joinedDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'automation' | 'lead' | 'agent' | 'system';
  link?: string;
}

export interface EventLog {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  source: string;
}
