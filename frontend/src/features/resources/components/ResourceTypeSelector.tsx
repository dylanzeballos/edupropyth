import {
  Presentation,
  Video,
  Music,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import type { ResourceType } from '@/features/courses/types/course.types';

interface ResourceTypeSelectorProps {
  value: ResourceType;
  onChange: (type: ResourceType) => void;
  disabled?: boolean;
  error?: string;
}

const resourceTypeConfig: Record<
  ResourceType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  slide: { label: 'Diapositiva', icon: Presentation },
  video: { label: 'Video', icon: Video },
  audio: { label: 'Audio', icon: Music },
  document: { label: 'Documento', icon: FileText },
  link: { label: 'Enlace', icon: LinkIcon },
};

export const ResourceTypeSelector = ({
  value,
  onChange,
  disabled,
  error,
}: ResourceTypeSelectorProps) => {
  return (
    <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Tipo de Recurso <span className="text-red-500">*</span>
      </label>
      <select
        id="type"
        value={value}
        onChange={(e) => onChange(e.target.value as ResourceType)}
        disabled={disabled}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {Object.entries(resourceTypeConfig).map(([key, config]) => (
          <option key={key} value={key}>
            {config.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
