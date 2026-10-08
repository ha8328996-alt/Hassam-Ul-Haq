import React, { HTMLAttributes, forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all duration-150 ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-5 pb-3 border-b border-neutral-100 dark:border-neutral-800/60 ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 ${className}`}
        {...rest}
      >
        {children}
      </h3>
    );
  }
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed ${className}`}
        {...rest}
      >
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <div ref={ref} className={`p-5 ${className}`} {...rest}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';
