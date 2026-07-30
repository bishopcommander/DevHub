import React from 'react';
import clsx from 'clsx';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  return (
    <button
      className={clsx(
        'rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 disabled:opacity-50 disabled:pointer-events-none select-none',
        variant === 'primary' && 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98]',
        variant === 'ghost' && 'border border-stone-800 bg-stone-900/70 text-stone-200 hover:border-amber-500/30 hover:bg-stone-850 hover:text-white',
        variant === 'outline' && 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
