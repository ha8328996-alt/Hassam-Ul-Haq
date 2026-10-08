import React, { useState } from 'react';
import { Link } from '../../context/RouterContext';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Check } from 'lucide-react';

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      targetAudience: 'For early-stage teams & technical founders',
      description: 'Deploy essential AI agents and automate core inbound sales or customer inquiry flows.',
      priceMonthly: 49,
      priceYearly: 39,
      popular: false,
      features: [
        '15,000 monthly automation executions',
        'Up to 3 active autonomous agents',
        '2 team workspace seats',
        'Gemini 2.5 Flash model access',
        'Standard integrations (Slack, Gmail, Webhooks)',
        'Community & standard email support',
      ],
      ctaText: 'Start 14-Day Trial',
      ctaVariant: 'outline' as const,
      route: '/signup?plan=starter',
    },
    {
      id: 'professional',
      name: 'Professional',
      targetAudience: 'For scaling operations & high-velocity sales orgs',
      description: 'Full multi-agent orchestration, advanced model reasoning, and high-throughput CRM integrations.',
      priceMonthly: 199,
      priceYearly: 159,
      popular: true,
      features: [
        '100,000 monthly automation executions',
        'Up to 15 active autonomous agents',
        '10 team workspace seats with RBAC',
        'Gemini 2.5 Pro & Flash reasoning',
        'Enterprise integrations (HubSpot, Salesforce, Stripe)',
        'Omnichannel unified inbox & live takeover',
        'Custom webhooks with HMAC verification',
        'Dedicated Slack support channel & 4h SLA',
      ],
      ctaText: 'Start Free Trial',
      ctaVariant: 'primary' as const,
      route: '/signup?plan=pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      targetAudience: 'For global enterprises requiring custom tenancy & SLAs',
      description: 'Dedicated cloud partitions, on-prem VPC peering, custom AI model finetuning, and 99.99% uptime guarantees.',
      priceMonthly: 'Custom',
      priceYearly: 'Custom',
      popular: false,
      features: [
        'Unlimited monthly automation executions',
        'Unlimited active autonomous agents',
        'Unlimited seats with SSO & SCIM',
        'Custom model weights & private VPC tenancy',
        'Dedicated solutions architect & 15m critical SLA',
        'Custom legal MSA, HIPAA, & SOC2 Type II reports',
        'Custom APEX & legacy ERP connector development',
      ],
      ctaText: 'Contact Solutions Team',
      ctaVariant: 'outline' as const,
      route: '/signup?plan=enterprise',
    },
  ];

  const comparisonRows = [
    { metric: 'Monthly Executions Quota', starter: '15,000', pro: '100,000', enterprise: 'Unlimited / Custom' },
    { metric: 'Active Autonomous Agents', starter: '3 agents', pro: '15 agents', enterprise: 'Unlimited' },
    { metric: 'Team Seats Included', starter: '2 seats', pro: '10 seats', enterprise: 'Unlimited' },
    { metric: 'Foundation Model Tiers', starter: 'Flash tier', pro: 'Pro & Flash', enterprise: 'Private endpoints & finetunes' },
    { metric: 'Omnichannel Inbox', starter: 'Email only', pro: 'Email, Slack, WhatsApp, Webchat', enterprise: 'Custom omnichannel endpoints' },
    { metric: 'Lead Intelligence Scoring', starter: 'Standard (0-100)', pro: 'Deep ICP Firmographic Synthesis', enterprise: 'Custom predictive pipeline models' },
    { metric: 'Webhooks & API Call Concurrency', starter: '10 req / sec', pro: '100 req / sec', enterprise: '1,000+ req / sec dedicated' },
    { metric: 'Support Response SLA', starter: '48 business hours', pro: '4 business hours', enterprise: '15-minute 24/7 dedicated' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
          Predictable Enterprise Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          Transparent Plans Tailored to Your Growth
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Scale your autonomous operations without hidden surcharges or artificial seat tax. All plans include 14-day full access.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <div className="p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 inline-flex items-center">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly billing</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isPro = plan.popular;
          const displayPrice =
            typeof plan.priceMonthly === 'number'
              ? billingPeriod === 'yearly'
                ? plan.priceYearly
                : plan.priceMonthly
              : plan.priceMonthly;

          return (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between relative transition-all ${
                isPro
                  ? 'border-neutral-900 dark:border-neutral-600 shadow-xl ring-1 ring-neutral-900 dark:ring-neutral-600'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-mono text-[10px] font-semibold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-medium text-neutral-500 uppercase tracking-wider block">
                    {plan.targetAudience}
                  </span>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4 flex items-baseline gap-1">
                  {typeof displayPrice === 'number' ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-950 dark:text-white">
                        ${displayPrice}
                      </span>
                      <span className="text-xs text-neutral-500">/ month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold text-neutral-950 dark:text-white">
                      Custom
                    </span>
                  )}
                </div>
                {billingPeriod === 'yearly' && typeof displayPrice === 'number' && (
                  <p className="text-[10px] text-neutral-400 mt-0.5">Billed annually (${displayPrice * 12}/yr)</p>
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                  What's included:
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Link to={plan.route} className="w-full">
                  <Button variant={plan.ctaVariant} size="md" className="w-full">
                    {plan.ctaText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="pt-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
            Technical Specification Matrix
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
            Compare Concrete Platform Limits
          </h2>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold">
                <th className="p-4">Platform Capability</th>
                <th className="p-4">Starter</th>
                <th className="p-4 bg-neutral-100/50 dark:bg-neutral-800/90 text-neutral-900 dark:text-white font-bold">
                  Professional
                </th>
                <th className="p-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-medium text-neutral-900 dark:text-neutral-200">{row.metric}</td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400 font-mono">{row.starter}</td>
                  <td className="p-4 font-mono font-medium text-neutral-900 dark:text-white bg-neutral-50/40 dark:bg-neutral-800/40">
                    {row.pro}
                  </td>
                  <td className="p-4 text-neutral-600 dark:text-neutral-400 font-mono">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
