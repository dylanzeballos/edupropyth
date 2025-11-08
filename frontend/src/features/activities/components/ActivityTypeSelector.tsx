import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ActivityType } from '../types/activity.types';
import { activityTypeOptions } from '../constants/activity-type-config';
import { CheckIcon } from '@/shared/components/ui/CheckIcon';

interface ActivityTypeSelectorProps {
  selectedType: ActivityType;
  disabled?: boolean;
  error?: string;
  onTypeChange: (type: ActivityType) => void;
}

export const ActivityTypeSelector: React.FC<ActivityTypeSelectorProps> = ({
  selectedType,
  disabled = false,
  error,
  onTypeChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Tipo de actividad <span className="text-red-500">*</span>
        {disabled && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            (no se puede cambiar)
          </span>
        )}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activityTypeOptions.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-start p-4 border-2 rounded-lg
              transition-all duration-200
              ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              ${
                selectedType === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <input
              type="radio"
              value={option.value}
              checked={selectedType === option.value}
              onChange={(e) => onTypeChange(e.target.value as ActivityType)}
              className="sr-only"
              disabled={disabled}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <option.Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
            </div>
            {selectedType === option.value && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckIcon />
                </div>
              </div>
            )}
          </label>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
