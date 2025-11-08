import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface TopicFooterProps {
  currentIndex: number;
  totalTopics: number;
  hasPrev: boolean;
  hasNext: boolean;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

export const TopicFooter = ({
  currentIndex,
  totalTopics,
  hasPrev,
  hasNext,
  onNavigatePrev,
  onNavigateNext,
}: TopicFooterProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2.5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          icon1={ChevronLeft}
          size="sm"
        >
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
          {currentIndex + 1} / {totalTopics}
        </span>
        <Button
          variant="outline"
          onClick={onNavigateNext}
          disabled={!hasNext}
          icon2={ChevronRight}
          size="sm"
        >
          <span className="hidden sm:inline">Siguiente</span>
        </Button>
      </div>
    </div>
  );
};
