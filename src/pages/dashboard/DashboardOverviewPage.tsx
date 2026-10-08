import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useRouter } from '../../context/RouterContext';
import { Link } from '../../context/RouterContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Zap,
  Bot,
  Users,
  Activity,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Grid,
} from 'lucide-react';

export function DashboardOverviewPage() {
  const { user } = useAuth();
  const { automations, agents } = useData();
  const { navigate } = useRouter();

  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; runs: number; date: string } | null>(null);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const totalAutomationsCount = automations.length > 0 ? automations.length : 24;
  const activeAutomationsCount = automations.filter((a) => a.status === 'active').length || 18;
  const totalTasksCompleted = 12458;
  const totalLeadsGenerated = 1284;

  const activityData: Record<'7D' | '30D' | '90D', { date: string; runs: number }[]> = {
    '7D': [
      { date: 'Mon', runs: 390 },
      { date: 'Tue', runs: 440 },
      { date: 'Wed', runs: 520 },
      { date: 'Thu', runs: 480 },
      { date: 'Fri', runs: 610 },
      { date: 'Sat', runs: 310 },
      { date: 'Sun', runs: 360 },
    ],
    '30D': [
      { date: 'Day 1', runs: 310 },
      { date: 'Day 3', runs: 340 },
      { date: 'Day 5', runs: 420 },
      { date: 'Day 8', runs: 380 },
      { date: 'Day 10', runs: 490 },
      { date: 'Day 12', runs: 510 },
      { date: 'Day 15', runs: 460 },
      { date: 'Day 18', runs: 580 },
      { date: 'Day 20', runs: 620 },
      { date: 'Day 22', runs: 590 },
      { date: 'Day 25', runs: 680 },
      { date: 'Day 27', runs: 710 },
      { date: 'Day 30', runs: 745 },
    ],
    '90D': [
      { date: 'W1', runs: 2100 },
      { date: 'W3', runs: 2450 },
      { date: 'W5', runs: 2900 },
      { date: 'W7', runs: 3150 },
      { date: 'W9', runs: 3400 },
      { date: 'W11', runs: 3890 },
      { date: 'W12', runs: 4120 },
    ],
  };

  const currentChartData = activityData[timeRange];
  const maxRuns = Math.max(...currentChartData.map((d) => d.runs));
  const minRuns = Math.min(...currentChartData.map((d) => d.runs));

  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 20;
  const paddingY = 25;

  const points = currentChartData.map((d, i) => {
    const x = paddingX + (i / (currentChartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((d.runs - minRuns * 0.8) / (maxRuns - minRuns * 0.8 || 1)) * (svgHeight - paddingY * 2);
    return { x, y, runs: d.runs, date: d.date };
  });

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaString = `${points[0].x},${svgHeight - 10} ${pointsString} ${points[points.length - 1].x},${svgHeight - 10}`;

  const topAutomations = [
    {
      id: 'aut_1',
      name: 'Lead Qualification',
      status: 'Active',
      runs: '1,284',
      successRate: '98%',
      lastRun: '2 minutes ago',
    },
    {
      id: 'aut_2',
      name: 'Customer Support Agent',
      status: 'Active',
      runs: '842',
      successRate: '99%',
      lastRun: '8 minutes ago',
    },
    {
      id: 'aut_3',
      name: 'Email Follow-up',
      status: 'Active',
      runs: '624',
      successRate: '97%',
      lastRun: '15 minutes ago',
    },
    {
      id: 'aut_4',
      name: 'HubSpot Pipeline Sync',
      status: 'Active',
      runs: '1,890',
      successRate: '99.4%',
      lastRun: '25 minutes ago',
    },
  ];

  const recentActivities = [
    {
      id: 'act_1',
      icon: <Bot className="w-4 h-4 text-sky-500" />,
      description: 'Customer Support Agent completed a conversation with Acme Corp',
      time: '2 minutes ago',
      status: 'Completed',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'act_2',
      icon: <Users className="w-4 h-4 text-amber-500" />,
      description: 'New lead captured: Sarah Jenkins (VP Tech, Meridian FinTech) scored 94/100',
      time: '12 minutes ago',
      status: 'Captured',
      badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
      id: 'act_3',
      icon: <Zap className="w-4 h-4 text-emerald-500" />,
      description: 'Inbound Lead Enrichment & CRM Pipeline Sync automation completed successfully',
      time: '18 minutes ago',
      status: 'Success',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'act_4',
      icon: <Grid className="w-4 h-4 text-purple-500" />,
      description: 'New integration connected: HubSpot CRM bi-directional sync authenticated',
      time: '45 minutes ago',
      status: 'Connected',
      badgeColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'act_5',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      description: 'Workflow activated: Executive Calendar Concierge v2 enabled across organization',
      time: '1 hour ago',
      status: 'Active',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  const activeAgentsList = agents.filter((a) => a.status === 'active');
  const agentSummaries =
    activeAgentsList.length > 0
      ? activeAgentsList.slice(0, 3).map((a) => ({
          id: a.id,
          name: a.name,
          status: a.status,
          conversations: (a.conversationsCount || a.totalExecutions || 1420).toLocaleString(),
          tasks: (a.tasksCount || Math.round((a.totalExecutions || 1) * 2.4) || 3840).toLocaleString(),
          successRate: `${a.successRate || 98.4}%`,
        }))
      : [
          {
            id: 'agt_sales',
            name: 'Sales Assistant',
            status: 'active',
            conversations: '1,420',
            tasks: '3,840',
            successRate: '98.2%',
          },
          {
            id: 'agt_support',
            name: 'Customer Support',
            status: 'active',
            conversations: '4,890',
            tasks: '9,120',
            successRate: '99.1%',
          },
          {
            id: 'agt_qualifier',
            name: 'Lead Qualifier',
            status: 'active',
            conversations: '2,140',
            tasks: '4,210',
            successRate: '97.8%',
          },
        ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Greeting & Date/Status Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
              • {todayFormatted}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome back, {user?.name || 'Operator'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            FlowPilot AI autonomous execution status and real-time pipeline performance.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/dashboard/automations/new">
            <Button size="sm" variant="outline" leftIcon={<Zap className="w-3.5 h-3.5" />}>
              Create Automation
            </Button>
          </Link>
          <Link to="/dashboard/agents">
            <Button size="sm" variant="outline" leftIcon={<Bot className="w-3.5 h-3.5" />}>
              Create AI Agent
            </Button>
          </Link>
          <Link to="/dashboard/leads">
            <Button size="sm" variant="outline" leftIcon={<Users className="w-3.5 h-3.5" />}>
              Add Lead
            </Button>
          </Link>
          <Link to="/dashboard/integrations">
            <Button size="sm" leftIcon={<Grid className="w-3.5 h-3.5" />}>
              Connect Integration
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Four Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL AUTOMATIONS */}
        <Card className="p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Automations
            </span>
            <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums tracking-tight">
              {totalAutomationsCount}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">vs. previous 30 days</p>
        </Card>

        {/* ACTIVE AUTOMATIONS */}
        <Card className="p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Automations
            </span>
            <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4 text-sky-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums tracking-tight">
              {activeAutomationsCount}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +8.5%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Running continuous triggers</p>
        </Card>

        {/* TASKS COMPLETED */}
        <Card className="p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Tasks Completed
            </span>
            <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums tracking-tight">
              {totalTasksCompleted.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +24.1%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">99.8% autonomous execution</p>
        </Card>

        {/* LEADS GENERATED */}
        <Card className="p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Leads Generated
            </span>
            <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums tracking-tight">
              {totalLeadsGenerated.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +18.7%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Enriched & scored by AI</p>
        </Card>
      </div>

      {/* 3 & 4. Analytics Preview: Automation Activity & Automation Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Automation Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Automation Activity
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Automated workflow runs over the selected timeframe
              </p>
            </div>
            {/* Time Controls */}
            <div className="flex items-center rounded-lg p-1 bg-neutral-100 dark:bg-neutral-800/80 text-xs">
              {(['7D', '30D', '90D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    timeRange === r
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Peak Velocity</span>
                <span className="text-neutral-900 dark:text-white font-bold text-sm">
                  {maxRuns.toLocaleString()} runs/interval
                </span>
              </div>
              <div className="border-l border-neutral-200 dark:border-neutral-800 pl-6">
                <span className="text-neutral-400 block text-[10px] uppercase">Average Latency</span>
                <span className="text-neutral-900 dark:text-white font-bold text-sm">214ms</span>
              </div>
              <div className="border-l border-neutral-200 dark:border-neutral-800 pl-6 hidden sm:block">
                <span className="text-neutral-400 block text-[10px] uppercase">API Gateway</span>
                <span className="text-emerald-500 font-bold text-sm">99.98% Uptime</span>
              </div>
            </div>

            <div className="relative w-full h-48 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl p-2 overflow-hidden border border-neutral-100 dark:border-neutral-800/50">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-200 dark:text-neutral-800/70" />
                <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-200 dark:text-neutral-800/70" />
                <line x1="0" y1="140" x2={svgWidth} y2="140" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-200 dark:text-neutral-800/70" />
                <polygon points={areaString} fill="url(#activityGradient)" />
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.index === idx ? 5 : 3.5}
                    className="fill-white dark:fill-neutral-900 stroke-emerald-500 cursor-pointer transition-all hover:scale-125"
                    strokeWidth="2.5"
                    onMouseEnter={() => setHoveredPoint({ index: idx, runs: p.runs, date: p.date })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {hoveredPoint && (
                <div
                  className="absolute z-10 px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-mono shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full border border-neutral-700"
                  style={{
                    left: `${(points[hoveredPoint.index].x / svgWidth) * 100}%`,
                    top: `${(points[hoveredPoint.index].y / svgHeight) * 100 - 8}%`,
                  }}
                >
                  <p className="font-semibold text-emerald-400">{hoveredPoint.runs.toLocaleString()} runs</p>
                  <p className="text-[10px] text-neutral-400">{hoveredPoint.date}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-neutral-400 px-2">
              {currentChartData.map((d, i) => (
                <span key={i}>{d.date}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Automation Performance */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
              Automation Performance
            </CardTitle>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Execution breakdown & reliability telemetry
            </p>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-6">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400 tracking-wider">
                  Success Rate
                </span>
                <p className="text-3xl font-extrabold font-mono text-emerald-500 tracking-tight mt-0.5">
                  98.4%
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Reliability telemetry</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-mono font-bold text-xs text-emerald-500">
                98%
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                <div style={{ width: '98.4%' }} className="bg-emerald-500 h-full" title="Successful: 98.4%" />
                <div style={{ width: '1.0%' }} className="bg-rose-500 h-full" title="Failed: 1.0%" />
                <div style={{ width: '0.6%' }} className="bg-amber-500 h-full" title="Running: 0.6%" />
              </div>
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">Successful</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-neutral-900 dark:text-white font-semibold">12,258</span>
                    <span className="text-[10px] text-neutral-400">(98.4%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">Failed</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-neutral-900 dark:text-white font-semibold">128</span>
                    <span className="text-[10px] text-rose-500">(1.0%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">Running</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-neutral-900 dark:text-white font-semibold">72</span>
                    <span className="text-[10px] text-amber-500">(0.6%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Automatic error retries</span>
              <span className="font-mono text-emerald-500">Enabled (3 attempts)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5 & 6. Top Automations Table & Recent Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Top Automations
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Highest throughput workflows and execution health
              </p>
            </div>
            <Link to="/dashboard/automations">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Automations
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/80 dark:bg-neutral-900/50 text-neutral-500 uppercase tracking-wider font-mono text-[10px] border-b border-neutral-100 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Runs</th>
                    <th className="py-3 px-3 text-right">Success Rate</th>
                    <th className="py-3 px-4 text-right">Last Run</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {topAutomations.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/dashboard/automations/${row.id}`)}
                    >
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white flex items-center gap-2.5">
                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="group-hover:text-emerald-500 transition-colors">{row.name}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-medium text-neutral-800 dark:text-neutral-200">
                        {row.runs}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-emerald-500">
                        {row.successRate}
                      </td>
                      <td className="py-3.5 px-4 text-right text-neutral-400 font-mono text-[11px]">
                        {row.lastRun}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Recent Activity
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Audit feed of autonomous operations
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Gateway Feed" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 flex items-start gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-neutral-800 dark:text-neutral-200 font-medium leading-snug line-clamp-2">
                      {act.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-0.5">
                      <span>{act.time}</span>
                      <span className={`px-1.5 py-0.2 rounded border font-medium ${act.badgeColor}`}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 8 & 9. AI Agent Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                AI Agents
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Active autonomous agents executing pipeline and customer workflows
              </p>
            </div>
            <Link to="/dashboard/agents">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Agents
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {agentSummaries.map((agt) => (
                <div
                  key={agt.id}
                  onClick={() => navigate('/dashboard/agents')}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                        <Bot className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                        {agt.name}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block">Conversations</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{agt.conversations}</span>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block">Tasks</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{agt.tasks}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-neutral-500 text-[11px]">Success Rate</span>
                    <span className="font-mono font-bold text-emerald-500">{agt.successRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Overview */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
                Lead Overview
              </CardTitle>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Conversion funnel and qualification pipeline
              </p>
            </div>
            <Link to="/dashboard/leads">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Leads
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-mono font-semibold text-neutral-400 block">
                  New Leads
                </span>
                <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white mt-0.5 block">
                  1,284
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-500/5 border border-sky-500/20">
                <span className="text-[10px] uppercase font-mono font-semibold text-sky-600 dark:text-sky-400 block">
                  Qualified
                </span>
                <span className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400 mt-0.5 block">
                  842
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-mono font-semibold text-emerald-600 dark:text-emerald-400 block">
                  Converted
                </span>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  418
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                Pipeline Conversion Funnel
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">1. Inbound Ingestion</span>
                  <span className="font-mono text-neutral-500">1,284 (100%)</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-neutral-500 dark:bg-neutral-400 h-full w-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-sky-600 dark:text-sky-400 font-medium">2. AI Qualified (Score &gt; 70)</span>
                  <span className="font-mono text-sky-500">842 (65.6%)</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[65.6%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">3. Deal Converted</span>
                  <span className="font-mono text-emerald-500">418 (32.5%)</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[32.5%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Avg Conversion Time</span>
              <span className="font-mono text-neutral-900 dark:text-white font-medium">2.4 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
