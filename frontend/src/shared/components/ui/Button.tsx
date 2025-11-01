import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const variantColorClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400',
  tertiary: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400',
  cuarternary: 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400',
  variantText: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600',
  variantDeactivated: 'bg-gray-300 text-gray-500 cursor-not-allowed',
};

const variantClasses = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  outline:
    'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  ghost:
    'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
  link: 'text-blue-600 underline-offset-4 hover:underline',
};

const sizeClasses = {
  small: 'px-3 py-1.5 text-sm h-9',
  medium: 'px-4 py-2 text-base h-10',
  large: 'px-6 py-3 text-lg h-11',
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-lg px-3 text-sm',
  lg: 'h-11 rounded-lg px-8 text-base',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon1?: React.ElementType;
  icon2?: React.ElementType;
  variantColor?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'cuarternary'
    | 'variantText'
    | 'variantDeactivated';
  loading?: boolean;
  loadingText?: string;
  
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large' | 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon1: Icon1,
      icon2: Icon2,
      variantColor,
      variant,
      loading = false,
      loadingText,
      size = 'medium',
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    let variantClass = '';
    if (variantColor) {
      variantClass = variantColorClasses[variantColor];
    } else if (variant) {
      variantClass = variantClasses[variant];
    } else {
      variantClass = variantClasses.default;
    }

    const sizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap',
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingText || label || children}
          </>
        ) : (
          <>
            {Icon1 && <Icon1 className="w-5 h-5" />}
            {label || children}
            {Icon2 && <Icon2 className="w-5 h-5" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
