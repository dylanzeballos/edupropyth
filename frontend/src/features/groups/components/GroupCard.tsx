import {
  Users,
  User,
  BadgeCheck,
  Calendar,
  Clock,
  Key,
  Hash,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Group } from '../types/group.types';
import { CourseStatusBadge } from '@/features/courses/components/CourseStatusBadge';
import { formatDateTime } from '@/shared/utils/date.utils';
import { useTeacherInfo } from '../hooks/useTeacherInfo';
import { InfoCard } from './InfoCard';
import { InfoItem } from './InfoItem';
import { Button } from '@/shared/components/ui';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
  onDelete?: (group: Group) => void;
}

export const GroupCard = ({ group, onEdit, onDelete }: GroupCardProps) => {
  const { teacherName, isLoading: loadingTeacher } = useTeacherInfo(
    group.instructorId
  );
  
  const enrollmentsCount = group.studentIds?.length ?? 0;
  const maxStudents = group.maxStudents;
  const hasSchedule = !!group.schedule;
  const hasEnrollmentKey = !!group.enrollmentKey;
  const hasEnrollmentDates =
    !!group.enrollmentStartDate || !!group.enrollmentEndDate;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Grupo</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {group.name}
          </h3>
        </div>
        <CourseStatusBadge status={group.isActive ? 'active' : 'draft'} />
      </div>

      {hasSchedule && (
        <InfoCard
          icon={Clock}
          title="Horario"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        >
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {group.schedule}
          </p>
        </InfoCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
        <InfoItem icon={User} label="Profesor">
          {loadingTeacher ? (
            <span className="text-gray-400">Cargando...</span>
          ) : teacherName ? (
            <span className="font-medium">{teacherName}</span>
          ) : (
            <span className="italic text-gray-400">Sin asignar</span>
          )}
        </InfoItem>

        <InfoItem icon={Users}>
          <span>
            <span className="font-medium">{enrollmentsCount}</span>
            {maxStudents && <span className="text-gray-500"> / {maxStudents}</span>} estudiante
            {enrollmentsCount === 1 ? '' : 's'}
          </span>
        </InfoItem>

        <InfoItem icon={BadgeCheck}>
          <span>{group.isActive ? 'Activo' : 'Inactivo'}</span>
        </InfoItem>

        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-gray-400" />
          <span
            className={`text-sm font-medium ${
              group.isEnrollmentOpen
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            Inscripción {group.isEnrollmentOpen ? 'abierta' : 'cerrada'}
          </span>
        </div>
      </div>

      {hasEnrollmentKey && (
        <InfoCard
          icon={Key}
          title="Código de inscripción"
          bgColor="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        >
          <div className="font-mono font-semibold text-lg text-green-700 dark:text-green-300">
            {group.enrollmentKey}
          </div>
        </InfoCard>
      )}

      {hasEnrollmentDates && (
        <InfoCard
          icon={Calendar}
          title="Período de inscripción"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        >
          <div className="space-y-1">
            {group.enrollmentStartDate && (
              <div className="text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">
                  Inicio:
                </span>{' '}
                <span className="font-medium">
                  {formatDateTime(group.enrollmentStartDate)}
                </span>
              </div>
            )}
            {group.enrollmentEndDate && (
              <div className="text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Fin:</span>{' '}
                <span className="font-medium">
                  {formatDateTime(group.enrollmentEndDate)}
                </span>
              </div>
            )}
          </div>
        </InfoCard>
      )}

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(group)}
            title="Editar grupo"
            aria-label="Editar grupo"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(group)}
            title="Eliminar grupo"
            aria-label="Eliminar grupo"
            className="hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
