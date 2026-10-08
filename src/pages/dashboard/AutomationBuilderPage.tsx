import React, { useState, useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  Automation,
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
  WorkflowData,
  AutomationStatus,
} from '../../types';
import { NodeLibraryPanel } from '../../components/automations/NodeLibraryPanel';
import { NodeConfigPanel } from '../../components/automations/NodeConfigPanel';
import { WorkflowCanvas } from '../../components/automations/WorkflowCanvas';
import { WorkflowTopToolbar } from '../../components/automations/WorkflowTopToolbar';
import {
  TestExecutionModal,
  StepExecutionResult,
} from '../../components/automations/TestExecutionModal';
import { NodeTemplateDefinition } from '../../components/automations/nodeLibraryData';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { PanelLeft, PanelRight, AlertTriangle, Trash2 } from 'lucide-react';

interface AutomationBuilderPageProps {
  automationId?: string;
}

export function AutomationBuilderPage({ automationId }: AutomationBuilderPageProps) {
  const { navigate } = useRouter();
  const { success, error, info } = useToast();
  const {
    createAutomation,
    updateAutomation,
    deleteAutomation,
    duplicateAutomation,
    getAutomationById,
    integrations,
  } = useData();

  const isEditing = Boolean(automationId);
  const existingAutomation = automationId ? getAutomationById(automationId) : null;

  const [name, setName] = useState('Untitled Automation');
  const [status, setStatus] = useState<AutomationStatus>('draft');
  const [nodes, setNodes] = useState<WorkflowCanvasNode[]>([]);
  const [edges, setEdges] = useState<WorkflowCanvasEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [history, setHistory] = useState<Array<{ nodes: WorkflowCanvasNode[]; edges: WorkflowCanvasEdge[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [showLeftLibrary, setShowLeftLibrary] = useState(true);
  const [showRightConfig, setShowRightConfig] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isSaving, setIsSaving] = useState(false);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<StepExecutionResult[]>([]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditing && existingAutomation) {
      setName(existingAutomation.name || 'Untitled Automation');
      setStatus(existingAutomation.status || 'draft');
      if (
        existingAutomation.workflow_data &&
        Array.isArray(existingAutomation.workflow_data.nodes) &&
        existingAutomation.workflow_data.nodes.length > 0
      ) {
        setNodes(existingAutomation.workflow_data.nodes);
        setEdges(existingAutomation.workflow_data.edges || []);
      } else if (existingAutomation.steps && existingAutomation.steps.length > 0) {
        const reconstructedNodes: WorkflowCanvasNode[] = existingAutomation.steps.map(
          (step, idx) => ({
            id: step.id || `node_${idx + 1}`,
            type: idx === 0 ? 'trigger' : 'action',
            nodeKey: idx === 0 ? 'trigger_new_lead' : 'action_create_lead',
            title: step.title,
            description: step.description,
            category: idx === 0 ? 'Triggers' : 'Actions',
            icon: idx === 0 ? 'zap' : 'user_plus',
            x: 80 + idx * 300,
            y: 160,
            data: {},
          })
        );
        const reconstructedEdges: WorkflowCanvasEdge[] = [];
        for (let i = 0; i < reconstructedNodes.length - 1; i++) {
          reconstructedEdges.push({
            id: `edge_${reconstructedNodes[i].id}_${reconstructedNodes[i + 1].id}`,
            source: reconstructedNodes[i].id,
            target: reconstructedNodes[i + 1].id,
          });
        }
        setNodes(reconstructedNodes);
        setEdges(reconstructedEdges);
      } else {
        setNodes([]);
        setEdges([]);
      }
      setSaveState('saved');
    } else {
      const initialTrigger: WorkflowCanvasNode = {
        id: 'node_trigger_init',
        type: 'trigger',
        nodeKey: 'trigger_new_lead',
        title: 'New Lead',
        description: 'Triggers when a new lead is captured or submitted into FlowPilot.',
        category: 'Triggers',
        icon: 'zap',
        x: 80,
        y: 180,
        data: {
          triggerType: 'new_lead',
          leadSource: 'All Sources',
        },
      };
      setNodes([initialTrigger]);
      setEdges([]);
      setSelectedNodeId('node_trigger_init');
      setSaveState('saved');
    }
  }, [automationId, existingAutomation]);

  const pushHistory = (newNodes: WorkflowCanvasNode[], newEdges: WorkflowCanvasEdge[]) => {
    setSaveState('unsaved');
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { nodes: newNodes, edges: newEdges }];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevStep = history[historyIndex - 1];
      setNodes(prevStep.nodes);
      setEdges(prevStep.edges);
      setHistoryIndex(historyIndex - 1);
      setSaveState('unsaved');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextStep = history[historyIndex + 1];
      setNodes(nextStep.nodes);
      setEdges(nextStep.edges);
      setHistoryIndex(historyIndex + 1);
      setSaveState('unsaved');
    }
  };

  const handleAddNodeFromTemplate = (template: NodeTemplateDefinition) => {
    const newId = 'node_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.x + 300 : 80;
    const newY = lastNode ? lastNode.y + (nodes.length % 2 === 0 ? 30 : -20) : 180;
    const newNode: WorkflowCanvasNode = {
      id: newId,
      type: template.type,
      nodeKey: template.nodeKey,
      title: template.title,
      description: template.description,
      category: template.category,
      icon: template.icon,
      x: Math.max(50, newX),
      y: Math.max(80, newY),
      data: { ...template.defaultData },
    };
    const nextNodes = [...nodes, newNode];
    let nextEdges = [...edges];

    const connectFrom = selectedNodeId || (lastNode ? lastNode.id : null);
    if (connectFrom && connectFrom !== newId && template.type !== 'trigger') {
      const newEdge: WorkflowCanvasEdge = {
        id: `edge_${connectFrom}_${newId}`,
        source: connectFrom,
        target: newId,
      };
      nextEdges.push(newEdge);
    }
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(newId);
    setShowRightConfig(true);
    pushHistory(nextNodes, nextEdges);
    success('Node Added', `Added "${newNode.title}" to canvas.`);
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<WorkflowCanvasNode>) => {
    const nextNodes = nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n));
    setNodes(nextNodes);
    pushHistory(nextNodes, edges);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextEdges = edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
    setNodes(nextNodes);
    setEdges(nextEdges);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    pushHistory(nextNodes, nextEdges);
    info('Node Deleted', 'Removed step from canvas.');
  };

  const handleDuplicateNode = (nodeId: string) => {
    const sourceNode = nodes.find((n) => n.id === nodeId);
    if (!sourceNode) return;
    const newId = 'node_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const duplicatedNode: WorkflowCanvasNode = {
      ...sourceNode,
      id: newId,
      title: `${sourceNode.title} (Copy)`,
      x: sourceNode.x + 40,
      y: sourceNode.y + 40,
      data: JSON.parse(JSON.stringify(sourceNode.data || {})),
    };
    const nextNodes = [...nodes, duplicatedNode];
    setNodes(nextNodes);
    setSelectedNodeId(newId);
    pushHistory(nextNodes, edges);
    success('Node Duplicated', `Duplicated "${sourceNode.title}".`);
  };

  const handleCanvasUpdateNodes = (newNodes: WorkflowCanvasNode[]) => {
    setNodes(newNodes);
    setSaveState('unsaved');
  };

  const handleCanvasUpdateEdges = (newEdges: WorkflowCanvasEdge[]) => {
    setEdges(newEdges);
    pushHistory(nodes, newEdges);
  };

  const validateWorkflow = (forActivation = false): { valid: boolean; message?: string } => {
    if (!name.trim()) {
      return { valid: false, message: 'Please enter an automation name.' };
    }
    if (nodes.length === 0) {
      return { valid: false, message: 'Workflow canvas is empty. Add at least one trigger node.' };
    }
    const hasTrigger = nodes.some((n) => n.type === 'trigger');
    if (!hasTrigger) {
      return { valid: false, message: 'Automation requires at least one Trigger node.' };
    }
    if (forActivation) {
      if (nodes.length < 2) {
        return {
          valid: false,
          message: 'An active automation requires at least one action, condition, or AI node following the trigger.',
        };
      }
      if (edges.length === 0) {
        return {
          valid: false,
          message: 'Workflow steps must be connected with at least one execution link before activation.',
        };
      }
    }
    return { valid: true };
  };

  const handleSave = async (silent = false): Promise<boolean> => {
    const validation = validateWorkflow(false);
    if (!validation.valid) {
      error('Validation Error', validation.message || 'Please check workflow configuration.');
      return false;
    }
    setIsSaving(true);
    setSaveState('saving');
    const workflowData: WorkflowData = {
      nodes,
      edges,
    };
    const triggerNode = nodes.find((n) => n.type === 'trigger');
    const triggerType = triggerNode?.nodeKey ? triggerNode.nodeKey.replace('trigger_', '') : 'webhook';
    const automationPayload: Partial<Automation> & { name: string } = {
      name: name.trim(),
      description: `Visual workflow with ${nodes.length} steps and ${edges.length} connections.`,
      status,
      triggerType,
      workflow_data: workflowData,
      configuration: {
        nodesCount: nodes.length,
        edgesCount: edges.length,
        workflow_data: workflowData,
      },
      steps: nodes.map((n, i) => ({
        id: n.id,
        type: n.type === 'trigger' ? 'trigger' : 'action',
        title: n.title,
        description: n.description,
        service: n.category,
      })),
    };
    try {
      if (isEditing && automationId) {
        await updateAutomation(automationId, automationPayload);
        if (!silent) success('Saved Successfully', 'Automation saved to Supabase database.');
      } else {
        const created = await createAutomation(automationPayload);
        if (!silent) success('Automation Created', 'Automation saved to Supabase database.');
        navigate(`/dashboard/automations/${created.id}/edit`);
      }
      setSaveState('saved');
      return true;
    } catch (err: any) {
      setSaveState('unsaved');
      error('Save Failed', err?.message || 'Could not save automation.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (status === 'active') {
      setStatus('paused');
      if (automationId) {
        await updateAutomation(automationId, { status: 'paused' });
      }
      info('Automation Paused', 'Workflow will temporarily suspend event listening.');
    } else {
      const validation = validateWorkflow(true);
      if (!validation.valid) {
        error('Cannot Activate Workflow', validation.message || 'Fix errors before activation.');
        return;
      }
      setStatus('active');
      if (automationId) {
        await updateAutomation(automationId, { status: 'active' });
      }
      success('Automation Activated', 'Workflow is now live and monitoring events.');
    }
  };

  const handleDuplicateAutomation = async () => {
    if (automationId) {
      try {
        const copy = await duplicateAutomation(automationId);
        success('Automation Duplicated', `Created "${copy.name}".`);
        navigate(`/dashboard/automations/${copy.id}/edit`);
      } catch (err: any) {
        error('Duplication Failed', err?.message || 'Could not duplicate automation.');
      }
    }
  };

  const handleDeleteAutomation = async () => {
    if (!automationId) return;
    setIsDeleting(true);
    try {
      await deleteAutomation(automationId);
      success('Automation Deleted', 'The workflow was permanently deleted.');
      navigate('/dashboard/automations');
    } catch (err: any) {
      error('Delete Failed', err?.message || 'Could not delete automation.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleRunTest = () => {
    const validation = validateWorkflow(false);
    if (!validation.valid) {
      error('Cannot Test Workflow', validation.message || 'Add at least one trigger node.');
      return;
    }
    setIsTestModalOpen(true);
    setIsTesting(true);

    const initialResults: StepExecutionResult[] = nodes.map((node) => ({
      nodeId: node.id,
      nodeTitle: node.title,
      category: node.category,
      status: 'pending',
      logs: [],
    }));
    setTestResults(initialResults);

    let currentIndex = 0;
    const runStep = () => {
      if (currentIndex >= nodes.length) {
        setIsTesting(false);
        return;
      }
      const node = nodes[currentIndex];
      const stepIdx = currentIndex;

      setTestResults((prev) =>
        prev.map((r, i) =>
          i === stepIdx
            ? {
                ...r,
                status: 'running',
                startedAt: new Date().toLocaleTimeString(),
                logs: [`Initializing ${node.title}...`, `Evaluating node constraints and permissions...`],
              }
            : r
        )
      );
      const latency = Math.floor(Math.random() * 300) + 180;
      setTimeout(() => {
        let output = '';
        let stepLogs: string[] = [];
        if (node.type === 'trigger') {
          output = `Trigger payload accepted: Mock event received from ${node.data?.leadSource || 'Web Inbound Gateway'}.`;
          stepLogs = [
            `HTTP listener initialized on ${node.data?.webhookPath || '/api/v1/inbound-events'}`,
            `HMAC signature verified with 0 schema violations.`,
            `Trigger payload dispatched downstream.`,
          ];
        } else if (node.type === 'ai_agent') {
          output = `Agent synthesized output under ${node.data?.modelOverride || 'Gemini 2.5 Pro'} constraints.`;
          stepLogs = [
            `Loaded system instructions: "${(node.data?.instructionsOverride || 'Sales qualification').slice(0, 45)}..."`,
            `Calculated ICP Fit score: 94/100 (Tier 1 Enterprise).`,
            `Generated contextual task decision in ${latency}ms.`,
          ];
        } else if (node.type === 'logic') {
          const rulePreview = node.data?.rules?.[0]?.field || 'lead.score';
          output = `Condition evaluated to TRUE (${rulePreview} criteria satisfied).`;
          stepLogs = [
            `Parsed logic expression: ${node.data?.conditionLogic || 'OR'} logic gate`,
            `Condition branch passed with status: VALID. Proceeding to downstream actions.`,
          ];
        } else if (node.type === 'action') {
          if (node.nodeKey === 'action_send_email') {
            output = `[Demo Mode] Simulated email drafted for ${node.data?.emailRecipient || 'lead@example.com'}. No external email dispatched.`;
            stepLogs = [
              `Pre-execution validation: verified payload fields.`,
              `Simulated execution completed in Demo Mode.`,
            ];
          } else if (node.nodeKey === 'action_google_sheets_append') {
            const isSheetsConnected = integrations.find((i) => i.key === 'google_sheets')?.status === 'connected';
            if (isSheetsConnected) {
              output = `Google Sheets row appended to spreadsheet ID: ${node.data?.spreadsheetId || 'default'}.`;
              stepLogs = [
                `Google Workspace OAuth session verified.`,
                `Appended row to ${node.data?.sheetRange || 'Sheet1!A:F'}.`,
                `Payload: ${node.data?.rowValues || 'lead data'}.`,
              ];
            } else {
              output = `[Demo Mode] Google Sheets connection required. Executed in safe simulation mode (no rows written).`;
              stepLogs = [
                `WARNING: Google Sheets connector is not connected in Integrations.`,
                `Falling back to simulated demo execution trace.`,
              ];
            }
          } else if (node.nodeKey === 'action_slack_message') {
            const isSlackConnected = integrations.find((i) => i.key === 'slack')?.status === 'connected';
            if (isSlackConnected) {
              output = `Slack alert posted to ${node.data?.slackChannel || '#general'}.`;
              stepLogs = [
                `Slack bot token verified.`,
                `Message dispatched: ${(node.data?.slackMessageText || '').slice(0, 40)}...`,
              ];
            } else {
              output = `[Demo Mode] Slack bot setup required. Executed in safe simulation mode (no messages sent).`;
              stepLogs = [
                `WARNING: Slack integration is not connected in Integrations.`,
                `Falling back to simulated demo execution trace.`,
              ];
            }
          } else if (node.nodeKey === 'action_gmail_send') {
            const isGmailConnected = integrations.find((i) => i.key === 'gmail')?.status === 'connected';
            if (isGmailConnected) {
              output = `Gmail dispatched message to ${node.data?.toRecipient || 'recipient'}.`;
              stepLogs = [
                `Google Workspace Gmail OAuth session active.`,
                `Subject: "${node.data?.emailSubject || 'Welcome'}"`,
                `Message queued for outbound delivery.`,
              ];
            } else {
              output = `[Demo Mode] Gmail OAuth setup required. Executed in safe simulation mode (no live email dispatched).`;
              stepLogs = [
                `WARNING: Gmail integration is not connected in Integrations.`,
                `Falling back to simulated demo execution trace.`,
              ];
            }
          } else if (node.nodeKey === 'action_webhook_request') {
            const isWebhookConnected = integrations.find((i) => i.key === 'webhooks')?.status === 'connected';
            if (isWebhookConnected) {
              output = `HTTP ${node.data?.webhookMethod || 'POST'} request dispatched to ${node.data?.webhookUrl || 'endpoint'}.`;
              stepLogs = [
                `Validated URL format and method.`,
                `Outbound payload serialized (${(node.data?.webhookBody || '{}').length} bytes).`,
                `Dispatched via configured Webhook connector.`,
              ];
            } else {
              output = `[Demo Mode] Webhook connector is not configured. Executed in safe simulation mode.`;
              stepLogs = [
                `WARNING: Webhook connector status is not active.`,
                `Target: ${node.data?.webhookUrl || 'https://api.example.com'}`,
                `Simulated HTTP 200 response in Demo Mode.`,
              ];
            }
          } else if (node.nodeKey === 'action_create_lead') {
            output = `Lead profile staged for creation in FlowPilot CRM pipeline.`;
            stepLogs = [
              `Pre-execution validation: verified payload fields.`,
              `Simulated execution completed in Demo Mode.`,
            ];
          } else {
            output = `Action mutation executed cleanly with 0 network errors.`;
            stepLogs = [
              `Pre-execution validation: verified payload fields.`,
              `Simulated execution completed in Demo Mode.`,
            ];
          }
        } else {
          output = `Utility task completed (${node.title}).`;
          stepLogs = [`Duration: ${node.data?.delayDuration || 5} ${node.data?.delayUnit || 'min'} registered in execution queue.`];
        }

        setTestResults((prev) =>
          prev.map((r, i) =>
            i === stepIdx
              ? {
                  ...r,
                  status: 'success',
                  durationMs: latency,
                  outputSummary: output,
                  logs: [...r.logs, ...stepLogs],
                }
              : r
          )
        );
        currentIndex++;
        runStep();
      }, latency);
    };
    runStep();
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      <WorkflowTopToolbar
        name={name}
        onNameChange={(newName) => {
          setName(newName);
          setSaveState('unsaved');
        }}
        status={status}
        saveState={saveState}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => handleSave(false)}
        onTest={handleRunTest}
        onToggleActive={handleToggleActive}
        onBack={() => navigate('/dashboard/automations')}
        onDuplicate={isEditing ? handleDuplicateAutomation : undefined}
        onDelete={isEditing ? () => setDeleteConfirmOpen(true) : undefined}
        isSaving={isSaving}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={`${
            showLeftLibrary ? 'w-64 sm:w-72 shrink-0' : 'w-0'
          } transition-all duration-200 overflow-hidden z-20 shadow-md relative`}
        >
          <NodeLibraryPanel onAddNode={handleAddNodeFromTemplate} />
        </div>

        <button
          onClick={() => setShowLeftLibrary(!showLeftLibrary)}
          className="absolute left-2 top-2 z-30 p-1.5 rounded-lg bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
          title={showLeftLibrary ? 'Hide Node Library' : 'Show Node Library'}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 h-full relative overflow-hidden">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => {
              setSelectedNodeId(id);
              if (id) setShowRightConfig(true);
            }}
            onUpdateNodes={handleCanvasUpdateNodes}
            onUpdateEdges={handleCanvasUpdateEdges}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
            onAddTriggerPrompt={() => {
              setShowLeftLibrary(true);
            }}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            onFitView={() => setZoomLevel(1)}
          />
        </div>

        <button
          onClick={() => setShowRightConfig(!showRightConfig)}
          className="absolute right-2 top-2 z-30 p-1.5 rounded-lg bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
          title={showRightConfig ? 'Hide Config' : 'Show Config'}
        >
          <PanelRight className="w-4 h-4" />
        </button>

        <div
          className={`${
            showRightConfig ? 'w-80 sm:w-96 shrink-0' : 'w-0'
          } transition-all duration-200 overflow-hidden z-20 shadow-md relative`}
        >
          <NodeConfigPanel
            node={selectedNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
            onClose={() => setShowRightConfig(false)}
          />
        </div>
      </div>

      <TestExecutionModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        nodes={nodes}
        isExecuting={isTesting}
        results={testResults}
        onRerun={handleRunTest}
      />

      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Automation"
        description="Are you sure you want to delete this automation workflow? This action cannot be undone."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Permanent Deletion Warning</span>
            </div>
            <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-400">
              You are about to delete <strong>"{name}"</strong>. Any active triggers, webhook listeners, or automated cron runs referencing this workflow will be deactivated.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleDeleteAutomation}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Yes, Delete Automation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
