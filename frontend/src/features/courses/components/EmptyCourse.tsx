import { BookOpenIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface EmptyCourseProps {
  canCreate?: boolean;
  onCreateClick?: () => void;
}

export const EmptyCourse = ({ canCreate, onCreateClick }: EmptyCourseProps) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6">
          <BookOpenIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No hay curso creado
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {canCreate
          ? 'Comienza creando el curso único del sistema. Este curso será el contenido principal de la plataforma.'
          : 'El administrador aún no ha creado el curso de la plataforma. Por favor, espera a que el contenido esté disponible.'}
      </p>

      {canCreate && onCreateClick && (
        <Button
          variantColor="primary"
          onClick={onCreateClick}
          size="lg"
        >
          <BookOpenIcon className="h-5 w-5 mr-2" />
          Crear Curso
        </Button>
      )}
    </div>
  );
};
