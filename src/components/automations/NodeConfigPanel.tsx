import React, { useState } from 'react';
import {
  X,
  Trash2,
  Copy,
  Sliders,
  Plus,
  Bot,
  Globe,
  Mail,
  Bell,
  Clock,
  ExternalLink,
  Code2,
  AlertCircle,
  Sparkles,
  Tag,
  FileCheck,
  Split,
  Filter,
  ToggleLeft,
  UserPlus,
  UserCheck,
  MessageCircle,
  Send,
  Variable,
  FileCode,
  Info,
  FileSpreadsheet,
  Hash,
  AlertTriangle,
} from 'lucide-react';
import { WorkflowCanvasNode, WorkflowConditionRule } from '../../types';
import { useData } from '../../context/DataContext';
import { useRouter } from '../../context/RouterContext';
import { Button } from '../ui/Button';

interface NodeConfigPanelProps {
  node: WorkflowCanvasNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowCanvasNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onClose: () => void;
  className?: string;
}

export function NodeConfigPanel({
  node,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onClose,
  className = '',
}: NodeConfigPanelProps) {
  const { agents, integrations } = useData();
  const { navigate } = useRouter();

  if (!node) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-3">
          <Sliders className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-neutral-700 dark:text-neutral-300">
          No Node Selected
        </h4>
        <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
          Click on any node on the canvas to configure its triggers, AI prompts, conditions, or actions.
        </p>
      </div>
    );
  }

  const data = node.data || {};

  const handleDataChange = (field: string, value: any) => {
    onUpdateNode(node.id, {
      data: {
        ...data,
        [field]: value,
      },
    });
  };

  const rules: WorkflowConditionRule[] = data.rules || [
    { id: 'rule_1', field: 'lead.score', operator: 'greater_than', value: '70' },
  ];

  const handleRuleChange = (
    ruleId: string,
    field: keyof WorkflowConditionRule,
    value: string
  ) => {
    const updated = rules.map((r) => (r.id === ruleId ? { ...r, [field]: value } : r));
    handleDataChange('rules', updated);
  };

  const handleAddRule = () => {
    const newRule: WorkflowConditionRule = {
      id: 'rule_' + Date.now(),
      field: 'lead.status',
      operator: 'equals',
      value: 'Qualified',
    };
    handleDataChange('rules', [...rules, newRule]);
  };

  const handleRemoveRule = (ruleId: string) => {
    const updated = rules.filter((r) => r.id !== ruleId);
    handleDataChange('rules', updated.length > 0 ? updated : rules);
  };

  const selectedAgent = agents.find((a) => a.id === data.agentId);

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase font-semibold text-neutral-400">
              {node.category}
            </span>
            <span className="text-[10px] font-mono text-neutral-300 dark:text-neutral-600">•</span>
            <span className="text-[10px] font-mono text-neutral-400 truncate">
              {node.id}
            </span>
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate mt-0.5">
            {node.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onDuplicateNode(node.id)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Duplicate node"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteNode(node.id)}
            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
            title="Delete node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Basic Step Info */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            Step Title
          </label>
          <input
            type="text"
            value={node.title}
            onChange={(e) => onUpdateNode(node.id, { title: e.target.value })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            rows={2}
            value={node.description}
            onChange={(e) => onUpdateNode(node.id, { description: e.target.value })}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 leading-relaxed resize-none"
          />
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2" />

        {/* ========================================================
            1. TRIGGERS
        ======================================================== */}
        {node.nodeKey === 'trigger_new_lead' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              New Lead Trigger Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Lead Source
              </label>
              <select
                value={data.leadSource || 'All Sources'}
                onChange={(e) => handleDataChange('leadSource', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="All Sources">All Sources (Website, Forms, API)</option>
                <option value="Website Form">Website Form</option>
                <option value="Inbound API">Inbound API</option>
                <option value="HubSpot Sync">HubSpot Sync</option>
                <option value="LinkedIn Lead Gen">LinkedIn Lead Gen</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Optional Lead Filter
              </label>
              <input
                type="text"
                placeholder="e.g. score >= 50 AND country = 'US'"
                value={data.optionalFilters || ''}
                onChange={(e) => handleDataChange('optionalFilters', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'trigger_web_form' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Web Form Submitted Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Form Selection
              </label>
              <select
                value={data.formName || 'Enterprise Demo Request'}
                onChange={(e) => handleDataChange('formName', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="Enterprise Demo Request">Enterprise Demo Request</option>
                <option value="Contact Sales Form">Contact Sales Form</option>
                <option value="Newsletter Signup">Newsletter Signup</option>
                <option value="Pricing Calculator Form">Pricing Calculator Form</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Field Mapping
              </label>
              <textarea
                rows={3}
                value={data.fieldMapping || 'name -> lead.full_name\nemail -> lead.email\ncompany -> lead.company'}
                onChange={(e) => handleDataChange('fieldMapping', e.target.value)}
                placeholder="form_field -> target_field"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'trigger_schedule' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Schedule Trigger Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Frequency
              </label>
              <select
                value={data.frequency || 'Daily'}
                onChange={(e) => handleDataChange('frequency', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="Every 15 Minutes">Every 15 Minutes</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Execution Time
                </label>
                <input
                  type="time"
                  value={data.scheduleTime || '08:00'}
                  onChange={(e) => handleDataChange('scheduleTime', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Timezone
                </label>
                <select
                  value={data.timezone || 'UTC'}
                  onChange={(e) => handleDataChange('timezone', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {node.nodeKey === 'trigger_webhook' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Webhook Listener Config
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  HTTP Method
                </label>
                <select
                  value={data.httpMethod || 'POST'}
                  onChange={(e) => handleDataChange('httpMethod', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Body Format
                </label>
                <select
                  value={data.bodyFormat || 'json'}
                  onChange={(e) => handleDataChange('bodyFormat', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  <option value="json">application/json</option>
                  <option value="form-data">multipart/form-data</option>
                  <option value="raw">raw text/plain</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Webhook Path
              </label>
              <input
                type="text"
                value={data.webhookPath || '/api/v1/inbound-events'}
                onChange={(e) => handleDataChange('webhookPath', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Headers
              </label>
              <textarea
                rows={2}
                value={data.headers || 'Content-Type: application/json\nX-Webhook-Token: {{token}}'}
                onChange={(e) => handleDataChange('headers', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'trigger_conversation' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              New Conversation Trigger Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Channel
              </label>
              <select
                value={data.channel || 'all'}
                onChange={(e) => handleDataChange('channel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="all">All Channels</option>
                <option value="webchat">Webchat Widget</option>
                <option value="email">Inbound Email</option>
                <option value="slack">Slack Integration</option>
                <option value="whatsapp">WhatsApp Business</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Conversation Conditions
              </label>
              <input
                type="text"
                placeholder="e.g. contains 'pricing' OR priority = 'high'"
                value={data.initialMessageFilter || ''}
                onChange={(e) => handleDataChange('initialMessageFilter', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            2. AI NODES
        ======================================================== */}
        {(node.nodeKey === 'ai_run_agent' || node.nodeKey === 'action_run_agent') && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Run AI Agent Config
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Select Existing AI Agent
                </label>
                <button
                  onClick={() => navigate('/dashboard/agents')}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Manage Agents</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
              <select
                value={data.agentId || ''}
                onChange={(e) => {
                  const ag = agents.find((a) => a.id === e.target.value);
                  handleDataChange('agentId', e.target.value);
                  if (ag) {
                    handleDataChange('agentName', ag.name);
                    handleDataChange('modelOverride', ag.model);
                  }
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="">-- Choose AI Agent from Supabase --</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.model})
                  </option>
                ))}
              </select>
            </div>
            {selectedAgent && (
              <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-sky-500" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      {selectedAgent.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {selectedAgent.status}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 line-clamp-2">
                  Model: {selectedAgent.model}
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Input Data Context
              </label>
              <input
                type="text"
                placeholder="{{trigger.payload}}"
                value={data.inputContext || '{{trigger.payload}}'}
                onChange={(e) => handleDataChange('inputContext', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Instructions / Context Override
              </label>
              <textarea
                rows={3}
                value={data.instructionsOverride || ''}
                onChange={(e) => handleDataChange('instructionsOverride', e.target.value)}
                placeholder="Provide instructions specifically for this automation step..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white leading-relaxed resize-none font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'ai_generate_response' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Generate Response Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Input Source
              </label>
              <select
                value={data.inputSource || 'trigger_payload'}
                onChange={(e) => handleDataChange('inputSource', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="trigger_payload">Trigger Payload / Message</option>
                <option value="previous_step">Previous Step Output</option>
                <option value="custom_prompt">Custom Combined Prompt</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Assign AI Agent / Model
              </label>
              <select
                value={data.agentId || ''}
                onChange={(e) => handleDataChange('agentId', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="">Default Fast Responder (Gemini 2.5 Flash)</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.model})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Response Instructions
              </label>
              <textarea
                rows={3}
                value={data.instructionsOverride || ''}
                onChange={(e) => handleDataChange('instructionsOverride', e.target.value)}
                placeholder="Draft a personalized, helpful reply addressing the prospect's requirements."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white leading-relaxed resize-none font-mono text-[11px]"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'ai_classify_lead' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Classify Lead Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Input Field to Evaluate
              </label>
              <input
                type="text"
                value={data.inputField || '{{lead.company_description}}'}
                onChange={(e) => handleDataChange('inputField', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Classification Categories
              </label>
              <textarea
                rows={2}
                value={data.classificationCategories || 'Enterprise (>500 emp), Mid-Market (50-500 emp), SMB (<50 emp)'}
                onChange={(e) => handleDataChange('classificationCategories', e.target.value)}
                placeholder="List categories to classify against"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                AI Agent / Engine
              </label>
              <select
                value={data.modelOverride || 'Gemini 2.5 Flash'}
                onChange={(e) => handleDataChange('modelOverride', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Fast)</option>
                <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Reasoning)</option>
              </select>
            </div>
          </div>
        )}

        {node.nodeKey === 'ai_summarize_text' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Summarize Text Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Input Field
              </label>
              <input
                type="text"
                value={data.inputField || '{{conversation.transcript}}'}
                onChange={(e) => handleDataChange('inputField', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Output Variable
              </label>
              <input
                type="text"
                value={data.outputVariable || 'summary_result'}
                onChange={(e) => handleDataChange('outputVariable', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            3. LOGIC NODES
        ======================================================== */}
        {(node.nodeKey === 'logic_condition' ||
          node.nodeKey === 'logic_if_else' ||
          node.nodeKey === 'logic_filter') && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
                Condition Rules
              </h4>
              <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-0.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handleDataChange('conditionLogic', 'AND')}
                  className={`px-2 py-0.5 rounded cursor-pointer font-bold ${
                    (data.conditionLogic || 'OR') === 'AND'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-400'
                  }`}
                >
                  AND
                </button>
                <button
                  type="button"
                  onClick={() => handleDataChange('conditionLogic', 'OR')}
                  className={`px-2 py-0.5 rounded cursor-pointer font-bold ${
                    (data.conditionLogic || 'OR') === 'OR'
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-400'
                  }`}
                >
                  OR
                </button>
              </div>
            </div>

            {node.nodeKey === 'logic_if_else' && (
              <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 text-[11px] text-sky-800 dark:text-sky-300">
                <strong>If / Else Branching:</strong> True evaluates downstream node #1; False evaluates branch #2.
              </div>
            )}

            <div className="space-y-2">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>RULE #{idx + 1}</span>
                    {rules.length > 1 && (
                      <button
                        onClick={() => handleRemoveRule(rule.id)}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={rule.field}
                      onChange={(e) => handleRuleChange(rule.id, 'field', e.target.value)}
                      placeholder="Field (e.g. lead.score or status)"
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                    />
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleRuleChange(rule.id, 'operator', e.target.value as any)
                      }
                      className="w-full px-2 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-[11px]"
                    >
                      <option value="equals">= Equals</option>
                      <option value="not_equals">≠ Not Equals</option>
                      <option value="contains">Contains</option>
                      <option value="does_not_contain">Does Not Contain</option>
                      <option value="greater_than">&gt; Greater Than</option>
                      <option value="less_than">&lt; Less Than</option>
                      <option value="is_empty">Is Empty</option>
                      <option value="is_not_empty">Is Not Empty</option>
                    </select>
                    {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                        placeholder="Value (e.g. Qualified or 70)"
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                      />
                    )}
                  </div>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddRule}
                leftIcon={<Plus className="w-3 h-3" />}
                className="w-full text-xs"
              >
                Add Condition Rule
              </Button>
            </div>
          </div>
        )}

        {node.nodeKey === 'logic_switch' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Switch Logic Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Evaluation Field
              </label>
              <input
                type="text"
                value={data.switchField || 'lead.tier'}
                onChange={(e) => handleDataChange('switchField', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Cases (Comma-separated branches)
              </label>
              <input
                type="text"
                value={Array.isArray(data.cases) ? data.cases.join(', ') : (data.cases || 'Enterprise, Growth, Starter')}
                onChange={(e) =>
                  handleDataChange(
                    'cases',
                    e.target.value.split(',').map((s) => s.trim())
                  )
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            4. ACTION NODES
        ======================================================== */}
        {node.nodeKey === 'action_create_lead' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Create Lead Fields
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Name
              </label>
              <input
                type="text"
                value={data.leadName || '{{trigger.name}}'}
                onChange={(e) => handleDataChange('leadName', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Email
              </label>
              <input
                type="text"
                value={data.leadEmail || '{{trigger.email}}'}
                onChange={(e) => handleDataChange('leadEmail', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Phone
              </label>
              <input
                type="text"
                value={data.leadPhone || '{{trigger.phone}}'}
                onChange={(e) => handleDataChange('leadPhone', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Source
                </label>
                <input
                  type="text"
                  value={data.leadSource || 'Automation Pipeline'}
                  onChange={(e) => handleDataChange('leadSource', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Status
                </label>
                <select
                  value={data.leadStatus || 'qualified'}
                  onChange={(e) => handleDataChange('leadStatus', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="contacted">Contacted</option>
                  <option value="proposal">Proposal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {node.nodeKey === 'action_update_lead' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Update Lead Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Target Lead ID
              </label>
              <input
                type="text"
                value={data.targetLeadId || '{{trigger.lead_id}}'}
                onChange={(e) => handleDataChange('targetLeadId', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Fields to Update
              </label>
              <textarea
                rows={3}
                value={data.updateFields || 'status: "contacted"\nscore: 85\nassigned_rep: "Sarah Miller"'}
                onChange={(e) => handleDataChange('updateFields', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_send_email' && (
          <div className="space-y-3.5">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span><strong>DEMO MODE:</strong> Simulated email. No real outgoing mail is sent.</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                To Recipient
              </label>
              <input
                type="text"
                value={data.emailRecipient || '{{lead.email}}'}
                onChange={(e) => handleDataChange('emailRecipient', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Subject
              </label>
              <input
                type="text"
                value={data.emailSubject || 'Welcome to FlowPilot AI Enterprise Demo'}
                onChange={(e) => handleDataChange('emailSubject', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Message Body
              </label>
              <textarea
                rows={3}
                value={data.emailBody || 'Hi {{lead.name}},\n\nThanks for reaching out! Our team has scheduled your demo.'}
                onChange={(e) => handleDataChange('emailBody', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_send_notification' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Send Notification Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Notification Title
              </label>
              <input
                type="text"
                value={data.notifTitle || 'New High-Value Lead Qualified'}
                onChange={(e) => handleDataChange('notifTitle', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Message
              </label>
              <textarea
                rows={2}
                value={data.notifMessage || 'Lead {{lead.name}} scored 94/100. Deal created in CRM.'}
                onChange={(e) => handleDataChange('notifMessage', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Recipient
              </label>
              <select
                value={data.notifRecipient || 'All Admins'}
                onChange={(e) => handleDataChange('notifRecipient', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="All Admins">All Admins</option>
                <option value="Assigned Account Rep">Assigned Account Rep</option>
                <option value="Sales Channel">Slack Sales Channel</option>
              </select>
            </div>
          </div>
        )}

        {node.nodeKey === 'action_update_conversation' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Update Conversation Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Conversation ID
              </label>
              <input
                type="text"
                value={data.conversationId || '{{conversation.id}}'}
                onChange={(e) => handleDataChange('conversationId', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Status
              </label>
              <select
                value={data.conversationStatus || 'ai_handled'}
                onChange={(e) => handleDataChange('conversationStatus', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="open">Open</option>
                <option value="ai_handled">AI Handled</option>
                <option value="escalated">Escalated to Human</option>
                <option value="closed">Resolved / Closed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Message / Action Note
              </label>
              <textarea
                rows={2}
                value={data.conversationMessage || 'Workflow verified inquiry.'}
                onChange={(e) => handleDataChange('conversationMessage', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_webhook_request' && (
          <div className="space-y-3.5">
            {integrations.find((i) => i.key === 'webhooks')?.status !== 'connected' ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Integration Setup Required: Webhooks</span>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Webhooks are not connected or verified. Dispatches will execute in safe demo simulation mode until configured.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/integrations')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 underline hover:no-underline cursor-pointer"
                >
                  Configure in Integrations &rarr;
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Webhooks Integration Connected (Live HTTP Dispatches)</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Method
                </label>
                <select
                  value={data.webhookMethod || 'POST'}
                  onChange={(e) => handleDataChange('webhookMethod', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono font-bold"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Target URL
                </label>
                <input
                  type="text"
                  value={data.webhookUrl || 'https://api.crm-partner.com/v1/sync'}
                  onChange={(e) => handleDataChange('webhookUrl', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Headers
              </label>
              <textarea
                rows={2}
                value={data.webhookHeaders || 'Authorization: Bearer {{token}}\nContent-Type: application/json'}
                onChange={(e) => handleDataChange('webhookHeaders', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Payload Body
              </label>
              <textarea
                rows={3}
                value={data.webhookBody || '{\n  "event": "lead_qualified",\n  "lead_id": "{{lead.id}}"\n}'}
                onChange={(e) => handleDataChange('webhookBody', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_google_sheets_append' && (
          <div className="space-y-3.5">
            {integrations.find((i) => i.key === 'google_sheets')?.status !== 'connected' ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Integration Setup Required: Google Sheets</span>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Google Workspace OAuth is not active. This action will execute in simulated demo mode during testing.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/integrations')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 underline hover:no-underline cursor-pointer"
                >
                  Connect in Integrations &rarr;
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Google Sheets Connected (Live OAuth)</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Spreadsheet ID
              </label>
              <input
                type="text"
                value={data.spreadsheetId || ''}
                placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                onChange={(e) => handleDataChange('spreadsheetId', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Sheet & Range
              </label>
              <input
                type="text"
                value={data.sheetRange || 'Sheet1!A:F'}
                placeholder="Sheet1!A:F"
                onChange={(e) => handleDataChange('sheetRange', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Row Values (Comma Separated)
              </label>
              <textarea
                rows={2}
                value={data.rowValues || '{{lead.name}}, {{lead.email}}, {{lead.company}}, {{lead.score}}, {{lead.status}}, {{timestamp}}'}
                onChange={(e) => handleDataChange('rowValues', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_slack_message' && (
          <div className="space-y-3.5">
            {integrations.find((i) => i.key === 'slack')?.status !== 'connected' ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Integration Setup Required: Slack</span>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Slack bot credentials are not active. Messages will execute as simulated demo logs until connected.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/integrations')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 underline hover:no-underline cursor-pointer"
                >
                  Connect Slack &rarr;
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Slack Bot Connected</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Slack Channel
              </label>
              <input
                type="text"
                value={data.slackChannel || '#leads-firehose'}
                placeholder="#leads-firehose"
                onChange={(e) => handleDataChange('slackChannel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Message Body (Slack Markdown)
              </label>
              <textarea
                rows={3}
                value={data.slackMessageText || '🚀 *New High-Intent Lead Captured*\n*Name:* {{lead.name}}\n*Company:* {{lead.company}}\n*Score:* {{lead.score}}/100'}
                onChange={(e) => handleDataChange('slackMessageText', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'action_gmail_send' && (
          <div className="space-y-3.5">
            {integrations.find((i) => i.key === 'gmail')?.status !== 'connected' ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Integration Setup Required: Gmail</span>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  Gmail Workspace OAuth is not active. Email dispatches will run in simulated demo mode.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/integrations')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 underline hover:no-underline cursor-pointer"
                >
                  Connect Gmail &rarr;
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Gmail Account Connected</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                To Recipient
              </label>
              <input
                type="text"
                value={data.toRecipient || '{{lead.email}}'}
                placeholder="{{lead.email}}"
                onChange={(e) => handleDataChange('toRecipient', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Subject Line
              </label>
              <input
                type="text"
                value={data.emailSubject || 'Welcome to FlowPilot AI'}
                onChange={(e) => handleDataChange('emailSubject', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Body Content
              </label>
              <textarea
                rows={3}
                value={data.emailBody || 'Hi {{lead.name}},\n\nWelcome to FlowPilot AI.'}
                onChange={(e) => handleDataChange('emailBody', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            5. UTILITY NODES
        ======================================================== */}
        {node.nodeKey === 'utility_delay' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Delay Node Config
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Duration
                </label>
                <input
                  type="number"
                  min="1"
                  value={data.delayDuration || 5}
                  onChange={(e) => handleDataChange('delayDuration', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  Unit
                </label>
                <select
                  value={data.delayUnit || 'minutes'}
                  onChange={(e) => handleDataChange('delayUnit', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {node.nodeKey === 'utility_set_variable' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Set Variable Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Variable Name
              </label>
              <input
                type="text"
                placeholder="e.g. lead_priority"
                value={data.variableName || 'lead_priority'}
                onChange={(e) => handleDataChange('variableName', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Value
              </label>
              <input
                type="text"
                placeholder="e.g. VIP_HIGH_TIER"
                value={data.variableValue || 'VIP_HIGH_TIER'}
                onChange={(e) => handleDataChange('variableValue', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        )}

        {node.nodeKey === 'utility_log_event' && (
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Log Event Config
            </h4>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Event Name
              </label>
              <input
                type="text"
                value={data.eventName || 'lead_qualification_completed'}
                onChange={(e) => handleDataChange('eventName', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                Description
              </label>
              <input
                type="text"
                value={data.logMessage || 'Successfully qualified lead with 0 errors.'}
                onChange={(e) => handleDataChange('logMessage', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 flex items-center justify-between gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDuplicateNode(node.id)}
          leftIcon={<Copy className="w-3 h-3" />}
          className="text-xs"
        >
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDeleteNode(node.id)}
          leftIcon={<Trash2 className="w-3 h-3" />}
          className="text-xs"
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
}
