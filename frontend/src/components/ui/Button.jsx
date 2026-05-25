import React from 'react';
import clsx from 'clsx';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  return (
    <button
      className={clsx(
        'rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        variant === 'primary' && 'bg-sky-500 text-slate-950 hover:bg-sky-400',
        variant === 'ghost' && 'border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
