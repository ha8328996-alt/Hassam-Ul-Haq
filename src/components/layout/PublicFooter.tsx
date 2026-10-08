import React from 'react';
import { Link } from '../../context/RouterContext';
import { Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand & Tagline */}
          <div className="col-span-2 space-y-3.5">
            <Link to="/" className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono text-[10px] font-bold">
                FP
              </span>
              <span>FlowPilot AI</span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              Automate Your Business With AI. Build intelligent agents, orchestrate business workflows, and unify customer channels.
            </p>
            <div className="flex items-center gap-3 pt-1 text-neutral-500 dark:text-neutral-400">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="X Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Discord">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-500 pt-1">
              <span>POWERED BY AI • BUILT FOR MODERN BUSINESSES</span>
            </div>
          </div>

          {/* Col 1: Product */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Product
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard/integrations" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/dashboard/agents" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  AI Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Resources
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/dashboard/templates" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Company
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <span className="text-neutral-400 dark:text-neutral-500">Careers</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
              Legal
            </p>
            <ul className="space-y-2">
              <li>
                <span className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer">Privacy</span>
              </li>
              <li>
                <span className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer">Terms</span>
              </li>
              <li>
                <span className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer">Security</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} FlowPilot AI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>SOC2 Type II</span>
            <span>•</span>
            <span>GDPR</span>
            <span>•</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
