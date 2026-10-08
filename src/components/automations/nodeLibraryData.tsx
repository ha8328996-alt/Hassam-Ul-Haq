import React from 'react';
import {
  Zap,
  Globe,
  Calendar,
  FileText,
  MessageSquare,
  Bot,
  Brain,
  Tag,
  FileCheck,
  GitBranch,
  Split,
  Filter,
  ToggleLeft,
  UserPlus,
  UserCheck,
  Mail,
  Bell,
  MessageCircle,
  Send,
  Clock,
  Variable,
  FileCode,
  Sparkles,
  FileSpreadsheet,
  Hash,
} from 'lucide-react';
import { WorkflowNodeType } from '../../types';

export interface NodeTemplateDefinition {
  nodeKey: string;
  type: WorkflowNodeType;
  category: 'Triggers' | 'AI' | 'Logic' | 'Actions' | 'Utility';
  title: string;
  description: string;
  icon: string;
  defaultData: Record<string, any>;
}

export const NODE_LIBRARY: NodeTemplateDefinition[] = [
  // TRIGGERS
  {
    nodeKey: 'trigger_new_lead',
    type: 'trigger',
    category: 'Triggers',
    title: 'New Lead',
    description: 'Triggers when a new lead is captured or submitted into FlowPilot.',
    icon: 'zap',
    defaultData: {
      triggerType: 'new_lead',
      leadSource: 'All Sources',
      optionalFilters: 'score > 0',
    },
  },
  {
    nodeKey: 'trigger_web_form',
    type: 'trigger',
    category: 'Triggers',
    title: 'Web Form Submitted',
    description: 'Fires when an embedded website form or lead magnet is sent.',
    icon: 'file_text',
    defaultData: {
      triggerType: 'web_form',
      formName: 'Enterprise Demo Request',
      eventType: 'submit',
    },
  },
  {
    nodeKey: 'trigger_schedule',
    type: 'trigger',
    category: 'Triggers',
    title: 'Schedule',
    description: 'Runs on a recurring schedule, cron interval, or fixed timestamp.',
    icon: 'calendar',
    defaultData: {
      triggerType: 'schedule',
      frequency: 'Daily',
      scheduleTime: '08:00',
      scheduleDate: '2026-10-06',
      timezone: 'UTC',
    },
  },
  {
    nodeKey: 'trigger_webhook',
    type: 'trigger',
    category: 'Triggers',
    title: 'Webhook Received',
    description: 'Listens for incoming HTTP POST/GET payloads with HMAC support.',
    icon: 'globe',
    defaultData: {
      triggerType: 'webhook',
      httpMethod: 'POST',
      webhookPath: '/api/v1/inbound-events',
      headers: 'Content-Type: application/json',
      bodyFormat: 'json',
    },
  },
  {
    nodeKey: 'trigger_conversation',
    type: 'trigger',
    category: 'Triggers',
    title: 'New Conversation',
    description: 'Triggers when a customer starts an omnichannel chat or email thread.',
    icon: 'message_square',
    defaultData: {
      triggerType: 'new_conversation',
      channel: 'all',
      initialMessageFilter: '',
    },
  },

  // AI
  {
    nodeKey: 'ai_run_agent',
    type: 'ai_agent',
    category: 'AI',
    title: 'Run AI Agent',
    description: 'Executes an existing FlowPilot AI agent with contextual memory.',
    icon: 'bot',
    defaultData: {
      agentId: '',
      agentName: 'Select AI Agent',
      instructionsOverride: '',
      temperatureOverride: 0.2,
      responseFormat: 'text',
    },
  },
  {
    nodeKey: 'ai_generate_response',
    type: 'ai_agent',
    category: 'AI',
    title: 'Generate Response',
    description: 'Synthesizes tailored responses using prompt instructions.',
    icon: 'sparkles',
    defaultData: {
      modelOverride: 'Gemini 2.5 Pro',
      instructionsOverride: 'Draft an executive follow-up tailored to the prospect inquiry.',
      temperatureOverride: 0.3,
      responseFormat: 'text',
    },
  },
  {
    nodeKey: 'ai_classify_lead',
    type: 'ai_agent',
    category: 'AI',
    title: 'Classify Lead',
    description: 'Evaluates ICP intent score, firmographics, and revenue tiers.',
    icon: 'tag',
    defaultData: {
      modelOverride: 'Gemini 2.5 Flash',
      instructionsOverride: 'Score buyer intent (0-100) and assign segment (SMB, Mid-Market, Enterprise).',
      temperatureOverride: 0.1,
      responseFormat: 'json',
    },
  },
  {
    nodeKey: 'ai_summarize_text',
    type: 'ai_agent',
    category: 'AI',
    title: 'Summarize Text',
    description: 'Extracts action items, key objections, and executive bullet points.',
    icon: 'file_check',
    defaultData: {
      modelOverride: 'Gemini 2.5 Flash',
      instructionsOverride: 'Extract 3 critical buyer requirements and current blockers.',
      temperatureOverride: 0.2,
      responseFormat: 'markdown',
    },
  },

  // LOGIC
  {
    nodeKey: 'logic_condition',
    type: 'logic',
    category: 'Logic',
    title: 'Condition',
    description: 'Evaluates field conditions (e.g. Lead score > 70 OR status = "Qualified").',
    icon: 'git_branch',
    defaultData: {
      conditionLogic: 'OR',
      rules: [
        {
          id: 'rule_1',
          field: 'lead.score',
          operator: 'greater_than',
          value: '70',
        },
        {
          id: 'rule_2',
          field: 'lead.status',
          operator: 'equals',
          value: 'Qualified',
        },
      ],
    },
  },
  {
    nodeKey: 'logic_if_else',
    type: 'logic',
    category: 'Logic',
    title: 'If / Else',
    description: 'Splits execution into True and False branches based on evaluation.',
    icon: 'split',
    defaultData: {
      conditionLogic: 'AND',
      rules: [
        {
          id: 'rule_1',
          field: 'lead.company_size',
          operator: 'greater_or_equal',
          value: '50',
        },
      ],
    },
  },
  {
    nodeKey: 'logic_filter',
    type: 'logic',
    category: 'Logic',
    title: 'Filter',
    description: 'Halts automation execution if criteria are not satisfied.',
    icon: 'filter',
    defaultData: {
      conditionLogic: 'AND',
      rules: [
        {
          id: 'rule_1',
          field: 'lead.email',
          operator: 'is_not_empty',
          value: '',
        },
      ],
    },
  },
  {
    nodeKey: 'logic_switch',
    type: 'logic',
    category: 'Logic',
    title: 'Switch',
    description: 'Routes payloads across multiple case branches based on a variable value.',
    icon: 'toggle_left',
    defaultData: {
      switchField: 'lead.tier',
      cases: ['Enterprise', 'Growth', 'Starter'],
    },
  },

  // ACTIONS
  {
    nodeKey: 'action_create_lead',
    type: 'action',
    category: 'Actions',
    title: 'Create Lead',
    description: 'Persists a new qualified lead into the FlowPilot CRM pipeline.',
    icon: 'user_plus',
    defaultData: {
      leadName: '{{trigger.name}}',
      leadEmail: '{{trigger.email}}',
      leadPhone: '{{trigger.phone}}',
      leadSource: 'Automation Builder',
      leadStatus: 'qualified',
      leadCompany: '{{trigger.company}}',
    },
  },
  {
    nodeKey: 'action_update_lead',
    type: 'action',
    category: 'Actions',
    title: 'Update Lead',
    description: 'Modifies fields, score, or pipeline status on an existing lead.',
    icon: 'user_check',
    defaultData: {
      updateField: 'status',
      updateValue: 'contacted',
    },
  },
  {
    nodeKey: 'action_send_email',
    type: 'action',
    category: 'Actions',
    title: 'Send Email',
    description: 'Dispatches personalized email notifications (simulated in Demo Mode).',
    icon: 'mail',
    defaultData: {
      emailRecipient: '{{lead.email}}',
      emailSubject: 'Welcome to FlowPilot AI Enterprise Demo',
      emailBody: 'Hi {{lead.name}},\n\nThanks for connecting. Our AI agent has scheduled your onboarding walkthrough.',
    },
  },
  {
    nodeKey: 'action_send_notification',
    type: 'action',
    category: 'Actions',
    title: 'Send Notification',
    description: 'Emits an in-app system notification or alert banner to team members.',
    icon: 'bell',
    defaultData: {
      notifTitle: 'High-Intent Lead Qualified',
      notifMessage: 'Lead {{lead.name}} scored 94/100. Deal created.',
      notifRecipient: 'All Admins',
    },
  },
  {
    nodeKey: 'action_update_conversation',
    type: 'action',
    category: 'Actions',
    title: 'Update Conversation',
    description: 'Updates omnichannel thread status or appends simulated agent note.',
    icon: 'message_circle',
    defaultData: {
      conversationId: '{{conversation.id}}',
      conversationStatus: 'ai_handled',
      conversationMessage: 'Automated workflow processed customer query.',
    },
  },
  {
    nodeKey: 'action_webhook_request',
    type: 'action',
    category: 'Actions',
    title: 'Webhook Request',
    description: 'Dispatches an outbound HTTP request to external third-party endpoints.',
    icon: 'send',
    defaultData: {
      webhookUrl: 'https://api.crm-partner.com/v1/sync',
      webhookMethod: 'POST',
      webhookHeaders: 'Authorization: Bearer {{token}}\nContent-Type: application/json',
      webhookBody: '{\n  "event": "lead_qualified",\n  "lead_id": "{{lead.id}}"\n}',
    },
  },
  {
    nodeKey: 'action_google_sheets_append',
    type: 'action',
    category: 'Actions',
    title: 'Append Google Sheet Row',
    description: 'Inserts lead attributes or event records into a connected Google Spreadsheet.',
    icon: 'file_spreadsheet',
    defaultData: {
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      sheetRange: 'Sheet1!A:F',
      rowValues: '{{lead.name}}, {{lead.email}}, {{lead.company}}, {{lead.score}}, {{lead.status}}, {{timestamp}}',
    },
  },
  {
    nodeKey: 'action_slack_message',
    type: 'action',
    category: 'Actions',
    title: 'Post Slack Alert',
    description: 'Broadcasts markdown alerts to a connected Slack workspace channel.',
    icon: 'hash',
    defaultData: {
      slackChannel: '#leads-firehose',
      slackMessageText: '🚀 *New High-Intent Lead Captured*\n*Name:* {{lead.name}}\n*Company:* {{lead.company}}\n*Score:* {{lead.score}}/100',
    },
  },
  {
    nodeKey: 'action_gmail_send',
    type: 'action',
    category: 'Actions',
    title: 'Send Gmail Email',
    description: 'Sends personalized email sequences through authenticated Google Workspace Gmail.',
    icon: 'mail',
    defaultData: {
      toRecipient: '{{lead.email}}',
      emailSubject: 'Welcome to FlowPilot AI — Next Steps',
      emailBody: 'Hi {{lead.name}},\n\nThank you for reaching out to FlowPilot AI. We have provisioned your enterprise workspace.\n\nBest regards,\nFlowPilot Sales Team',
    },
  },
  {
    nodeKey: 'action_run_agent',
    type: 'action',
    category: 'Actions',
    title: 'Run AI Agent',
    description: 'Chains execution to another AI Agent for specialized task completion.',
    icon: 'bot',
    defaultData: {
      agentId: '',
      agentName: 'Select AI Agent',
      instructionsOverride: 'Perform secondary review and verification.',
      temperatureOverride: 0.2,
      responseFormat: 'text',
    },
  },

  // UTILITY
  {
    nodeKey: 'utility_delay',
    type: 'utility',
    category: 'Utility',
    title: 'Delay',
    description: 'Pauses workflow execution for a designated duration (e.g. 5 minutes).',
    icon: 'clock',
    defaultData: {
      delayDuration: 5,
      delayUnit: 'minutes',
    },
  },
  {
    nodeKey: 'utility_set_variable',
    type: 'utility',
    category: 'Utility',
    title: 'Set Variable',
    description: 'Stores or transforms contextual state for downstream workflow steps.',
    icon: 'variable',
    defaultData: {
      variableName: 'lead_priority',
      variableValue: 'VIP_HIGH_TIER',
    },
  },
  {
    nodeKey: 'utility_log_event',
    type: 'utility',
    category: 'Utility',
    title: 'Log Event',
    description: 'Records an audit log entry into the execution telemetry stream.',
    icon: 'file_code',
    defaultData: {
      eventName: 'lead_qualification_completed',
      logMessage: 'Successfully executed qualification pipeline with 0 errors.',
    },
  },
];

export function getNodeIconComponent(iconName: string, className = 'w-4 h-4') {
  switch (iconName) {
    case 'zap':
      return <Zap className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'file_text':
      return <FileText className={className} />;
    case 'message_square':
      return <MessageSquare className={className} />;
    case 'bot':
      return <Bot className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'brain':
      return <Brain className={className} />;
    case 'tag':
      return <Tag className={className} />;
    case 'file_check':
      return <FileCheck className={className} />;
    case 'git_branch':
      return <GitBranch className={className} />;
    case 'split':
      return <Split className={className} />;
    case 'filter':
      return <Filter className={className} />;
    case 'toggle_left':
      return <ToggleLeft className={className} />;
    case 'user_plus':
      return <UserPlus className={className} />;
    case 'user_check':
      return <UserCheck className={className} />;
    case 'mail':
      return <Mail className={className} />;
    case 'bell':
      return <Bell className={className} />;
    case 'message_circle':
      return <MessageCircle className={className} />;
    case 'send':
      return <Send className={className} />;
    case 'clock':
      return <Clock className={className} />;
    case 'variable':
      return <Variable className={className} />;
    case 'file_code':
      return <FileCode className={className} />;
    case 'file_spreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'hash':
      return <Hash className={className} />;
    default:
      return <Zap className={className} />;
  }
}
