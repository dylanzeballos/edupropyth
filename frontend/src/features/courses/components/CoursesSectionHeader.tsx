import { LucideIcon } from 'lucide-react';

interface CoursesSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  count: number;
  iconClassName?: string;
  badgeClassName?: string;
}

export const CoursesSectionHeader = ({
  icon: Icon,
  title,
  count,
  iconClassName = 'text-blue-600 dark:text-blue-400',
  badgeClassName = 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
}: CoursesSectionHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`w-6 h-6 ${iconClassName}`} />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${badgeClassName}`}>
        {count}
      </span>
    </div>
  );
};
