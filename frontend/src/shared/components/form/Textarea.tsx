import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      isRequired = false,
      resize = 'vertical',
      className,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          rows={rows}
          className={cn(
            'block w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-900',
            hasError
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-600',
            resizeClasses[resize],
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
