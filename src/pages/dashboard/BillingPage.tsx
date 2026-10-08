import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { CreditCard, Download, Zap, Bot, Users, Check } from 'lucide-react';

export function BillingPage() {
  const { user } = useAuth();
  const { success } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const invoices = [
    { id: 'INV-2026-009', date: 'Oct 01, 2026', amount: '$199.00', status: 'paid', description: 'Professional Plan — Monthly' },
    { id: 'INV-2026-008', date: 'Sep 01, 2026', amount: '$199.00', status: 'paid', description: 'Professional Plan — Monthly' },
    { id: 'INV-2026-007', date: 'Aug 01, 2026', amount: '$199.00', status: 'paid', description: 'Professional Plan — Monthly' },
  ];

  const handleDownloadInvoice = (invoiceId: string) => {
    success('Invoice Downloaded', `Receipt ${invoiceId} saved as PDF.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Billing & Usage Quota
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your subscription tier, execution capacity, and billing history
          </p>
        </div>
        <Button size="sm" onClick={() => setIsUpgradeModalOpen(true)}>
          Change Subscription Plan
        </Button>
      </div>

      {/* Plan & Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Current Plan
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10">
                Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {user?.plan || 'Professional'} Tier
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              $199 / month • Billed monthly on the 1st
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100k Monthly Executions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Up to 15 Active Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Gemini 2.5 Pro & Flash</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>4h Dedicated Support SLA</span>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setIsUpgradeModalOpen(true)}
            >
              Upgrade to Enterprise
            </Button>
          </div>
        </Card>

        {/* Quota Progress */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <CardTitle>Monthly Resource Utilization</CardTitle>
              <p className="text-xs text-neutral-500">
                Cycle resets in 28 days (Nov 01, 2026)
              </p>
            </CardHeader>
            <div className="space-y-5 pt-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    Automation Executions
                  </span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    48,200 / 100,000 runs (48.2%)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[48.2%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-sky-500" />
                    Autonomous AI Agents
                  </span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    5 / 15 deployed (33.3%)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[33.3%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    Collaborator Seats
                  </span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    4 / 10 seats filled (40.0%)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[40%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>Quota automatically scales on demand</span>
            <span className="text-emerald-500">Nominal capacity</span>
          </div>
        </Card>
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
              Default Payment Method
            </span>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <CreditCard className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-white font-mono">
                  Visa ending in 4242
                </p>
                <p className="text-[11px] text-neutral-400 font-mono">Expires 08/2029</p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Invoices are automatically debited on the first day of each billing cycle.
            </p>
          </div>
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => success('Payment Card Updated', 'Stripe checkout modal initialized.')}
            >
              Update Payment Method
            </Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <p className="text-xs text-neutral-500">Download past billing receipts and tax invoices</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead align="right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono font-medium text-neutral-900 dark:text-white">
                      {inv.id}
                    </TableCell>
                    <TableCell className="font-mono text-neutral-500 text-[11px]">
                      {inv.date}
                    </TableCell>
                    <TableCell>{inv.description}</TableCell>
                    <TableCell isNumeric>{inv.amount}</TableCell>
                    <TableCell>
                      <StatusIndicator status="success" label="Paid" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadInvoice(inv.id)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Tier Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Workspace Plan"
        description="Select the operational tier that fits your multi-agent throughput requirements."
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Current Tier</span>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Professional</h4>
            <p className="text-xs text-neutral-500 font-mono">$199 / month</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">100,000 monthly runs, 15 agents, 10 team seats.</p>
          </div>
          <div className="p-4 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/20 space-y-2 relative">
            <span className="text-[10px] font-mono text-emerald-500 font-semibold uppercase">Enterprise Tier</span>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Custom Scale</h4>
            <p className="text-xs text-neutral-500 font-mono">Volume Pricing</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Unlimited runs, dedicated tenancy, custom model finetunes, 15m SLA.</p>
            <Button
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                success('Enterprise Contact Requested', 'Our solutions team will deliver your custom contract within 24h.');
                setIsUpgradeModalOpen(false);
              }}
            >
              Contact Solutions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
