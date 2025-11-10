import { CalendarDays, Layers } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { CourseStatusBadge } from '@/features/courses/components/CourseStatusBadge';
import type { Edition } from '../types/edition.types';
import { formatDate } from '@/shared/utils/date.utils';

interface EditionCardProps {
  edition: Edition;
  onManage: (edition: Edition) => void;
}

export const EditionCard = ({ edition, onManage }: EditionCardProps) => {
  const topicsCount = edition.topics?.length ?? 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Edición
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
            {edition.title}
          </h3>
        </div>
        <CourseStatusBadge status={edition.status} />
      </div>

      {edition.description && (
        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
          {edition.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Actualizado: {formatDate(edition.updatedAt)}
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {topicsCount} tópicos
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onManage(edition)}>
          Administrar
        </Button>
      </div>
    </div>
  );
};
