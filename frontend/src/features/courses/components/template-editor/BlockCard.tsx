import { GripVertical, FileText, Trash2 } from 'lucide-react';
import { BlockPreview } from './BlockPreview';
import type { ContentBlock } from '../../services/course-template.service';

interface BlockCardProps {
  block: ContentBlock;
  blockTypeLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const BlockCard = ({
  block,
  blockTypeLabel,
  onEdit,
  onDelete,
}: BlockCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-700 overflow-hidden group hover:border-blue-400 dark:hover:border-blue-500 transition-colors h-full">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <div className="drag-handle cursor-move">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {blockTypeLabel}
          </span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-42px)] overflow-auto">
        <BlockPreview block={block} />
      </div>
    </div>
  );
};
