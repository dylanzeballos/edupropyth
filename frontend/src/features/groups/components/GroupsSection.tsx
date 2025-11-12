import { Button } from '@/shared/components/ui';
import { EmptyState } from '@/shared/components/ui';
import { GroupCard } from './GroupCard';
import type { Group } from '../types/group.types';

interface GroupsSectionProps {
  groups?: Group[];
  isLoading: boolean;
  error: Error | null;
  canManageGroups: boolean;
  onCreateGroup: () => void;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
  canEditGroup: (group: Group) => boolean;
  canDeleteGroup: () => boolean;
}

export const GroupsSection = ({
  groups,
  isLoading,
  error,
  canManageGroups,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  canEditGroup,
  canDeleteGroup,
}: GroupsSectionProps) => {
  return (
    <section className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Grupos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza a los estudiantes por grupo y asigna instructores.
          </p>
        </div>
        {canManageGroups && (
          <Button
            onClick={onCreateGroup}
            className="w-full md:w-auto ml-auto"
          >
            Crear grupo
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            Cargando grupos...
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-200">
          No se pudieron cargar los grupos.
        </div>
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          title="Aún no tienes grupos"
          description="Crea un grupo para comenzar a asignar estudiantes."
          actionLabel={canManageGroups ? 'Crear grupo' : undefined}
          onAction={canManageGroups ? onCreateGroup : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => {
            const canEdit = canEditGroup(group);
            const canDelete = canDeleteGroup();
            
            return (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={canEdit ? () => onEditGroup(group) : undefined}
                onDelete={canDelete ? () => onDeleteGroup(group) : undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};