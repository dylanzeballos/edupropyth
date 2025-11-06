import type { ContentBlock } from '../../services/course-template.service';

interface HtmlBlockProps {
  block: ContentBlock;
}

export const HtmlBlock = ({ block }: HtmlBlockProps) => {
  if (!block.content.html) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No hay contenido disponible</p>
      </div>
    );
  }

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: block.content.html }}
    />
  );
};
