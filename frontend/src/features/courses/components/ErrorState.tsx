import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ 
  message = 'Error al cargar los cursos. Por favor, intenta nuevamente.' 
}: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-800 dark:text-red-200">{message}</p>
        </div>
      </div>
    </div>
  );
};
