import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  bgColor: string;
  iconColor: string;
}

export const InfoCard = ({
  icon: Icon,
  title,
  children,
  bgColor,
  iconColor,
}: InfoCardProps) => {
  return (
    <div className={`mb-3 p-3 ${bgColor} rounded-lg`}>
      <div className="flex items-start gap-2 text-sm">
        <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            {title}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};
