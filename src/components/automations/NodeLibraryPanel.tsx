import React, { useState } from 'react';
import {
  Search,
  Plus,
  Zap,
  Bot,
  GitBranch,
  Play,
  Sliders,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { NODE_LIBRARY, NodeTemplateDefinition, getNodeIconComponent } from './nodeLibraryData';

interface NodeLibraryPanelProps {
  onAddNode: (template: NodeTemplateDefinition) => void;
  className?: string;
}

export function NodeLibraryPanel({ onAddNode, className = '' }: NodeLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const categories: Array<'Triggers' | 'AI' | 'Logic' | 'Actions' | 'Utility'> = [
    'Triggers',
    'AI',
    'Logic',
    'Actions',
    'Utility',
  ];

  const categoryBadges: Record<string, { label: string; bg: string; text: string }> = {
    Triggers: {
      label: 'TRIGGER',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      text: 'text-emerald-500',
    },
    AI: {
      label: 'AI INTELLIGENCE',
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400',
      text: 'text-sky-500',
    },
    Logic: {
      label: 'LOGIC & BRANCHING',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      text: 'text-amber-500',
    },
    Actions: {
      label: 'ACTION & MUTATION',
      bg: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
      text: 'text-purple-500',
    },
    Utility: {
      label: 'UTILITY & HELPERS',
      bg: 'bg-neutral-500/10 border-neutral-500/20 text-neutral-600 dark:text-neutral-400',
      text: 'text-neutral-500',
    },
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredNodes = NODE_LIBRARY.filter((node) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.title.toLowerCase().includes(q) ||
      node.description.toLowerCase().includes(q) ||
      node.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      {/* Search Header */}
      <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
            Node Library
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {NODE_LIBRARY.length} nodes
          </span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search triggers, AI, logic, actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
        </div>
      </div>

      {/* Categories & Node Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) => {
          const categoryNodes = filteredNodes.filter((n) => n.category === category);
          if (categoryNodes.length === 0) return null;

          const isCollapsed = collapsedCategories[category];
          const badge = categoryBadges[category];

          return (
            <div key={category} className="space-y-1.5">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between py-1 px-1.5 text-left rounded hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 tracking-wide">
                    {category}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${badge.bg}`}
                  >
                    {categoryNodes.length}
                  </span>
                </div>
              </button>

              {/* Node Cards */}
              {!isCollapsed && (
                <div className="space-y-1.5 pl-1">
                  {categoryNodes.map((node) => (
                    <div
                      key={node.nodeKey}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'application/flowpilot-node-template',
                          JSON.stringify(node)
                        );
                      }}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-grab active:cursor-grabbing group shadow-2xs hover:shadow-xs relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${badge.bg}`}
                          >
                            {getNodeIconComponent(node.icon, `w-3.5 h-3.5 ${badge.text}`)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                              {node.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mt-0.5">
                              {node.description}
                            </p>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button
                          onClick={() => onAddNode(node)}
                          className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                          title={`Add ${node.title} to canvas`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-400 space-y-1">
            <p>No matching nodes found</p>
            <p className="text-[10px] text-neutral-500">Try searching for "lead", "agent", or "email"</p>
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 text-[10px] text-neutral-400 flex items-center gap-1.5">
        <GripVertical className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
        <span>Drag nodes onto the canvas or click (+) to add</span>
      </div>
    </div>
  );
}
