import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Integration } from '../../types';
import { IntegrationBrandLogo } from './IntegrationBrandLogo';
import { AlertTriangle, Trash2, Unlink } from 'lucide-react';

interface DisconnectConfirmModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DisconnectConfirmModal({
  integration,
  isOpen,
  onClose,
  onConfirm,
}: DisconnectConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!integration) return null;

  const handleDisconnect = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(integration.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disconnect ${integration.name}`}
      description="Review potential workflow dependencies before revoking integration access."
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20">
          <IntegrationBrandLogo providerKey={integration.key} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              {integration.name}
            </h4>
            <span className="text-[11px] font-mono text-neutral-500">
              Active status: Connected
            </span>
          </div>
          <span className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
            <Unlink className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            Are you sure you want to disconnect <strong>{integration.name}</strong>?
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>Any automations triggered by this connector will be paused.</li>
            <li>Outbound webhooks or message dispatches will no longer send.</li>
            <li>Stored authentication tokens will be securely purged from your workspace.</li>
          </ul>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Keep Connected
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDisconnect}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? 'Disconnecting...' : 'Yes, Disconnect'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
