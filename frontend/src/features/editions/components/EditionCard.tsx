import { CalendarDays, Layers, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { CourseStatusBadge } from '@/features/courses/components/CourseStatusBadge';
import type { Edition } from '../types/edition.types';
import type { CourseStatus } from '@/features/courses/types/course.types';
import { formatDate } from '@/shared/utils/date.utils';
import { useState, useRef, useEffect } from 'react';

interface EditionCardProps {
  edition: Edition;
  onManage: (edition: Edition) => void;
  onChangeStatus?: (editionId: string, status: CourseStatus) => void;
  canEdit?: boolean;
}

export const EditionCard = ({ edition, onManage, onChangeStatus, canEdit = true }: EditionCardProps) => {
  const topicsCount = edition.topics?.length ?? 0;
  const groupsCount = edition.groups?.length ?? 0;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const canChangeStatus = canEdit && edition.status !== 'historic';
  const canEditContent = edition.status === 'active' || edition.status === 'draft';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleStatusChange = (newStatus: CourseStatus) => {
    if (onChangeStatus) {
      onChangeStatus(edition.id, newStatus);
    }
    setShowMenu(false);
  };

  const getAvailableStatuses = (): CourseStatus[] => {
    if (edition.status === 'draft') {
      return ['active', 'historic'];
    } else if (edition.status === 'active') {
      return ['draft', 'historic'];
    }
    return [];
  };

  const statusLabels: Record<CourseStatus, string> = {
    draft: 'Borrador',
    active: 'Activo',
    historic: 'Histórico',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Edición
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
            {edition.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <CourseStatusBadge status={edition.status} />
          {canChangeStatus && onChangeStatus && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Cambiar estado"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Cambiar a:
                    </div>
                    {getAvailableStatuses().map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
          {topicsCount} tópico{topicsCount !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {groupsCount} grupo{groupsCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onManage(edition)}>
          {canEditContent ? 'Administrar' : 'Ver detalles'}
        </Button>
      </div>
    </div>
  );
};
