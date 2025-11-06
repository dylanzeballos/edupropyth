import { useNavigate } from 'react-router';
import { FileText, ClipboardList, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Topic } from '../../types/topic.types';

interface BasicTopicViewProps {
  topic: Topic;
  courseId: string;
  canEditTemplate: boolean;
}

export const BasicTopicView = ({ topic, courseId, canEditTemplate }: BasicTopicViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Template no configurado
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Este curso no tiene un template configurado. Los recursos y actividades se muestran en formato básico.
          {canEditTemplate && (
            <span>
              {' '}
              <button
                onClick={() => navigate(`/courses/${courseId}/template`)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Haz clic aquí para configurar el template del curso
              </button>
              .
            </span>
          )}
        </p>
      </div>

      {topic.resources && topic.resources.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recursos del Tópico
          </h2>
          <div className="space-y-3">
            {topic.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.title}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {resource.type}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {topic.activities && topic.activities.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Actividades del Tópico
          </h2>
          <div className="space-y-3">
            {topic.activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  {activity.isRequired && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                      Obligatorio
                    </span>
                  )}
                </div>
                {activity.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {activity.description}
                  </p>
                )}
                {activity.maxScore && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Puntos: {activity.maxScore}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
