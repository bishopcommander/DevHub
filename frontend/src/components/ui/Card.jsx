import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className }) => {
  return (
    <div className={clsx(
      'rounded-2xl border border-stone-800/80 bg-[#12100e]/80 backdrop-blur-md shadow-xl shadow-stone-950/60 transition-all duration-200 hover:border-stone-700/60',
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
