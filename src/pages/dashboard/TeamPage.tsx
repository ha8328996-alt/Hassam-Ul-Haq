import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Plus } from 'lucide-react';
import { UserRole } from '../../types';

export function TeamPage() {
  const { team, inviteTeamMember } = useData();
  const { success, error } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('editor');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail || !inviteEmail.includes('@')) {
      error('Invalid fields', 'Please enter a valid member name and corporate email.');
      return;
    }
    inviteTeamMember(inviteName, inviteEmail, inviteRole);
    success('Invitation Dispatched', `Sent workspace access link to ${inviteEmail}`);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Team & Permissions
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage workspace members, role-based access control, and collaborator seats
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Member Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Collaborators (4 / 10 seats)</CardTitle>
          <p className="text-xs text-neutral-500 mt-0.5">
            Members can view, edit, or deploy autonomous workflows depending on assigned role
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">{member.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold capitalize text-neutral-800 dark:text-neutral-200">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={member.status === 'active' ? 'active' : 'paused'} label={member.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-500 text-[11px] font-mono">{member.joinedDate}</span>
                  </TableCell>
                  <TableCell align="right">
                    {member.role !== 'owner' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => success('Role Updated', `Modified access for ${member.name}`)}
                      >
                        Edit Role
                      </Button>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-mono pr-3">Workspace Owner</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Roles & Permissions Matrix */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
          Role-Based Access Control (RBAC) Governance
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
          FlowPilot enforces least-privilege security boundaries across all automated mutations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
            <span className="font-mono font-semibold uppercase text-[10px] text-neutral-400 block mb-1">
              Owner
            </span>
            <p className="text-neutral-700 dark:text-neutral-300">
              Full workspace rights, billing management, API key revocation, and workspace deletion.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
            <span className="font-mono font-semibold uppercase text-[10px] text-neutral-400 block mb-1">
              Admin
            </span>
            <p className="text-neutral-700 dark:text-neutral-300">
              Deploy agents, edit workflows, invite members, and configure external CRM connectors.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
            <span className="font-mono font-semibold uppercase text-[10px] text-neutral-400 block mb-1">
              Editor
            </span>
            <p className="text-neutral-700 dark:text-neutral-300">
              Trigger manual runs, reply to customer threads, manage leads, and test agent prompts.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
            <span className="font-mono font-semibold uppercase text-[10px] text-neutral-400 block mb-1">
              Viewer
            </span>
            <p className="text-neutral-700 dark:text-neutral-300">
              Read-only visibility for analytics telemetry, audit logs, and lead review.
            </p>
          </div>
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Workspace Member"
        description="Collaborators will receive an email invitation to join your workspace."
        maxWidth="md"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 pt-2">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Jordan Lee"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            label="Corporate Email"
            type="email"
            required
            placeholder="jordan.lee@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select
            label="Role Assignment"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as UserRole)}
            options={[
              { value: 'admin', label: 'Admin (Manage agents & workflows)' },
              { value: 'editor', label: 'Editor (Test agents & reply to inbox)' },
              { value: 'viewer', label: 'Viewer (Read-only access)' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
