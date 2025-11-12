import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  icon: LucideIcon;
  label?: string;
  children: ReactNode;
  className?: string;
}

export const InfoItem = ({ icon: Icon, label, children, className = '' }: InfoItemProps) => {
  return (
    <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-300 ${className}`}>
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-sm">
        {label && (
          <span className="text-gray-500 dark:text-gray-400">{label}: </span>
        )}
        {children}
      </span>
    </div>
  );
};
