import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-white dark:ring-offset-zinc-950 active:scale-[0.98]";
  
  const variants = {
    // Primary: Deep Black background for maximum contrast
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 border border-transparent dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200",
    
    // Secondary: Crisp white with darker border (zinc-300) for better contrast in light mode
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm text-zinc-700 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:border-zinc-600",
    
    // Outline: Transparent background, distinct border
    outline: "bg-transparent border border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
    
    // Ghost: Subtle interaction
    ghost: "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
  };

  const sizes = {
    // Increased heights for better UI
    sm: "h-9 px-4 text-xs tracking-wide",
    md: "h-11 px-6 text-sm font-medium",
    lg: "h-14 px-8 text-base font-semibold",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2 opacity-90">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && !isLoading && <span className="ml-2 opacity-90">{rightIcon}</span>}
    </button>
  );
};