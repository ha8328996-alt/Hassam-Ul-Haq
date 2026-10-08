import React, { useState } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';

export function PublicNavbar() {
  const { currentPath } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2 group"
        >
          <span className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            FP
          </span>
          <span>FlowPilot AI</span>
        </Link>

        {/* 3 Main Public Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors py-1 relative ${
              currentPath === '/'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Home
            {currentPath === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full" />
            )}
          </Link>
          <Link
            to="/about"
            className={`transition-colors py-1 relative ${
              currentPath === '/about'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            About
            {currentPath === '/about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full" />
            )}
          </Link>
          <Link
            to="/contact"
            className={`transition-colors py-1 relative ${
              currentPath === '/contact'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Contact
            {currentPath === '/contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 dark:bg-white rounded-full" />
            )}
          </Link>
        </nav>

        {/* Auth Actions & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {isAuthenticated ? (
            <Link to={user?.onboardingCompleted === false ? '/onboarding' : '/dashboard'}>
              <Button size="sm" leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}>
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-500 dark:text-neutral-400 rounded-lg cursor-pointer"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-medium py-2 transition-colors ${
              currentPath === '/'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-medium py-2 transition-colors ${
              currentPath === '/about'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-medium py-2 transition-colors ${
              currentPath === '/contact'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Contact
          </Link>
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
            {isAuthenticated ? (
              <Link
                to={user?.onboardingCompleted === false ? '/onboarding' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1"
              >
                <Button size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
