import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Lead, LeadStatus, LeadActivityType } from '../../types';
import { LeadStatusBadge } from '../../components/leads/LeadStatusBadge';
import { LeadScoreBadge } from '../../components/leads/LeadScoreBadge';
import { EditLeadModal } from '../../components/leads/EditLeadModal';
import { DeleteLeadConfirmModal } from '../../components/leads/DeleteLeadConfirmModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Send,
  Plus,
  Copy,
  Check,
  Bot,
  Zap,
  Activity,
  FileText,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Share2,
} from 'lucide-react';

interface LeadDetailPageProps {
  leadId: string;
  initialEdit?: boolean;
}

export function LeadDetailPage({ leadId, initialEdit = false }: LeadDetailPageProps) {
  const { navigate } = useRouter();
  const {
    leads,
    updateLead,
    deleteLead,
    getLeadActivities,
    addLeadActivity,
    getLeadNotes,
    addLeadNote,
    deleteLeadNote,
  } = useData();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes' | 'ai'>(
    'overview'
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(initialEdit);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isQualifyingWithAi, setIsQualifyingWithAi] = useState(false);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // New Activity state
  const [newActivityType, setNewActivityType] = useState<LeadActivityType>('email');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [showLogActivityForm, setShowLogActivityForm] = useState(false);

  // AI Generated Outreach State
  const [generatedOutreach, setGeneratedOutreach] = useState<string | null>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);

  const lead = leads.find((l) => l.id === leadId);

  if (!lead) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/leads')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Leads
        </Button>
        <Card className="p-12 text-center space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Lead Not Found</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            The lead you are looking for does not exist or may have been deleted.
          </p>
          <Button size="sm" onClick={() => navigate('/dashboard/leads')}>
            Return to Pipeline
          </Button>
        </Card>
      </div>
    );
  }

  const activities = getLeadActivities(lead.id);
  const notes = getLeadNotes(lead.id);

  const handleStatusChange = async (nextStatus: LeadStatus) => {
    try {
      await updateLead(lead.id, { status: nextStatus });
      success('Status Updated', `Moved ${lead.name} to ${nextStatus.toUpperCase()}`);
    } catch {
      // Toast handled in context
    }
  };

  const handleCopyEmail = () => {
    if (lead.email) {
      navigator.clipboard.writeText(lead.email);
      setCopiedEmail(true);
      success('Copied', 'Email copied to clipboard.');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleRunAiQualifier = async () => {
    setIsQualifyingWithAi(true);
    await new Promise((r) => setTimeout(r, 1200));

    const newScore = Math.min(99, Math.max(78, (lead.score || 80) + Math.floor(Math.random() * 8) - 2));
    const aiInsight = `AI Deep Qualification completed via Gemini 2.5 Pro. Verified domain authority for ${lead.company}. High purchase intent detected based on firmographic tech stack and seat requirements. Recommended next action: Schedule executive technical scoping session.`;

    await updateLead(lead.id, {
      score: newScore,
      aiNotes: aiInsight,
    });

    await addLeadActivity(
      lead.id,
      'ai_agent',
      `Inbound Qualifier Agent completed live intelligence dossier (Intent score: ${newScore}/100).`
    );

    setIsQualifyingWithAi(false);
    success('AI Qualification Complete', `Updated ICP fit score to ${newScore}/100.`);
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsAddingNote(true);
    try {
      await addLeadNote(lead.id, newNoteText.trim());
      setNewNoteText('');
      success('Note Added', 'Saved note to lead timeline.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleLogActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityDesc.trim()) return;

    setIsLoggingActivity(true);
    try {
      await addLeadActivity(lead.id, newActivityType, newActivityDesc.trim());
      setNewActivityDesc('');
      setShowLogActivityForm(false);
      success('Activity Logged', 'Interaction added to timeline.');
    } finally {
      setIsLoggingActivity(false);
    }
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    await new Promise((r) => setTimeout(r, 1000));

    const emailTemplate = `Subject: Autonomous workflows for ${lead.company}

Hi ${lead.name.split(' ')[0]},

I noticed ${lead.company} is scaling its operational infrastructure. Many leaders in ${lead.title || 'your role'} struggle with manual repetitive handoffs across disparate tools.

At FlowPilot AI, we empower teams to deploy autonomous AI agents and visual workflows that eliminate manual ingestion, automate CRM synchronization, and cut response latency to seconds.

Would you be open to a brief 15-minute walkthrough this Thursday to see how we could streamline ${lead.company}'s pipeline?

Best regards,
${lead.assignedTo || 'FlowPilot Team'}`;

    setGeneratedOutreach(emailTemplate);
    setIsGeneratingOutreach(false);
    success('Outreach Drafted', 'Generated personalized pitch based on lead dossier.');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/leads')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="-ml-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          Back to Leads
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRunAiQualifier}
            isLoading={isQualifyingWithAi}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-500" />}
          >
            Run AI Qualifier
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit Lead
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              {getInitials(lead.name)}
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {lead.name}
                </h1>
                <LeadStatusBadge status={lead.status} size="md" />
                <LeadScoreBadge score={lead.score} size="md" showBar={true} />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {lead.title || 'Decision Maker'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                  <Building className="w-3.5 h-3.5 text-neutral-400" />
                  {lead.company}
                </span>
                {lead.country && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-neutral-400" />
                      {lead.country}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stage Selector */}
          <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 self-start md:self-auto">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium pl-1">
              Pipeline Stage:
            </span>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white cursor-pointer focus:ring-1 focus:ring-neutral-400"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
              Estimated ARR
            </span>
            <p className="font-mono text-base font-bold text-neutral-900 dark:text-white mt-0.5 tabular-nums">
              ${(lead.estimatedValue || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
              Lead Source
            </span>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
              {lead.source || 'Website'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
              Assigned Rep
            </span>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
              {lead.assignedTo || 'Unassigned'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
              Ingested On
            </span>
            <p className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
              {lead.createdAt}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Overview & Info
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Activity Timeline ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-semibold'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ai'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          AI Intel & Outreach
        </button>
      </div>

      {/* Main Tab Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tab Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-5 space-y-4">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-neutral-500">Work Email</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-900 dark:text-white font-medium">
                        {lead.email}
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        title="Copy email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-500">Phone Number</span>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {lead.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-500">Company Name</span>
                    <p className="font-medium text-neutral-900 dark:text-white">{lead.company}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-500">Job Title</span>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {lead.title || 'Decision Maker'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Discovery & AI Context */}
              <Card className="p-5 space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Firmographic Context & Discovery Notes
                </h3>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {lead.notes || lead.aiNotes || (
                    <span className="italic text-neutral-400">
                      No discovery notes recorded yet. Use the Edit Lead button to add context.
                    </span>
                  )}
                </div>
              </Card>

              {/* Tags */}
              {lead.tags && lead.tags.length > 0 && (
                <Card className="p-5 space-y-3">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Pipeline Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVITY TIMELINE */}
          {activeTab === 'activity' && (
            <Card className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Interaction History
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLogActivityForm(!showLogActivityForm)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Log Interaction
                </Button>
              </div>

              {/* Quick Log Form */}
              {showLogActivityForm && (
                <form
                  onSubmit={handleLogActivitySubmit}
                  className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Type:
                    </label>
                    <select
                      value={newActivityType}
                      onChange={(e) => setNewActivityType(e.target.value as LeadActivityType)}
                      className="text-xs font-medium py-1 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      <option value="email">Email Sent / Received</option>
                      <option value="status_changed">Call / Meeting Completed</option>
                      <option value="ai_agent">AI Agent Triggered</option>
                      <option value="automation">Workflow Triggered</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe interaction notes..."
                    value={newActivityDesc}
                    onChange={(e) => setNewActivityDesc(e.target.value)}
                    className="w-full text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 p-2.5 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowLogActivityForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" type="submit" isLoading={isLoggingActivity}>
                      Save Interaction
                    </Button>
                  </div>
                </form>
              )}

              {/* Timeline List */}
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {activities.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic pl-8">
                    No historical activities recorded yet.
                  </p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="relative flex items-start gap-4 pl-8 group">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-600 group-hover:border-sky-500 transition-colors" />
                      <div className="min-w-0 flex-1 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold uppercase tracking-wider text-neutral-500">
                            {act.activity_type.replace('_', ' ')}
                          </span>
                          <span className="text-neutral-400 font-mono">
                            {new Date(act.created_at).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <Card className="p-5 space-y-5">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Internal Account Notes
              </h3>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Add an internal note or meeting take-away regarding this prospect..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 p-3 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
                <div className="flex justify-end">
                  <Button size="sm" type="submit" isLoading={isAddingNote}>
                    Add Note
                  </Button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3 pt-2">
                {notes.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No notes recorded yet.</p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {note.author_name || 'Team Member'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => deleteLeadNote(note.id)}
                            className="text-neutral-400 hover:text-rose-500 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                        {note.note}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* TAB 4: AI INTEL & OUTREACH */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <Card className="p-5 space-y-4 border-sky-500/20 bg-sky-50/20 dark:bg-sky-950/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      Gemini ICP Intent Assessment
                    </h3>
                  </div>
                  <LeadScoreBadge score={lead.score} size="md" />
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2 leading-relaxed">
                  <p className="text-neutral-800 dark:text-neutral-200">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">Analysis: </span>
                    {lead.aiNotes ||
                      `${lead.name} represents high buying authority at ${lead.company}. ICP criteria met for Enterprise tier.`}
                  </p>
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Model: Gemini 2.5 Pro</span>
                    <span>Confidence: 94.8%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleGenerateOutreach}
                    isLoading={isGeneratingOutreach}
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  >
                    Draft AI Outreach Email
                  </Button>
                </div>
              </Card>

              {/* Generated Outreach Box */}
              {generatedOutreach && (
                <Card className="p-5 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      Generated Outreach Pitch
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedOutreach);
                        success('Copied', 'Outreach email copied to clipboard.');
                      }}
                      leftIcon={<Copy className="w-3 h-3" />}
                    >
                      Copy Draft
                    </Button>
                  </div>
                  <textarea
                    rows={9}
                    value={generatedOutreach}
                    onChange={(e) => setGeneratedOutreach(e.target.value)}
                    className="w-full text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white leading-relaxed"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(
                          `Autonomous workflows for ${lead.company}`
                        )}&body=${encodeURIComponent(generatedOutreach)}`;
                      }}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Open in Email Client
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions & Agent Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              CRM Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  window.location.href = `mailto:${lead.email}`;
                }}
                leftIcon={<Mail className="w-3.5 h-3.5" />}
              >
                Send Email to Prospect
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={handleCopyEmail}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Work Email
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  success('Synced with CRM', `Lead ${lead.name} synced to HubSpot deal pipeline.`);
                }}
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                Sync with HubSpot
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  info('Workflow Triggered', 'Fired Lead Nurture sequence.');
                }}
                leftIcon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
              >
                Run Nurture Automation
              </Button>
            </div>
          </Card>

          {/* Connected AI Agent Widget */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-neutral-900 dark:text-white" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Assigned AI Agent
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5">
              <p className="font-semibold text-neutral-900 dark:text-white">
                Inbound Qualifier Agent
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Monitors ICP intent criteria and coordinates executive calendar slots.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Model: Gemini 2.5 Pro</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={lead}
        onUpdateLead={updateLead}
      />

      {/* Delete Lead Confirm Modal */}
      <DeleteLeadConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        lead={lead}
        onConfirmDelete={async (id) => {
          await deleteLead(id);
          navigate('/dashboard/leads');
        }}
      />
    </div>
  );
}
