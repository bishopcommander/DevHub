import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
  return (
    <div className={clsx('rounded-2xl border border-slate-800/90 bg-slate-900/70 backdrop-blur', className)}>
      {children}
    </div>
  );
};

export default Card;
