import React from 'react';
import { Card } from '../ui/Card';
import { Lead } from '../../types';
import { Users, Sparkles, CheckCircle2, UserCheck, XCircle } from 'lucide-react';

interface LeadMetricsCardsProps {
  leads: Lead[];
  onFilterByStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

export function LeadMetricsCards({
  leads,
  onFilterByStatus,
  activeStatusFilter,
}: LeadMetricsCardsProps) {
  // Real-time calculation from actual lead data
  const totalCount = leads.length;
  const newCount = leads.filter((l) => (l.status || '').toLowerCase() === 'new').length;
  const qualifiedCount = leads.filter((l) => (l.status || '').toLowerCase() === 'qualified').length;
  const convertedCount = leads.filter((l) => (l.status || '').toLowerCase() === 'converted').length;
  const lostCount = leads.filter((l) => (l.status || '').toLowerCase() === 'lost').length;

  const totalValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const qualifiedValue = leads
    .filter((l) => (l.status || '').toLowerCase() === 'qualified')
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const convertedValue = leads
    .filter((l) => (l.status || '').toLowerCase() === 'converted')
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toLocaleString()}`;
  };

  const cards = [
    {
      id: 'all',
      title: 'Total Leads',
      count: totalCount,
      subtext: `${formatCurrency(totalValue)} pipeline`,
      icon: Users,
      color: 'text-neutral-900 dark:text-white',
      badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
      activeBorder: 'ring-2 ring-neutral-400 dark:ring-neutral-600',
    },
    {
      id: 'new',
      title: 'New Leads',
      count: newCount,
      subtext: totalCount > 0 ? `${Math.round((newCount / totalCount) * 100)}% of pipeline` : '0%',
      icon: Sparkles,
      color: 'text-sky-600 dark:text-sky-400',
      badgeColor: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
      activeBorder: 'ring-2 ring-sky-500',
    },
    {
      id: 'qualified',
      title: 'Qualified Leads',
      count: qualifiedCount,
      subtext: `${formatCurrency(qualifiedValue)} ARR`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      id: 'converted',
      title: 'Converted Leads',
      count: convertedCount,
      subtext: `${formatCurrency(convertedValue)} won`,
      icon: UserCheck,
      color: 'text-teal-600 dark:text-teal-400',
      badgeColor: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
      activeBorder: 'ring-2 ring-teal-500',
    },
    {
      id: 'lost',
      title: 'Lost Leads',
      count: lostCount,
      subtext: totalCount > 0 ? `${Math.round((lostCount / totalCount) * 100)}% churn` : '0%',
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      activeBorder: 'ring-2 ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatusFilter === card.id;

        return (
          <Card
            key={card.id}
            onClick={() => onFilterByStatus && onFilterByStatus(card.id)}
            className={`p-4 transition-all duration-150 cursor-pointer hover:shadow-xs border ${
              isActive ? `${card.activeBorder} shadow-xs` : 'hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.badgeColor} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className={`text-xl sm:text-2xl font-bold tracking-tight ${card.color} font-mono tabular-nums`}>
                {card.count}
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate font-medium">
                {card.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
