import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lead, LeadStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Sparkles } from 'lucide-react';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContacted'>) => Promise<any> | void;
  defaultStatus?: LeadStatus;
}

export function AddLeadModal({
  isOpen,
  onClose,
  onAddLead,
  defaultStatus = 'new',
}: AddLeadModalProps) {
  const { success, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<LeadStatus>(defaultStatus);
  const [source, setSource] = useState('Website');
  const [estimatedValue, setEstimatedValue] = useState('36000');
  const [score, setScore] = useState('85');
  const [assignedTo, setAssignedTo] = useState('Sarah Chen');
  const [country, setCountry] = useState('United States');
  const [notes, setNotes] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Contact name is required.';
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!company.trim()) errors.company = 'Company name is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toastError('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedValue = parseInt(estimatedValue, 10) || 0;
      const parsedScore = Math.max(0, Math.min(100, parseInt(score, 10) || 75));

      const newLeadData: Omit<Lead, 'id' | 'createdAt' | 'lastContacted'> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim(),
        title: title.trim() || 'Decision Maker',
        status,
        source,
        estimatedValue: parsedValue,
        score: parsedScore,
        assignedTo: assignedTo.trim() || undefined,
        country: country.trim() || undefined,
        notes: notes.trim() || undefined,
        aiNotes: notes.trim()
          ? `${notes.trim()} — Verified by FlowPilot Inbound Qualifier.`
          : `High fit candidate for ${company.trim()}. ICP score scored at ${parsedScore}/100.`,
      };

      await onAddLead(newLeadData);
      success('Lead Created', `Added ${name.trim()} at ${company.trim()} to CRM.`);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setTitle('');
      setStatus('new');
      setSource('Website');
      setEstimatedValue('36000');
      setScore('85');
      setNotes('');
      setFormErrors({});
      onClose();
    } catch (err: any) {
      toastError('Creation Failed', err?.message || 'Could not add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      description="Create a new prospect entry in your FlowPilot CRM with intent scoring and enrichment."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Row 1: Name and Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Prospect Full Name *"
            required
            placeholder="e.g. David Vance"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
            }}
            error={formErrors.name}
          />
          <Input
            label="Company Name *"
            required
            placeholder="e.g. Acme Robotics"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (formErrors.company) setFormErrors((p) => ({ ...p, company: '' }));
            }}
            error={formErrors.company}
          />
        </div>

        {/* Row 2: Email and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Work Email *"
            type="email"
            required
            placeholder="e.g. d.vance@acmerobotics.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
            }}
            error={formErrors.email}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. +1 (415) 555-0192"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Row 3: Job Title and Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Job Title / Role"
            placeholder="e.g. VP Operations"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Country / Region"
            placeholder="e.g. United States, Germany, Japan"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Row 4: Status and Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Pipeline Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Lead Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
            >
              <option value="Website">Website</option>
              <option value="Web Form">Web Form</option>
              <option value="AI Agent">AI Agent</option>
              <option value="Automation">Automation</option>
              <option value="Manual">Manual</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 5: Estimated Value and Intent Score */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Estimated Value ($ ARR)"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g. 48000"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            helperText="Expected annual deal value for forecasting"
          />

          <Input
            label="ICP Intent Score (0 - 100)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 85"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            helperText="85+ High Fit | 70+ Good Fit | 50+ Moderate"
          />
        </div>

        {/* Row 6: Assigned Owner */}
        <Input
          label="Assigned Account Executive / Owner"
          placeholder="e.g. Sarah Chen or Alex Mercer"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            Notes & AI Context
          </label>
          <textarea
            rows={3}
            placeholder="Key discovery notes, technical requirements, seat sizing, or pain points..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-3 focus:outline-none focus:ring-1 focus:ring-neutral-400 placeholder:text-neutral-400"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Add & Enrich Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}
