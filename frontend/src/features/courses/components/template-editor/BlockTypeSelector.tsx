import { Modal } from '@/shared/components/ui';
import { ContentIcon, type ContentIconType } from '@/shared/components/icons/ContentIcons';

interface BlockType {
  type: ContentIconType;
  label: string;
}

interface BlockTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ContentIconType) => void;
  blockTypes: BlockType[];
}

export const BlockTypeSelector = ({
  isOpen,
  onClose,
  onSelect,
  blockTypes,
}: BlockTypeSelectorProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar Bloque">
      <div className="grid grid-cols-2 gap-3">
        {blockTypes.map((blockType) => (
          <button
            key={blockType.type}
            onClick={() => onSelect(blockType.type)}
            className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            <ContentIcon type={blockType.type} className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {blockType.label}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
};
