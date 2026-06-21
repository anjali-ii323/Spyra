import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  // Base styling for cyberpunk aesthetics
  const baseStyles = 'inline-flex items-center justify-center font-mono font-semibold rounded transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-violet-600/15 text-violet-400 border border-violet-500/45 hover:bg-violet-600/25 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    secondary: 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700',
    outline: 'bg-transparent text-slate-300 border border-zinc-800 hover:text-white hover:border-violet-500/50 hover:bg-violet-950/10',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-zinc-900/40'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-3'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
