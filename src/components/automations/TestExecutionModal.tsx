import React from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  SkipForward,
  Terminal,
  Info,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { WorkflowCanvasNode } from '../../types';

export interface StepExecutionResult {
  nodeId: string;
  nodeTitle: string;
  category: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startedAt?: string;
  durationMs?: number;
  outputSummary?: string;
  logs: string[];
}

interface TestExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: WorkflowCanvasNode[];
  isExecuting: boolean;
  results: StepExecutionResult[];
  onRerun: () => void;
}

export function TestExecutionModal({
  isOpen,
  onClose,
  nodes,
  isExecuting,
  results,
  onRerun,
}: TestExecutionModalProps) {
  if (!isOpen) return null;

  const successCount = results.filter((r) => r.status === 'success').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;
  const isFinished = !isExecuting && results.length > 0 && results.every((r) => r.status !== 'pending' && r.status !== 'running');

  const getStatusBadge = (status: StepExecutionResult['status']) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            RUNNING
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            SUCCESS
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            FAILED
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20">
            <SkipForward className="w-3 h-3 text-neutral-400" />
            SKIPPED
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            <Clock className="w-3 h-3 text-neutral-400" />
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Automation Test Execution
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Simulated step-by-step trace through trigger, intelligence, logic, and actions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              <strong>Demo Mode Notice:</strong> No external actions (emails, outbound webhooks, or 3rd-party mutations) were executed.
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 shrink-0">
            Safe Environment
          </span>
        </div>

        {/* Execution Steps & Trace Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {results.map((res, index) => (
            <div
              key={res.nodeId}
              className={`p-3 rounded-xl border transition-all ${
                res.status === 'running'
                  ? 'border-sky-500/40 bg-sky-50/20 dark:bg-sky-950/20 shadow-xs'
                  : res.status === 'success'
                  ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
                  : res.status === 'failed'
                  ? 'border-rose-300 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20'
                  : 'border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/40 dark:bg-neutral-950/40 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-600 dark:text-neutral-400 shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {res.nodeTitle}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {res.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {res.durationMs && (
                    <span className="text-[10px] font-mono text-neutral-400">
                      ⚡ {res.durationMs}ms
                    </span>
                  )}
                  {getStatusBadge(res.status)}
                </div>
              </div>

              {/* Output summary */}
              {res.outputSummary && (
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-2 pl-8 font-sans">
                  {res.outputSummary}
                </p>
              )}

              {/* Execution log terminal */}
              {res.logs.length > 0 && (
                <div className="mt-2 ml-8 p-2 rounded-lg bg-neutral-950 text-neutral-300 font-mono text-[10px] space-y-0.5 leading-relaxed">
                  {res.logs.map((log, lIdx) => (
                    <div key={lIdx} className="flex gap-2 text-neutral-400">
                      <span className="text-neutral-600 select-none">&gt;</span>
                      <span className="text-neutral-300">{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Summary & Actions */}
        <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono">
            {isFinished ? (
              <span className="text-emerald-500 font-bold">
                ✓ All {results.length} steps simulated ({successCount} succeeded, {failedCount} failed)
              </span>
            ) : isExecuting ? (
              <span className="text-sky-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                Executing trace sequence...
              </span>
            ) : (
              <span className="text-neutral-400">Ready to initiate simulation</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRerun}
              disabled={isExecuting}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Re-run Test
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
