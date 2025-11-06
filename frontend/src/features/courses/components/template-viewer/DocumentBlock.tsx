import { ExternalLink, FileIcon } from 'lucide-react';
import type { ContentBlock } from '../../services/course-template.service';
import type { Resource } from '../../types/course.types';

interface DocumentBlockProps {
  block: ContentBlock;
  resources?: Resource[];
}

export const DocumentBlock = ({ block, resources = [] }: DocumentBlockProps) => {
  let documentUrl = block.content.documentUrl;
  let documentTitle = block.content.title;

  if (!documentUrl && resources.length > 0) {
    const documentResource = resources.find((r) => r.type === 'document');
    if (documentResource) {
      documentUrl = documentResource.url;
      documentTitle = documentTitle || documentResource.title;
    }
  }

  if (!documentUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>No hay documento disponible</p>
      </div>
    );
  }

  const isPdf = documentUrl.toLowerCase().endsWith('.pdf') || documentUrl.includes('pdf');

  return (
    <div className="h-full flex flex-col">
      {documentTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {documentTitle}
        </h3>
      )}
      <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {isPdf ? (
          <iframe
            src={documentUrl}
            className="w-full h-full"
            title={documentTitle || 'Documento'}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <FileIcon className="w-16 h-16 text-orange-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              {documentTitle || 'Documento'}
            </p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Abrir documento
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
