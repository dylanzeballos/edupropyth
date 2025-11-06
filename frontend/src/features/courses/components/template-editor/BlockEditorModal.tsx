import { Modal, Button } from '@/shared/components/ui';
import { Input, Textarea } from '@/shared/components/form';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource, Activity } from '../../types/course.types';

interface BlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  block: ContentBlock | null;
  blockTypeLabel: string;
  resources?: Resource[];
  activities?: Activity[];
  onBlockChange: (block: ContentBlock) => void;
}

export const BlockEditorModal = ({
  isOpen,
  onClose,
  onSave,
  block,
  blockTypeLabel,
  resources = [],
  activities = [],
  onBlockChange,
}: BlockEditorModalProps) => {
  if (!block) return null;

  const updateContent = (updates: Record<string, unknown>) => {
    onBlockChange({
      ...block,
      content: { ...block.content, ...updates },
    });
  };

  const renderFields = () => {
    switch (block.type) {
      case 'html':
        return (
          <>
            <Input
              label="Título (opcional)"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Textarea
              label="Contenido HTML"
              value={block.content.html || ''}
              onChange={(e) => updateContent({ html: e.target.value })}
              rows={10}
              placeholder="<h1>Título</h1><p>Contenido...</p>"
            />
          </>
        );

      case 'video':
        return (
          <>
            <Input
              label="Título"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Input
              label="URL del Video"
              value={block.content.videoUrl || ''}
              onChange={(e) => updateContent({ videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="YouTube, Vimeo o URL directa"
            />
          </>
        );

      case 'resource':
        return (
          <>
            <Input
              label="Título"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Textarea
              label="Descripción (opcional)"
              value={block.content.description || ''}
              onChange={(e) => updateContent({ description: e.target.value })}
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recursos del tópico a mostrar
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Los recursos se mostrarán automáticamente cuando el tópico los
                tenga
              </p>
              {resources.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                  Se mostrarán los recursos que se agreguen a cada tópico
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  {resources.map((resource) => (
                    <label
                      key={resource.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={
                          block.content.resourceIds?.includes(resource.id) ||
                          false
                        }
                        onChange={(e) => {
                          const currentIds = block.content.resourceIds || [];
                          const newIds = e.target.checked
                            ? [...currentIds, resource.id]
                            : currentIds.filter((id) => id !== resource.id);
                          updateContent({ resourceIds: newIds });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {resource.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      case 'document':
        return (
          <>
            <Input
              label="Título"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Input
              label="URL del Documento"
              value={block.content.documentUrl || ''}
              onChange={(e) => updateContent({ documentUrl: e.target.value })}
              placeholder="https://..."
              helperText="PDF, Google Docs, etc."
            />
          </>
        );

      case 'audio':
        return (
          <>
            <Input
              label="Título"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Textarea
              label="Descripción (opcional)"
              value={block.content.description || ''}
              onChange={(e) => updateContent({ description: e.target.value })}
              rows={3}
            />
          </>
        );

      case 'activities':
        return (
          <>
            <Input
              label="Título"
              value={block.content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
            />
            <Textarea
              label="Descripción (opcional)"
              value={block.content.description || ''}
              onChange={(e) => updateContent({ description: e.target.value })}
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actividades del tópico a mostrar
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Las actividades se mostrarán automáticamente cuando el tópico
                las tenga
              </p>
              {activities.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                  Se mostrarán las actividades que se agreguen a cada tópico
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                  {activities.map((activity) => (
                    <label
                      key={activity.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={
                          block.content.activityIds?.includes(activity.id) ||
                          false
                        }
                        onChange={(e) => {
                          const currentIds = block.content.activityIds || [];
                          const newIds = e.target.checked
                            ? [...currentIds, activity.id]
                            : currentIds.filter((id) => id !== activity.id);
                          updateContent({ activityIds: newIds });
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {activity.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${blockTypeLabel}`}>
      <div className="space-y-4">
        {renderFields()}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={onSave} className="flex-1">
            Guardar Bloque
          </Button>
        </div>
      </div>
    </Modal>
  );
};
