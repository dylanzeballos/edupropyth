import { useState, useMemo, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import type {
  ContentBlock,
  CourseTemplate,
} from '../services/course-template.service';
import type { Resource, Activity } from '../types/course.types';
import {
  BlockTypeSelector,
  BlockEditorModal,
  BlockCard,
} from './template-editor';
import type { ContentIconType } from '@/shared/components/icons/ContentIcons';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface CourseTemplateEditorProps {
  template: CourseTemplate;
  courseId: string;
  resources?: Resource[];
  activities?: Activity[];
  onSave: (blocks: ContentBlock[]) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const BLOCK_TYPES = [
  { type: 'html' as ContentIconType, label: 'Contenido HTML' },
  { type: 'video' as ContentIconType, label: 'Video' },
  { type: 'resource' as ContentIconType, label: 'Recursos' },
  { type: 'document' as ContentIconType, label: 'Documento' },
  { type: 'audio' as ContentIconType, label: 'Audio' },
  { type: 'activities' as ContentIconType, label: 'Actividades' },
];

export const CourseTemplateEditor = ({
  template,
  resources = [],
  activities = [],
  onSave,
  onCancel,
  isSaving = false,
}: CourseTemplateEditorProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(template.blocks || []);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showEditBlockModal, setShowEditBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  useEffect(() => {
    setBlocks(template.blocks || []);
  }, [template]);

  const layouts = useMemo(() => {
    const gridLayout: Layout[] = blocks.map((block) => ({
      i: block.id,
      x: block.position?.x || 0,
      y: block.position?.y || 0,
      w: block.position?.w || 6,
      h: block.position?.h || 4,
      minW: 2,
      minH: 2,
    }));
    return {
      lg: gridLayout,
      md: gridLayout,
      sm: gridLayout,
      xs: gridLayout,
      xxs: gridLayout,
    };
  }, [blocks]);

  const handleLayoutChange = (layout: Layout[]) => {
    const updatedBlocks = blocks.map((block) => {
      const layoutItem = layout.find((l) => l.i === block.id);
      if (layoutItem) {
        return {
          ...block,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
          order: layoutItem.y * 12 + layoutItem.x,
        };
      }
      return block;
    });
    setBlocks(updatedBlocks);
  };

  const handleAddBlock = (blockType: ContentIconType) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      layout: 'half',
      order: blocks.length,
      position: {
        x: 0,
        y:
          blocks.length > 0
            ? Math.max(...blocks.map((b) => b.position?.y || 0)) + 4
            : 0,
        w: 6,
        h: 4,
      },
      content: {},
    };
    setEditingBlock(newBlock);
    setShowAddBlockModal(false);
    setShowEditBlockModal(true);
  };

  const handleSaveBlock = () => {
    if (!editingBlock) return;
    const existingBlockIndex = blocks.findIndex(
      (b) => b.id === editingBlock.id,
    );
    if (existingBlockIndex >= 0) {
      const updatedBlocks = [...blocks];
      updatedBlocks[existingBlockIndex] = editingBlock;
      setBlocks(updatedBlocks);
    } else {
      setBlocks([...blocks, editingBlock]);
    }
    setShowEditBlockModal(false);
    setEditingBlock(null);
  };

  const handleEditBlock = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (block) {
      setEditingBlock({ ...block });
      setShowEditBlockModal(true);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
              Editor de Template de Curso
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
              Arrastra y redimensiona los bloques para organizar el contenido
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 sm:flex-nowrap">
            <Button
              variant="outline"
              onClick={() => setShowAddBlockModal(true)}
              icon1={Plus}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Agregar Bloque</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => onSave(blocks)}
              loading={isSaving}
              icon1={Save}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <span className="hidden sm:inline">Guardar Template</span>
              <span className="sm:hidden">Guardar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay bloques
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza agregando bloques para diseñar tu template
              </p>
              <Button onClick={() => setShowAddBlockModal(true)} icon1={Plus}>
                Agregar Primer Bloque
              </Button>
            </div>
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".drag-handle"
            compactType={null}
            preventCollision={false}
          >
            {blocks.map((block) => (
              <div key={block.id}>
                <BlockCard
                  block={block}
                  blockTypeLabel={
                    BLOCK_TYPES.find((t) => t.type === block.type)?.label ||
                    'Bloque'
                  }
                  onEdit={() => handleEditBlock(block.id)}
                  onDelete={() => handleDeleteBlock(block.id)}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>

      <BlockTypeSelector
        isOpen={showAddBlockModal}
        onClose={() => setShowAddBlockModal(false)}
        onSelect={handleAddBlock}
        blockTypes={BLOCK_TYPES}
      />

      <BlockEditorModal
        isOpen={showEditBlockModal}
        onClose={() => {
          setShowEditBlockModal(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
        block={editingBlock}
        blockTypeLabel={
          BLOCK_TYPES.find((t) => t.type === editingBlock?.type)?.label ||
          'Bloque'
        }
        resources={resources}
        activities={activities}
        onBlockChange={setEditingBlock}
      />
    </div>
  );
};
