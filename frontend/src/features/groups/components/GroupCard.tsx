import { Users, User, BadgeCheck } from 'lucide-react';
import type { Group } from '../types/group.types';
import { CourseStatusBadge } from '@/features/courses/components/CourseStatusBadge';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
}

export const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const enrollmentsCount = group.enrollments?.length ?? 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Grupo</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {group.name}
          </h3>
        </div>
        <CourseStatusBadge status={group.isActive ? 'active' : 'draft'} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> {enrollmentsCount} alumno
          {enrollmentsCount === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-1">
          <BadgeCheck className="w-4 h-4" />
          {group.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {group.instructorId ? (
            <span>Instructor: {group.instructorId}</span>
          ) : (
            <span className="italic text-gray-400">Sin instructor</span>
          )}
        </span>
        <div className="flex gap-2">
          {onEdit && (
            <button
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => onEdit(group)}
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              className="text-red-600 hover:text-red-700 text-sm"
              onClick={() => onDelete(group)}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
