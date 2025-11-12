import React from 'react';
import { Button, EmptyState } from '@/shared/components/ui';

interface CourseLoadingStateProps {
  isLoading: boolean;
  hasError: boolean;
  onNavigateBack: () => void;
}

export const CourseLoadingState: React.FC<CourseLoadingStateProps> = ({
  isLoading,
  hasError,
  onNavigateBack,
}) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onNavigateBack} className="mb-4">
          Volver a cursos
        </Button>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <EmptyState
            title="Curso no encontrado"
            description="El curso que buscas no existe o fue eliminado."
            actionLabel="Ver todos los cursos"
            onAction={onNavigateBack}
          />
        </div>
      </div>
    );
  }

  return null;
};
