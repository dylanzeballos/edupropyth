import type { ContentBlock } from '../../services/course-template.service';

interface HtmlBlockProps {
  block: ContentBlock;
}

export const HtmlBlock = ({ block }: HtmlBlockProps) => {
  if (!block.content.html) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        <p>No hay contenido disponible</p>
      </div>
    );
  }

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-3 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
      dangerouslySetInnerHTML={{ __html: block.content.html }}
    />
  );
};
