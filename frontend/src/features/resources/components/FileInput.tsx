import { useState } from 'react';

interface FileInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  error?: string;
}

export const FileInput = ({
  value,
  onChange,
  accept,
  disabled,
  error,
}: FileInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      onChange(file);

      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {value && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {value.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tamaño: {formatFileSize(value.size)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tipo: {value.type || 'Desconocido'}
          </p>
        </div>
      )}

      {previewUrl && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-md p-2">
          {value?.type.startsWith('image/') ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-auto max-h-64 mx-auto rounded"
            />
          ) : value?.type.startsWith('video/') ? (
            <video
              src={previewUrl}
              controls
              className="max-w-full h-auto max-h-64 mx-auto rounded"
            />
          ) : null}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Tamaño máximo: 100MB
      </p>
    </div>
  );
};
