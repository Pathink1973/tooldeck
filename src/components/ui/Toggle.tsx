import React from 'react';
import { cn } from '../../lib/utils';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, children, pressed, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        className={cn(
          'inline-flex items-center justify-center rounded-[12px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-emerald-500 text-white dark:bg-emerald-600': pressed && variant === 'default',
            'bg-gray-200 dark:bg-gray-700': !pressed && variant === 'default',
            'border-2 border-emerald-500 dark:border-emerald-600': pressed && variant === 'outline',
            'border border-gray-200 dark:border-gray-700': !pressed && variant === 'outline',
            'h-8 px-2.5': size === 'sm',
            'h-10 px-3': size === 'md',
            'h-12 px-5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';