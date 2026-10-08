import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lead } from '../../types';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DeleteLeadConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConfirmDelete: (id: string) => Promise<any> | void;
}

export function DeleteLeadConfirmModal({
  isOpen,
  onClose,
  lead,
  onConfirmDelete,
}: DeleteLeadConfirmModalProps) {
  const { success, error: toastError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!lead) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(lead.id);
      success('Lead Deleted', `Removed ${lead.name} (${lead.company}) from CRM.`);
      onClose();
    } catch (err: any) {
      toastError('Deletion Failed', err?.message || 'Could not delete lead.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Lead"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 dark:text-rose-200 space-y-1">
            <p className="font-semibold">Are you sure you want to delete this lead?</p>
            <p>
              This will permanently delete <span className="font-bold">{lead.name}</span> at{' '}
              <span className="font-bold">{lead.company}</span> along with all historical activity and notes.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white hover:text-white"
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
