import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../../context/ToastContext';
import { Plus, CheckSquare, Square, Globe } from 'lucide-react';

interface AddCustomWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, url: string, method?: string, events?: string[]) => Promise<any>;
}

const EVENTS = [
  { id: 'lead.created', label: 'Lead Created' },
  { id: 'lead.status_updated', label: 'Lead Stage Changed' },
  { id: 'agent.action_completed', label: 'Agent Reasoning Finished' },
  { id: 'automation.executed', label: 'Workflow Executed' },
  { id: 'conversation.new_message', label: 'Inbound Conversation Message' },
];

export function AddCustomWebhookModal({
  isOpen,
  onClose,
  onAdd,
}: AddCustomWebhookModalProps) {
  const { success, error: toastError } = useToast();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'POST' | 'GET' | 'PUT' | 'PATCH'>('POST');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['lead.created', 'agent.action_completed']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEvent = (id: string) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      toastError('Validation Error', 'Please specify both a connector name and an endpoint URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(name.trim(), url.trim(), method, selectedEvents);
      success('Webhook Created', `New custom webhook connector "${name}" registered.`);
      setName('');
      setUrl('');
      onClose();
    } catch (err: any) {
      toastError('Error', err?.message || 'Failed to create webhook connector.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Webhook"
      description="Register an additional HTTP webhook destination to stream events to your infrastructure."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Connector Display Name"
          placeholder="e.g. AWS Lambda Lead Sync or Zapier Ingest"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Destination URL & Method <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-24 text-xs font-mono font-semibold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-2 text-neutral-900 dark:text-white"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
            <div className="flex-1">
              <Input
                placeholder="https://api.yourcompany.com/webhook"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            Subscribed Events
          </label>
          <div className="space-y-1.5 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
            {EVENTS.map((ev) => {
              const isChecked = selectedEvents.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  onClick={() => toggleEvent(ev.id)}
                  className="flex items-center gap-2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer text-xs"
                >
                  <button type="button" className="text-neutral-500">
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {ev.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono ml-auto">
                    {ev.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button size="sm" type="submit" disabled={isSubmitting} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            {isSubmitting ? 'Creating...' : 'Register Webhook'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
