import React, { createContext, useContext, useState, useEffect, ReactNode, MouseEvent } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  pathname: string;
  search: string;
  hash: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [search, setSearch] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search || '';
    }
    return '';
  });

  const [hash, setHash] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash || '';
    }
    return '';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearch(window.location.search || '');
      setHash(window.location.hash || '');
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    const [pathPart, queryOrHash = ''] = to.split('?');
    const [path, hashPart = ''] = pathPart.split('#');
    const newPath = path || '/';
    const newQuery = to.includes('?') ? `?${to.split('?')[1].split('#')[0]}` : '';
    const newHash = to.includes('#') ? `#${to.split('#')[1]}` : '';

    if (newPath !== currentPath || newQuery !== search || newHash !== hash) {
      window.history.pushState({}, '', to);
      setCurrentPath(newPath);
      setSearch(newQuery);
      setHash(newHash);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        pathname: currentPath,
        search,
        hash,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export function Link({
  to,
  children,
  className = '',
  activeClassName = '',
  exact = false,
  onClick,
  ...rest
}: LinkProps) {
  const { currentPath, navigate } = useRouter();
  const isActive = exact
    ? currentPath === to
    : currentPath === to || (to !== '/' && currentPath.startsWith(to));

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    navigate(to);
  };

  const finalClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={to} onClick={handleClick} className={finalClassName} {...rest}>
      {children}
    </a>
  );
}
