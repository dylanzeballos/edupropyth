import React from 'react';
import { Plus, Edit, Trash2, Calendar, Award, ClipboardList } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Activity } from '../types/activity.types';
import { activityTypeOptions } from '../constants/activity-type-config';

interface ActivityListProps {
  activities: Activity[];
  canEdit?: boolean;
  onAddActivity?: () => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (activityId: string) => void;
}

const activityTypeMap = activityTypeOptions.reduce((acc, option) => {
  acc[option.value] = option;
  return acc;
}, {} as Record<string, typeof activityTypeOptions[0]>);

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  canEdit = false,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No hay actividades en este tópico
        </p>
        {canEdit && onAddActivity && (
          <Button onClick={onAddActivity} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar primera actividad
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">
          Actividades ({activities.length})
        </h4>
        {canEdit && onAddActivity && (
          <Button onClick={onAddActivity} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar actividad
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {activities.map((activity) => {
          const config = activityTypeMap[activity.type];
          const isOverdue =
            activity.dueDate && new Date(activity.dueDate) < new Date();
          const ActivityIcon = config.Icon;

          return (
            <div
              key={activity.id}
              className="group p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <ActivityIcon className="w-5 h-5 flex-shrink-0 text-gray-600 dark:text-gray-400" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </h5>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
                    >
                      {config.label}
                    </span>
                    {activity.isRequired && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Obligatoria
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    {activity.dueDate && (
                      <div
                        className={`flex items-center gap-1 ${
                          isOverdue
                            ? 'text-red-600 dark:text-red-400 font-medium'
                            : ''
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(activity.dueDate).toLocaleDateString(
                            'es-ES',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {activity.maxScore && (
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{activity.maxScore} pts</span>
                      </div>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {onEditActivity && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditActivity(activity)}
                        className="h-8 px-2"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDeleteActivity && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteActivity(activity.id)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
