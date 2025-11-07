import React from 'react';

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3 text-white" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 12 12"
  >
    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
  </svg>
);
