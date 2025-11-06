import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
}

export const LoadingView = ({ message = 'Cargando tópico...' }: LoadingViewProps) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};
