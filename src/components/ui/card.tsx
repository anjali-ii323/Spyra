import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: 'violet' | 'cyan' | 'red' | 'green' | 'amber';
}

export function Card({
  children,
  className = '',
  glow = false,
  glowColor = 'violet',
  ...props
}: CardProps) {
  const glowColors = {
    violet: 'shadow-[0_0_20px_rgba(139,92,246,0.05)] border-violet-500/10 hover:border-violet-500/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]',
    cyan: 'shadow-[0_0_20px_rgba(59,130,246,0.05)] border-blue-500/10 hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]',
    red: 'shadow-[0_0_20px_rgba(239,68,68,0.05)] border-red-500/10 hover:border-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.12)]',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.05)] border-green-500/10 hover:border-green-500/20 hover:shadow-[0_0_25px_rgba(34,197,94,0.12)]',
    amber: 'shadow-[0_0_20px_rgba(245,158,11,0.05)] border-amber-500/10 hover:border-amber-500/20 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]',
  };

  const glowStyle = glow ? glowColors[glowColor] : 'border-zinc-900 hover:border-zinc-800';

  return (
    <div
      className={`bg-zinc-950/40 backdrop-blur-md border rounded-xl overflow-hidden transition-all duration-300 ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border-b border-zinc-900/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-mono font-semibold text-slate-100 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-400 font-sans mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
