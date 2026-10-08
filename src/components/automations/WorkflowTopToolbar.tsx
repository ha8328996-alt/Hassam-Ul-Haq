import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Play,
  Undo2,
  Redo2,
  Power,
  Pause,
  MoreVertical,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AutomationStatus } from '../../types';

interface WorkflowTopToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  status: AutomationStatus;
  saveState: 'saved' | 'saving' | 'unsaved';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onTest: () => void;
  onToggleActive: () => void;
  onBack: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
}

export function WorkflowTopToolbar({
  name,
  onNameChange,
  status,
  saveState,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onTest,
  onToggleActive,
  onBack,
  onDuplicate,
  onDelete,
  isSaving = false,
}: WorkflowTopToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Paused
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft
          </span>
        );
    }
  };

  const getSaveIndicator = () => {
    switch (saveState) {
      case 'saving':
        return (
          <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            Saving...
          </span>
        );
      case 'unsaved':
        return (
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Unsaved changes
          </span>
        );
      case 'saved':
      default:
        return (
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-500" />
            Saved
          </span>
        );
    }
  };

  return (
    <div className="h-14 px-3 sm:px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between gap-3 shrink-0">
      {/* Left: Back & Editable Automation Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          title="Back to automations list"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Name your automation..."
              className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-500 focus:outline-none transition-colors truncate max-w-[220px] sm:max-w-xs md:max-w-md"
            />
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
            {getSaveIndicator()}
          </div>
        </div>
      </div>

      {/* Center/Right: Undo/Redo & Primary Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Undo / Redo */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              canUndo
                ? 'text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
                : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              canRedo
                ? 'text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800'
                : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Test Run Demo Simulator */}
        <Button
          size="sm"
          variant="outline"
          onClick={onTest}
          leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
          className="text-xs"
        >
          Test
        </Button>

        {/* Activate / Pause Toggle */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleActive}
          leftIcon={
            status === 'active' ? (
              <Pause className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Power className="w-3.5 h-3.5 text-emerald-500" />
            )
          }
          className="text-xs hidden sm:inline-flex"
        >
          {status === 'active' ? 'Pause' : 'Activate'}
        </Button>

        {/* Save Workflow Button */}
        <Button
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Save
        </Button>

        {/* More Actions Menu */}
        {(onDuplicate || onDelete) && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-1 text-xs animate-in fade-in zoom-in-95"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {onDuplicate && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Duplicate</span>
                  </button>
                )}
                {onDelete && (
                  <>
                    <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
