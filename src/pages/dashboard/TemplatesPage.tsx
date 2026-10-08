import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useRouter } from '../../context/RouterContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Copy } from 'lucide-react';
import { Template } from '../../types';

export function TemplatesPage() {
  const { templates, useTemplate } = useData();
  const { navigate } = useRouter();
  const { success } = useToast();
  const [selectedComplexity, setSelectedComplexity] = useState('All');

  const filteredTemplates = templates.filter((t) => {
    if (selectedComplexity === 'All') return true;
    return t.complexity === selectedComplexity;
  });

  const handleUseTemplate = (template: Template) => {
    const newAuto = useTemplate(template.id);
    success('Template Cloned', `Added "${newAuto.name}" to your active automations.`);
    navigate('/dashboard/automations');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Automation Blueprints & Templates
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Production-grade reference workflows deployable with 1 click
          </p>
        </div>
        {/* Complexity filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedComplexity(c)}
              className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                selectedComplexity === c
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((tmpl) => (
          <Card key={tmpl.id} className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {tmpl.title}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Category: {tmpl.category} • Complexity: {tmpl.complexity}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {tmpl.executionsEstimate}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {tmpl.description}
              </p>
              {/* Steps overview */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Blueprint Steps ({tmpl.steps.length})
                </span>
                <div className="space-y-1 text-xs">
                  {tmpl.steps.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-neutral-400">{idx + 1}.</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {s.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {s.service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-mono">Trigger: {tmpl.triggerType}</span>
              <Button
                size="sm"
                onClick={() => handleUseTemplate(tmpl)}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Use Blueprint
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
