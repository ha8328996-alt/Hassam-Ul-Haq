import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export function AnalyticsPage() {
  const { agents } = useData();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const daysData = [
    { day: 'Mon', runs: 4200, success: 99.2 },
    { day: 'Tue', runs: 5800, success: 99.1 },
    { day: 'Wed', runs: 6400, success: 99.4 },
    { day: 'Thu', runs: 7100, success: 98.9 },
    { day: 'Fri', runs: 6800, success: 99.5 },
    { day: 'Sat', runs: 2400, success: 100 },
    { day: 'Sun', runs: 1900, success: 100 },
  ];

  const maxRuns = Math.max(...daysData.map((d) => d.runs));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Analytics & Telemetry
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Operational throughput, autonomous resolution rates, and ROI metrics
          </p>
        </div>
        {/* Time range switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                timeRange === t.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Telemetry KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-neutral-500 block mb-1">Execution Volume</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            142,890
          </span>
          <span className="text-[11px] text-emerald-500 font-mono block mt-1">+14.2% vs prior</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-neutral-500 block mb-1">Time Reclaimed</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            480 hrs
          </span>
          <span className="text-[11px] text-neutral-400 font-mono block mt-1">~12 hrs / engineer</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-neutral-500 block mb-1">Average Latency</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            248ms
          </span>
          <span className="text-[11px] text-emerald-500 font-mono block mt-1">Optimal SLA tier</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-neutral-500 block mb-1">Estimated ROI</span>
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
            $28,400
          </span>
          <span className="text-[11px] text-emerald-500 font-mono block mt-1">Operational savings</span>
        </Card>
      </div>

      {/* Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <CardTitle>Weekly Automation Throughput</CardTitle>
            <p className="text-xs text-neutral-500">Total events processed per calendar day</p>
          </CardHeader>
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-3 h-48">
              {daysData.map((item) => {
                const heightPercent = Math.round((item.runs / maxRuns) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.runs.toLocaleString()}
                    </span>
                    <div
                      className="w-full max-w-[48px] bg-neutral-900 dark:bg-white rounded-t-sm group-hover:bg-emerald-500 transition-colors"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-mono text-neutral-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>Peak Day: Thursday (7,100 events)</span>
            <span>99.4% Avg Success</span>
          </div>
        </Card>

        {/* Channel Distribution */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader className="p-0 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <CardTitle>Inbound Channel Split</CardTitle>
            <p className="text-xs text-neutral-500">Volume distribution by channel</p>
          </CardHeader>
          <div className="space-y-4 py-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Corporate Email</span>
                <span className="font-mono font-medium">45%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[45%]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Slack Webhooks</span>
                <span className="font-mono font-medium">30%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[30%]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">Live Website Chat</span>
                <span className="font-mono font-medium">15%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[15%]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">WhatsApp Business</span>
                <span className="font-mono font-medium">10%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[10%]" />
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 font-mono">
            Synced across 4 active listeners
          </div>
        </Card>
      </div>

      {/* Agent Performance Benchmarks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Autonomous Agent Efficiency Benchmarks</CardTitle>
          <p className="text-xs text-neutral-500 mt-0.5">
            Latency, resolution reliability, and total executions per agent
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Model Tier</TableHead>
                <TableHead align="right">Executions</TableHead>
                <TableHead align="right">Avg Latency</TableHead>
                <TableHead align="right">Success Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((ag) => (
                <TableRow key={ag.id}>
                  <TableCell className="font-semibold text-neutral-900 dark:text-white">
                    {ag.name}
                  </TableCell>
                  <TableCell className="font-mono text-neutral-500">{ag.role}</TableCell>
                  <TableCell className="font-mono">{ag.model}</TableCell>
                  <TableCell isNumeric>{ag.totalExecutions.toLocaleString()}</TableCell>
                  <TableCell isNumeric>{ag.avgLatencyMs}ms</TableCell>
                  <TableCell isNumeric className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {ag.successRate}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
