import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { TopicCard } from '@/features/topics';
import { ResourceCard } from '@/features/resources';
import type { Topic } from '@/features/topics';
import type { Resource } from '@/features/resources';
import type { CourseStatus } from '../types/course.types';

interface CourseTopicsListProps {
  topics: Topic[];
  courseStatus: CourseStatus;
  canEdit: boolean;
  canManageContent?: boolean;
  onAddTopic?: () => void;
  onEditTopic?: (topic: Topic) => void;
  onDeleteTopic?: (topicId: string) => void;
  onAddResource?: (topic: Topic) => void;
  onEditResource?: (resource: Resource) => void;
  onDeleteResource?: (resourceId: string) => void;
}

export const CourseTopicsList = ({
  topics,
  courseStatus,
  canEdit,
  canManageContent = canEdit,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: CourseTopicsListProps) => {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopicId((prev) => (prev === topicId ? null : topicId));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tópicos
        </h2>
        {canEdit && (
          <Button size="sm" onClick={onAddTopic}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tópico
          </Button>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay tópicos aún
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {canEdit
              ? 'Comienza agregando el primer tópico al curso.'
              : 'Este curso aún no tiene tópicos disponibles.'}
          </p>
          {canEdit && (
            <Button onClick={onAddTopic}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Tópico
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={topic.id} className="space-y-2">
              <TopicCard
                topic={topic}
                courseStatus={courseStatus}
                index={index}
                onEdit={
                  canEdit && onEditTopic ? () => onEditTopic(topic) : undefined
                }
                onDelete={
                  canEdit && onDeleteTopic
                    ? () => onDeleteTopic(topic.id)
                    : undefined
                }
                onClick={() => toggleTopicExpansion(topic.id)}
              />

              {expandedTopicId === topic.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recursos
                    </h3>
                    {canManageContent && onAddResource && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddResource(topic)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Recurso
                      </Button>
                    )}
                  </div>

                  {!topic.resources || topic.resources.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                      No hay recursos en este tópico aún.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {topic.resources.map((resource: Resource) => (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          onEdit={
                            canManageContent && onEditResource
                              ? onEditResource
                              : undefined
                          }
                          onDelete={
                            canManageContent && onDeleteResource
                              ? (id) => onDeleteResource(id)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
