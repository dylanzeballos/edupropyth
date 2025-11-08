import {
  getVideoEmbedUrl,
  detectVideoProvider,
} from '@/shared/utils/media.utils';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource } from '../../types/course.types';

interface VideoBlockProps {
  block: ContentBlock;
  resources?: Resource[];
}

export const VideoBlock = ({ block, resources = [] }: VideoBlockProps) => {
  let videoUrl = block.content.videoUrl;

  if (!videoUrl && resources.length > 0) {
    const videoResource = resources.find((r) => {
      if (r.type !== 'link') return false;
      const provider = detectVideoProvider(r.url);
      return provider === 'youtube' || provider === 'vimeo';
    });
    if (videoResource) {
      videoUrl = videoResource.url;
    }
  }

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null;

  return (
    <div className="h-full flex flex-col">
      {block.content.title && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
          {block.content.title}
        </h3>
      )}
      <div className="flex-1 aspect-video bg-gray-900 rounded-md overflow-hidden">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={block.content.title || 'Video'}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <p>No hay video disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};
