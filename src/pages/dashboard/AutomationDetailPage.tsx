import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Automation, AutomationStatus, WorkflowCanvasNode } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import {
  TestExecutionModal,
  StepExecutionResult,
} from '../../components/automations/TestExecutionModal';
import { getNodeIconComponent } from '../../components/automations/nodeLibraryData';
import {
  Zap,
  ArrowLeft,
  Edit,
  Copy,
  Power,
  Pause,
  Trash2,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Activity,
  ArrowRight,
  RotateCcw,
  Terminal,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface AutomationDetailPageProps {
  automationId: string;
}

export function AutomationDetailPage({ automationId }: AutomationDetailPageProps) {
  const { navigate } = useRouter();
  const { success, error, info } = useToast();
  const {
    getAutomationById,
    deleteAutomation,
    duplicateAutomation,
    setAutomationStatus,
    runAutomation,
  } = useData();

  const automation = getAutomationById(automationId);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<StepExecutionResult[]>([]);
  const [selectedRunLog, setSelectedRunLog] = useState<{ id: string; logs: string[]; title: string } | null>(null);

  if (!automation) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 max-w-lg mx-auto space-y-4 my-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            Automation Not Found
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            The automation workflow you are looking for does not exist or may have been deleted.
          </p>
        </div>
        <div className="pt-2">
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/automations')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Automations
          </Button>
        </div>
      </div>
    );
  }

  const nodes: WorkflowCanvasNode[] =
    automation.workflow_data?.nodes ||
    (automation.steps || []).map((st, i) => ({
      id: st.id || `node_${i + 1}`,
      type: i === 0 ? 'trigger' : 'action',
      nodeKey: i === 0 ? 'trigger_new_lead' : 'action_create_lead',
      title: st.title,
      description: st.description,
      category: (i === 0 ? 'Triggers' : 'Actions') as any,
      icon: i === 0 ? 'zap' : 'user_plus',
      x: 80 + i * 280,
      y: 120,
      data: {},
    }));

  const edges = automation.workflow_data?.edges || [];

  const totalRuns = automation.runCount || 1240;
  const successRate = automation.successRate || 99.2;
  const successfulRuns =
    automation.successfulRuns !== undefined
      ? automation.successfulRuns
      : Math.round(totalRuns * (successRate / 100));
  const failedRuns =
    automation.failedRuns !== undefined ? automation.failedRuns : Math.max(0, totalRuns - successfulRuns);

  const handleToggleStatus = async () => {
    const nextStatus: AutomationStatus = automation.status === 'active' ? 'paused' : 'active';
    try {
      await setAutomationStatus(automation.id, nextStatus);
      info(
        `Automation ${nextStatus === 'active' ? 'Activated' : 'Paused'}`,
        `"${automation.name}" is now ${nextStatus}.`
      );
    } catch (err: any) {
      error('Status Update Failed', err?.message || 'Could not update status.');
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await duplicateAutomation(automation.id);
      success('Automation Duplicated', `Created copy "${copy.name}".`);
      navigate(`/dashboard/automations/${copy.id}`);
    } catch (err: any) {
      error('Duplication Failed', err?.message || 'Could not duplicate automation.');
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAutomation(automation.id);
      success('Automation Deleted', `"${automation.name}" has been permanently removed.`);
      navigate('/dashboard/automations');
    } catch (err: any) {
      error('Deletion Failed', err?.message || 'Could not delete automation.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleRunTest = () => {
    setTestModalOpen(true);
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
        runAutomation(automation.id);
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
                logs: [`Initializing ${node.title}...`, `Checking node credentials and input parameters...`],
              }
            : r
        )
      );

      const latency = Math.floor(Math.random() * 260) + 140;
      setTimeout(() => {
        let output = '';
        let stepLogs: string[] = [];

        if (node.type === 'trigger') {
          output = `Trigger fired from ${node.data?.leadSource || 'Inbound Webhook Gateway'}. Payload valid.`;
          stepLogs = [
            `Event ingested via ${node.data?.webhookPath || '/api/v1/inbound-events'}`,
            `Schema validation passed (0 errors)`,
            `Dispatched downstream payload to next step.`,
          ];
        } else if (node.type === 'ai_agent') {
          output = `AI synthesized response under ${node.data?.modelOverride || 'Gemini 2.5 Pro'}.`;
          stepLogs = [
            `Evaluated agent prompt with temperature ${node.data?.temperatureOverride || 0.2}`,
            `ICP classification score: 96/100 (Tier 1 Priority)`,
            `Output generated in ${latency}ms`,
          ];
        } else if (node.type === 'logic') {
          output = `Condition rule evaluated to TRUE. Branch passed.`;
          stepLogs = [
            `Evaluated condition: ${node.data?.rules?.[0]?.field || 'lead.score'} ${node.data?.rules?.[0]?.operator || '>='} ${node.data?.rules?.[0]?.value || '70'}`,
            `Boolean outcome: TRUE`,
          ];
        } else if (node.type === 'action') {
          output = `[Demo Mode] Simulated action executed cleanly. No external mutations dispatched.`;
          stepLogs = [
            `Prepared payload for ${node.title}`,
            `Simulated execution completed in Demo Mode`,
          ];
        } else {
          output = `Utility task completed.`;
          stepLogs = [`Duration: ${node.data?.delayDuration || 5} ${node.data?.delayUnit || 'minutes'}`];
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

  const getStatusBadge = (status: AutomationStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'paused':
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Paused
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft
          </span>
        );
    }
  };

  // Mock recent runs history for audit trail
  const recentRuns = [
    {
      id: 'run_9281a',
      triggerEvent: 'Inbound Web Form (#1042)',
      status: 'success',
      latency: 320,
      timestamp: '2 mins ago',
      logs: [
        'Trigger payload ingested: Web Form (Enterprise Demo Request)',
        'Classify Lead AI Agent scored buyer intent: 92/100',
        'Condition rule passed: lead.score > 70',
        'Simulated Create Lead & Send Email executed in demo mode',
      ],
    },
    {
      id: 'run_8172b',
      triggerEvent: 'API Webhook (/v1/inbound)',
      status: 'success',
      latency: 410,
      timestamp: '18 mins ago',
      logs: [
        'Incoming webhook verified with HMAC signature',
        'Lead qualification pipeline executed with Gemini 2.5 Flash',
        'Workflow completed in 410ms with 0 errors',
      ],
    },
    {
      id: 'run_7261c',
      triggerEvent: 'Hourly Schedule (08:00 UTC)',
      status: 'success',
      latency: 280,
      timestamp: '1 hour ago',
      logs: [
        'Scheduled cron triggered automation loop',
        'Scanned 14 pending leads; 3 qualified for sales outreach',
        'Updated deal pipeline records in database',
      ],
    },
    {
      id: 'run_6254d',
      triggerEvent: 'New Lead: Alex Morgan',
      status: 'success',
      latency: 345,
      timestamp: '3 hours ago',
      logs: [
        'New lead submitted from Landing Page',
        'AI synthesized personalized introduction response',
        'Simulated notification dispatched to admin team',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/automations')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Back to Automations"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {automation.name}
              </h1>
              {getStatusBadge(automation.status)}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {automation.description || 'Autonomous multi-step business workflow.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTest}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Test Run
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleStatus}
            leftIcon={
              automation.status === 'active' ? (
                <Pause className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Power className="w-3.5 h-3.5 text-emerald-500" />
              )
            }
          >
            {automation.status === 'active' ? 'Pause' : 'Activate'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDuplicate}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Duplicate
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/dashboard/automations/${automation.id}/edit`)}
            leftIcon={<Edit className="w-3.5 h-3.5" />}
          >
            Edit in Builder
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteModalOpen(true)}
            className="text-rose-500 hover:text-rose-600 p-2"
            title="Delete Automation"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metric Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Total Runs</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              {totalRuns.toLocaleString()}
            </span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">100% demo simulation</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Success Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-500">{successRate}%</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">
            {successfulRuns.toLocaleString()} successful
          </span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Failed Runs</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-neutral-700 dark:text-neutral-300">
              {failedRuns}
            </span>
            <AlertCircle className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">0 fatal crashes</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">Steps Count</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              {nodes.length} Steps
            </span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">{edges.length} connections</span>
        </Card>
      </div>

      {/* Workflow Chain Preview */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Workflow Sequence Preview
            </h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/dashboard/automations/${automation.id}/edit`)}
            rightIcon={<ExternalLink className="w-3 h-3" />}
            className="text-xs"
          >
            Open in Visual Builder
          </Button>
        </div>

        {/* Visual Pipeline Sequence Nodes */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            {nodes.map((node, index) => {
              const isLast = index === nodes.length - 1;
              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs w-56 shrink-0 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase font-bold">
                        {node.category}
                      </span>
                      <span className="text-neutral-400">#{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {getNodeIconComponent(node.icon, 'w-3.5 h-3.5')}
                      </div>
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                        {node.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                      {node.description}
                    </p>
                  </div>
                  {!isLast && (
                    <div className="shrink-0 flex items-center justify-center text-neutral-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Detailed Nodes Breakdown Table */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
            Configured Step Details
          </h3>
          <span className="text-xs font-mono text-neutral-400">
            {nodes.length} active node{nodes.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[10px] uppercase">
                <th className="pb-2.5 font-semibold">Step / Order</th>
                <th className="pb-2.5 font-semibold">Type</th>
                <th className="pb-2.5 font-semibold">Configuration Summary</th>
                <th className="pb-2.5 font-semibold">Output Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {nodes.map((node, i) => (
                <tr key={node.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-mono text-[10px] text-neutral-500 shrink-0">
                      {i + 1}
                    </span>
                    <span>{node.title}</span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-neutral-500">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {node.category}
                    </span>
                  </td>
                  <td className="py-3 text-neutral-600 dark:text-neutral-300">
                    {node.data?.agentName ? (
                      <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400">
                        Agent: {node.data.agentName}
                      </span>
                    ) : node.data?.rules ? (
                      <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        {node.data.rules.length} condition rule(s)
                      </span>
                    ) : node.data?.emailRecipient ? (
                      <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400">
                        To: {node.data.emailRecipient}
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">
                        {node.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-neutral-500 font-mono text-[11px]">
                    {i < nodes.length - 1 ? (
                      <span>Step #{i + 2} ({nodes[i + 1].title})</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">Workflow Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Runs Audit Trail */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Recent Execution Runs
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Simulated telemetry logs for events processed by this automation.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTest}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Trigger New Run
          </Button>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {recentRuns.map((run) => (
            <div
              key={run.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {run.id}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">•</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {run.triggerEvent}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">{run.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] text-neutral-500">
                  ⚡ {run.latency}ms
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SUCCESS
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedRunLog({
                      id: run.id,
                      logs: run.logs,
                      title: run.triggerEvent,
                    })
                  }
                  className="text-xs py-1 px-2.5"
                >
                  View Logs
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Run Log Modal */}
      <Modal
        isOpen={!!selectedRunLog}
        onClose={() => setSelectedRunLog(null)}
        title={`Execution Run ${selectedRunLog?.id}`}
        description={`Audit logs for event: ${selectedRunLog?.title}`}
        maxWidth="md"
      >
        {selectedRunLog && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-[11px] space-y-1.5 leading-relaxed overflow-x-auto">
              {selectedRunLog.logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 text-neutral-400">
                  <span className="text-neutral-600 select-none">&gt;</span>
                  <span className="text-neutral-300">{log}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setSelectedRunLog(null)}>
                Close Logs
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Test Execution Simulation Modal */}
      <TestExecutionModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        nodes={nodes}
        isExecuting={isTesting}
        results={testResults}
        onRerun={handleRunTest}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
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
              You are about to delete <strong>"{automation.name}"</strong>. Any active triggers, webhook listeners, or automated cron runs referencing this workflow will be deactivated.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={confirmDelete}
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
