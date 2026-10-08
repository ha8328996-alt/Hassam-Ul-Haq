import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import {
  Zap,
  Bot,
  Globe,
  Database,
  Calendar,
  CreditCard,
  Clock,
  Filter,
  Radio,
  Mail,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Play,
  Save,
  X,
  Trash2,
  Settings2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'agent' | 'logic' | 'action';
  title: string;
  subtitle: string;
  category: string;
  iconName: 'webhook' | 'lead' | 'email' | 'schedule' | 'agent_qualifier' | 'agent_support' | 'agent_concierge' | 'filter' | 'delay' | 'hubspot' | 'slack' | 'stripe';
  x: number;
  y: number;
  config: {
    endpoint?: string;
    model?: string;
    prompt?: string;
    channel?: string;
    condition?: string;
    delaySeconds?: number;
    destination?: string;
  };
  status?: 'idle' | 'running' | 'success' | 'error';
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

const PALETTE_TEMPLATES: Array<Omit<WorkflowNode, 'id' | 'x' | 'y'>> = [
  {
    type: 'trigger',
    title: 'Webhook Ingest',
    subtitle: 'HTTP POST listener with HMAC signature',
    category: 'Trigger',
    iconName: 'webhook',
    config: { endpoint: '/api/v1/events/inbound' },
  },
  {
    type: 'trigger',
    title: 'New Lead Submission',
    subtitle: 'Captures form submission from website',
    category: 'Trigger',
    iconName: 'lead',
    config: { endpoint: '/forms/enterprise-demo' },
  },
  {
    type: 'trigger',
    title: 'Inbound Support Email',
    subtitle: 'Triggers on incoming message to support@',
    category: 'Trigger',
    iconName: 'email',
    config: { endpoint: 'support@acme-ops.com' },
  },
  {
    type: 'trigger',
    title: 'Recurring Schedule',
    subtitle: 'Cron interval (e.g. 08:00 AM daily)',
    category: 'Trigger',
    iconName: 'schedule',
    config: { endpoint: '0 8 * * 1-5' },
  },
  {
    type: 'agent',
    title: 'Inbound Qualifier Agent',
    subtitle: 'Enriches domain & calculates ICP fit score',
    category: 'AI Agent',
    iconName: 'agent_qualifier',
    config: {
      model: 'Gemini 2.5 Pro',
      prompt: 'Evaluate buying intent, revenue tier, and route high-fit leads.',
    },
  },
  {
    type: 'agent',
    title: 'Support Dispatcher Agent',
    subtitle: 'Resolves API doc queries & ticket triage',
    category: 'AI Agent',
    iconName: 'agent_support',
    config: {
      model: 'Gemini 2.5 Flash',
      prompt: 'Verify error logs and initiate warm human handover if sentiment < 0.3.',
    },
  },
  {
    type: 'agent',
    title: 'Meeting Concierge Agent',
    subtitle: 'Coordinates timezone & booking invites',
    category: 'AI Agent',
    iconName: 'agent_concierge',
    config: {
      model: 'Gemini 2.5 Flash',
      prompt: 'Propose optimal slots across calendar availability.',
    },
  },
  {
    type: 'logic',
    title: 'Sentiment Filter',
    subtitle: 'Branch if sentiment is urgent or negative',
    category: 'Logic',
    iconName: 'filter',
    config: { condition: 'sentiment == "urgent"' },
  },
  {
    type: 'logic',
    title: 'Wait & Grace Period',
    subtitle: 'Delay execution for defined interval',
    category: 'Logic',
    iconName: 'delay',
    config: { delaySeconds: 300 },
  },
  {
    type: 'action',
    title: 'Sync to HubSpot CRM',
    subtitle: 'Upsert contact & create pipeline deal',
    category: 'Action',
    iconName: 'hubspot',
    config: { destination: 'Pipeline: Enterprise Deals' },
  },
  {
    type: 'action',
    title: 'Alert Slack Channel',
    subtitle: 'Post interactive card with action buttons',
    category: 'Action',
    iconName: 'slack',
    config: { destination: '#pipeline-alerts' },
  },
  {
    type: 'action',
    title: 'Stripe Smart Dunning',
    subtitle: 'Dispatch recovery email with payment link',
    category: 'Action',
    iconName: 'stripe',
    config: { destination: 'Customer Billing Portal' },
  },
];

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'node_1',
    type: 'trigger',
    title: 'Webhook Ingest',
    subtitle: 'POST /api/v1/leads/demo',
    category: 'Trigger',
    iconName: 'webhook',
    x: 60,
    y: 140,
    config: { endpoint: '/api/v1/leads/demo' },
  },
  {
    id: 'node_2',
    type: 'agent',
    title: 'Inbound Qualifier Agent',
    subtitle: 'Gemini 2.5 Pro • ICP Intent',
    category: 'AI Agent',
    iconName: 'agent_qualifier',
    x: 380,
    y: 140,
    config: { model: 'Gemini 2.5 Pro', prompt: 'Score 0-100 based on firmographics.' },
  },
  {
    id: 'node_3',
    type: 'action',
    title: 'Sync to HubSpot CRM',
    subtitle: 'Upsert Contact & Deal Stage',
    category: 'Action',
    iconName: 'hubspot',
    x: 700,
    y: 80,
    config: { destination: 'Pipeline: Enterprise Sales' },
  },
  {
    id: 'node_4',
    type: 'action',
    title: 'Alert Slack Channel',
    subtitle: 'Notify #pipeline-alerts',
    category: 'Action',
    iconName: 'slack',
    x: 700,
    y: 240,
    config: { destination: '#pipeline-alerts' },
  },
];

const INITIAL_CONNECTIONS: WorkflowConnection[] = [
  { id: 'conn_1_2', fromNodeId: 'node_1', toNodeId: 'node_2' },
  { id: 'conn_2_3', fromNodeId: 'node_2', toNodeId: 'node_3', label: 'Score > 80' },
  { id: 'conn_2_4', fromNodeId: 'node_2', toNodeId: 'node_4', label: 'VIP Notification' },
];

interface VisualWorkflowEditorProps {
  initialWorkflowName?: string;
  onSave?: (name: string, nodes: WorkflowNode[]) => void;
  onClose?: () => void;
}

export function VisualWorkflowEditor({
  initialWorkflowName = 'Inbound Enterprise Qualification Flow',
  onSave,
  onClose,
}: VisualWorkflowEditorProps) {
  const { success, error, info } = useToast();
  const { createAutomation } = useData();
  const [workflowName, setWorkflowName] = useState(initialWorkflowName);
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<WorkflowConnection[]>(INITIAL_CONNECTIONS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulatingRun, setIsSimulatingRun] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const renderNodeIcon = (name: WorkflowNode['iconName']) => {
    switch (name) {
      case 'webhook':
        return <Globe className="w-4 h-4 text-emerald-500" />;
      case 'lead':
        return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-emerald-500" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'agent_qualifier':
      case 'agent_support':
      case 'agent_concierge':
        return <Bot className="w-4 h-4 text-sky-500" />;
      case 'filter':
        return <Filter className="w-4 h-4 text-amber-500" />;
      case 'delay':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'hubspot':
        return <Database className="w-4 h-4 text-purple-500" />;
      case 'slack':
        return <Radio className="w-4 h-4 text-purple-500" />;
      case 'stripe':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-neutral-400" />;
    }
  };

  const handleNodeMouseDown = (e: MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
    const mouseY = (e.clientY - canvasRect.top) / zoomLevel;
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y,
    });
    setSelectedNodeId(nodeId);
  };

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / zoomLevel;
    const mouseY = (e.clientY - canvasRect.top) / zoomLevel;
    const newX = Math.max(10, Math.round(mouseX - dragOffset.x));
    const newY = Math.max(10, Math.round(mouseY - dragOffset.y));
    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handlePaletteDragStart = (e: React.DragEvent, template: (typeof PALETTE_TEMPLATES)[0]) => {
    e.dataTransfer.setData('application/flowpilot-node', JSON.stringify(template));
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const data = e.dataTransfer.getData('application/flowpilot-node');
    if (!data) return;
    try {
      const template = JSON.parse(data) as (typeof PALETTE_TEMPLATES)[0];
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const dropX = Math.max(20, Math.round((e.clientX - canvasRect.left) / zoomLevel - 100));
      const dropY = Math.max(20, Math.round((e.clientY - canvasRect.top) / zoomLevel - 40));
      const newNodeId = 'node_' + Math.random().toString(36).substring(2, 7);
      const newNode: WorkflowNode = {
        ...template,
        id: newNodeId,
        x: dropX,
        y: dropY,
      };
      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNodeId);

      if (selectedNodeId) {
        setConnections((prev) => [
          ...prev,
          {
            id: `conn_${selectedNodeId}_${newNodeId}`,
            fromNodeId: selectedNodeId,
            toNodeId: newNodeId,
          },
        ]);
        info('Node Linked', 'Connected to previous node');
      } else {
        success('Node Added', `Added ${newNode.title} to workflow canvas.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePortClick = (e: MouseEvent, nodeId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (isOutput) {
      setConnectingFromId(nodeId);
      info('Link Output', 'Now click an input port on target node to connect.');
    } else {
      if (connectingFromId && connectingFromId !== nodeId) {
        const exists = connections.some(
          (c) => c.fromNodeId === connectingFromId && c.toNodeId === nodeId
        );
        if (!exists) {
          setConnections((prev) => [
            ...prev,
            {
              id: `conn_${connectingFromId}_${nodeId}`,
              fromNodeId: connectingFromId,
              toNodeId: nodeId,
            },
          ]);
          success('Connection Created', 'Linked execution flow between nodes.');
        }
        setConnectingFromId(null);
      }
    }
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromNodeId !== id && c.toNodeId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    success('Node Removed', 'Removed step from canvas.');
  };

  const handleAutoLayout = () => {
    const spacingX = 300;
    const baseY = 160;
    setNodes((prev) =>
      prev.map((n, idx) => ({
        ...n,
        x: 60 + idx * spacingX,
        y: baseY + (idx % 2 === 0 ? 0 : 60),
      }))
    );
    success('Tidied Canvas', 'Arranged workflow nodes sequentially.');
  };

  const handleTestRun = () => {
    if (isSimulatingRun) return;
    if (nodes.length === 0) {
      error('Empty Workflow', 'Add at least one trigger node to test execution.');
      return;
    }
    setIsSimulatingRun(true);
    setExecutionLogs([]);
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));
    let stepIndex = 0;

    const runNext = () => {
      if (stepIndex >= nodes.length) {
        setIsSimulatingRun(false);
        success('Execution Succeeded', `Processed all ${nodes.length} nodes with 0 errors.`);
        setExecutionLogs((prev) => [...prev, '✓ Complete workflow trace executed cleanly.']);
        return;
      }
      const currentNode = nodes[stepIndex];
      setNodes((prev) =>
        prev.map((n, i) => (i === stepIndex ? { ...n, status: 'running' } : n))
      );
      setExecutionLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Running Step ${stepIndex + 1}: ${currentNode.title}...`,
      ]);
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n, i) => (i === stepIndex ? { ...n, status: 'success' } : n))
        );
        setExecutionLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ✓ Step ${stepIndex + 1} passed (Latency: ${
            Math.floor(Math.random() * 200) + 80
          }ms)`,
        ]);
        stepIndex++;
        runNext();
      }, 900);
    };
    runNext();
  };

  const handleSaveWorkflow = () => {
    if (nodes.length === 0) {
      error('Cannot Save', 'Workflow requires at least one node.');
      return;
    }
    createAutomation({
      name: workflowName,
      description: `Visual workflow with ${nodes.length} steps and ${connections.length} links.`,
      category: 'Lead Gen',
      status: 'active',
      triggerType: (nodes[0]?.type === 'trigger' ? 'webhook' : 'schedule') as any,
      steps: nodes.map((n) => ({
        id: n.id,
        type: n.type === 'trigger' ? 'trigger' : 'action',
        title: n.title,
        description: n.subtitle,
        service: n.category,
      })),
    });
    success('Workflow Deployed', `"${workflowName}" is now active in your automations engine.`);
    if (onSave) onSave(workflowName, nodes);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-[740px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xl select-none">
      <div className="h-14 px-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-white dark:bg-neutral-900 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-400 focus:outline-none transition-colors truncate"
            />
            <p className="text-[10px] text-neutral-400 font-mono">
              Visual Canvas • {nodes.length} nodes • {connections.length} connections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:text-neutral-900 dark:hover:text-white text-neutral-400 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] px-1 text-neutral-500">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:text-neutral-900 dark:hover:text-white text-neutral-400 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-neutral-900 dark:hover:text-white text-neutral-400 cursor-pointer"
              title="Reset 100%"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAutoLayout}
            leftIcon={<Move className="w-3.5 h-3.5" />}
            className="hidden md:inline-flex"
          >
            Auto-Tidy
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleTestRun}
            isLoading={isSimulatingRun}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
          >
            {isSimulatingRun ? 'Testing Trace...' : 'Test Run'}
          </Button>
          <Button
            size="sm"
            onClick={handleSaveWorkflow}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Deploy Flow
          </Button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
              title="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Node Palette */}
        <div className="w-60 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col shrink-0">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Component Palette
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Drag to canvas</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Triggers
              </p>
              <div className="space-y-1.5">
                {PALETTE_TEMPLATES.filter((t) => t.type === 'trigger').map((t, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handlePaletteDragStart(e, t)}
                    onClick={() => {
                      const newNodeId = 'node_' + Math.random().toString(36).substring(2, 7);
                      setNodes((prev) => [
                        ...prev,
                        { ...t, id: newNodeId, x: 100 + prev.length * 40, y: 140 },
                      ]);
                      setSelectedNodeId(newNodeId);
                      success('Node Added', `Added ${t.title}`);
                    }}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-grab active:cursor-grabbing transition-all flex items-center gap-2 group shadow-2xs"
                  >
                    {renderNodeIcon(t.iconName)}
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-[11px]">
                        {t.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{t.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Autonomous Agents
              </p>
              <div className="space-y-1.5">
                {PALETTE_TEMPLATES.filter((t) => t.type === 'agent').map((t, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handlePaletteDragStart(e, t)}
                    onClick={() => {
                      const newNodeId = 'node_' + Math.random().toString(36).substring(2, 7);
                      setNodes((prev) => [
                        ...prev,
                        { ...t, id: newNodeId, x: 200 + prev.length * 40, y: 140 },
                      ]);
                      setSelectedNodeId(newNodeId);
                      success('Agent Node Added', `Added ${t.title}`);
                    }}
                    className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-grab active:cursor-grabbing transition-all flex items-center gap-2 group shadow-2xs"
                  >
                    {renderNodeIcon(t.iconName)}
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-[11px]">
                        {t.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{t.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Actions & Integrations
              </p>
              <div className="space-y-1.5">
                {PALETTE_TEMPLATES.filter((t) => t.type === 'action' || t.type === 'logic').map(
                  (t, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={(e) => handlePaletteDragStart(e, t)}
                      onClick={() => {
                        const newNodeId = 'node_' + Math.random().toString(36).substring(2, 7);
                        setNodes((prev) => [
                          ...prev,
                          { ...t, id: newNodeId, x: 300 + prev.length * 40, y: 140 },
                        ]);
                        setSelectedNodeId(newNodeId);
                        success('Action Added', `Added ${t.title}`);
                      }}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 cursor-grab active:cursor-grabbing transition-all flex items-center gap-2 group shadow-2xs"
                    >
                      {renderNodeIcon(t.iconName)}
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-[11px]">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">{t.subtitle}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          onClick={() => {
            setSelectedNodeId(null);
            setConnectingFromId(null);
          }}
          className="flex-1 relative overflow-auto bg-neutral-50 dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] cursor-default"
          style={{ minWidth: 600, minHeight: 600 }}
        >
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              width: '2400px',
              height: '1600px',
              position: 'relative',
            }}
          >
            <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
                const toNode = nodes.find((n) => n.id === conn.toNodeId);
                if (!fromNode || !toNode) return null;
                const x1 = fromNode.x + 220;
                const y1 = fromNode.y + 44;
                const x2 = toNode.x;
                const y2 = toNode.y + 44;
                const dx = Math.abs(x2 - x1) * 0.5;
                const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
                const isConnectedToRunning =
                  fromNode.status === 'running' || toNode.status === 'running';

                return (
                  <g key={conn.id}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isConnectedToRunning ? '#10B981' : '#6B7280'}
                      strokeWidth={isConnectedToRunning ? '3' : '2'}
                      strokeOpacity={isConnectedToRunning ? '0.8' : '0.4'}
                      strokeDasharray={isConnectedToRunning ? '6,6' : undefined}
                      className={isConnectedToRunning ? 'animate-pulse' : ''}
                    />
                    <circle cx={x2} cy={y2} r="3" fill="#10B981" />
                    {conn.label && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 8}
                        fill="#9CA3AF"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isSource = connectingFromId === node.id;
              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                    position: 'absolute',
                    width: '220px',
                  }}
                  className={`z-20 rounded-xl bg-white dark:bg-neutral-900 border transition-shadow cursor-grab active:cursor-grabbing select-none ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white shadow-xl ring-2 ring-neutral-400 dark:ring-neutral-600'
                      : node.status === 'running'
                      ? 'border-emerald-500 shadow-emerald-500/20 shadow-lg'
                      : node.status === 'success'
                      ? 'border-emerald-500/60 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 shadow-md hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {node.type !== 'trigger' && (
                    <button
                      onClick={(e) => handlePortClick(e, node.id, false)}
                      className="absolute -left-2.5 top-[38px] w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 border-2 border-white dark:border-neutral-900 hover:bg-emerald-500 hover:scale-125 transition-all flex items-center justify-center cursor-crosshair z-30"
                      title="Link input port"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handlePortClick(e, node.id, true)}
                    className={`absolute -right-2.5 top-[38px] w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 hover:scale-125 transition-all flex items-center justify-center cursor-crosshair z-30 ${
                      isSource
                        ? 'bg-emerald-500 scale-125 animate-ping'
                        : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-emerald-500'
                    }`}
                    title="Click to link to another node"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </button>

                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {renderNodeIcon(node.iconName)}
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                          {node.category}
                        </span>
                      </div>
                      {node.status === 'running' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {node.subtitle}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span className="truncate max-w-[140px]">
                        {node.config.endpoint ||
                          node.config.model ||
                          node.config.destination ||
                          'Configured'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-neutral-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                        title="Delete node"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Selected Node Inspector */}
        {selectedNode ? (
          <div className="w-64 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0 animate-in slide-in-from-right duration-150">
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-neutral-400" />
                Step Inspector
              </span>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <Input
                label="Node Name"
                value={selectedNode.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setNodes((prev) =>
                    prev.map((n) => (n.id === selectedNode.id ? { ...n, title: val } : n))
                  );
                }}
              />
              <Input
                label="Summary / Description"
                value={selectedNode.subtitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setNodes((prev) =>
                    prev.map((n) => (n.id === selectedNode.id ? { ...n, subtitle: val } : n))
                  );
                }}
              />
              {selectedNode.type === 'trigger' && (
                <Input
                  label="Ingestion Endpoint"
                  value={selectedNode.config.endpoint || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, config: { ...n.config, endpoint: val } }
                          : n
                      )
                    );
                  }}
                />
              )}
              {selectedNode.type === 'agent' && (
                <div className="space-y-3">
                  <Select
                    label="Model Engine"
                    value={selectedNode.config.model || 'Gemini 2.5 Pro'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, config: { ...n.config, model: val } }
                            : n
                        )
                      );
                    }}
                    options={[
                      { value: 'Gemini 2.5 Pro', label: 'Gemini 2.5 Pro' },
                      { value: 'Gemini 2.5 Flash', label: 'Gemini 2.5 Flash' },
                    ]}
                  />
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Reasoning Goal
                    </label>
                    <textarea
                      rows={3}
                      value={selectedNode.config.prompt || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, config: { ...n.config, prompt: val } }
                              : n
                          )
                        );
                      }}
                      className="w-full text-xs rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white p-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-400 font-mono"
                    />
                  </div>
                </div>
              )}
              {selectedNode.type === 'action' && (
                <Input
                  label="Target Destination"
                  value={selectedNode.config.destination || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, config: { ...n.config, destination: val } }
                          : n
                      )
                    );
                  }}
                />
              )}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                >
                  Delete Node
                </Button>
              </div>
            </div>
          </div>
        ) : executionLogs.length > 0 ? (
          <div className="w-64 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0 animate-in slide-in-from-right">
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 font-mono">
                Execution Trace
              </span>
              <button
                onClick={() => setExecutionLogs([])}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-0.5 text-xs"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px] text-neutral-600 dark:text-neutral-300">
              {executionLogs.map((log, i) => (
                <div key={i} className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
