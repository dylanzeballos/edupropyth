import { Video, LinkIcon, FileIcon, CheckSquare } from 'lucide-react';
import { ContentIcon } from '@/shared/components/icons/ContentIcons';
import type { ContentBlock } from '../../services/course-template.service';

interface BlockPreviewProps {
  block: ContentBlock;
}

export const BlockPreview = ({ block }: BlockPreviewProps) => {
  switch (block.type) {
    case 'html':
      return (
        <div className="prose dark:prose-invert max-w-none text-sm">
          {block.content.html ? (
            <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
          ) : (
            <p className="text-gray-400">Sin contenido HTML</p>
          )}
        </div>
      );

    case 'video':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Video className="w-12 h-12 mb-2 text-purple-500" />
          <h3 className="font-medium">
            {block.content.title || 'Video sin título'}
          </h3>
          {block.content.videoUrl && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-full px-2">
              {block.content.videoUrl}
            </p>
          )}
        </div>
      );

    case 'resource': {
      const resourceCount = block.content.resourceIds?.length || 0;
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <LinkIcon className="w-12 h-12 mb-2 text-green-500" />
          <h3 className="font-medium">{block.content.title || 'Recursos'}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {resourceCount} recurso(s)
          </p>
        </div>
      );
    }

    case 'document':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FileIcon className="w-12 h-12 mb-2 text-orange-500" />
          <h3 className="font-medium">{block.content.title || 'Documento'}</h3>
          {block.content.documentUrl && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-full px-2">
              {block.content.documentUrl}
            </p>
          )}
        </div>
      );

    case 'activities': {
      const activityCount = block.content.activityIds?.length || 0;
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <CheckSquare className="w-12 h-12 mb-2 text-pink-500" />
          <h3 className="font-medium">
            {block.content.title || 'Actividades'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {activityCount} actividad(es)
          </p>
        </div>
      );
    }

    case 'audio':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ContentIcon type="audio" className="w-12 h-12 mb-2" />
          <h3 className="font-medium">{block.content.title || 'Audio'}</h3>
          <p className="text-sm text-gray-500 mt-1">Archivos de audio</p>
        </div>
      );

    default:
      return null;
  }
};
