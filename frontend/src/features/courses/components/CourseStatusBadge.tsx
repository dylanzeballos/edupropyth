import type { CourseStatus } from '../types/course.types';

interface CourseStatusBadgeProps {
  status: CourseStatus;
  size?: 'sm' | 'md';
}

export const CourseStatusBadge = ({ status, size = 'md' }: CourseStatusBadgeProps) => {
  const badges = {
    draft: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-800 dark:text-gray-200',
      label: 'Borrador',
    },
    active: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      label: 'Activo',
    },
    historic: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-200',
      label: 'Histórico',
    },
  };

  const badge = badges[status];
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`${badge.bg} ${badge.text} ${sizeClasses[size]} font-medium rounded-full inline-block`}
    >
      {badge.label}
    </span>
  );
};
