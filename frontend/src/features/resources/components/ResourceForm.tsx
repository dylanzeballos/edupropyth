import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, InputText } from '@/shared/components/ui';
import type {
  UploadResourceRequest,
  CreateResourceRequest,
} from '../types/resource.types';
import { ResourceType } from '@/features/courses/types/course.types';
import { ModeSelector } from './ModeSelector';
import { ResourceTypeSelector } from './ResourceTypeSelector';
import { FileInput } from './FileInput';

interface ResourceFormProps {
  topicId: string;
  order: number;
  initialData?: {
    title: string;
    description?: string;
    type: ResourceType;
    url?: string;
    order: number;
  };
  onSubmit: (data: UploadResourceRequest | CreateResourceRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormData = {
  title: string;
  description?: string;
  type: ResourceType;
  url?: string;
  file?: File;
};

export const ResourceForm = ({
  topicId,
  order,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ResourceFormProps) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>(
    initialData?.url ? 'url' : 'file'
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'document',
      url: initialData?.url || '',
    },
  });

  const selectedType = watch('type');

  const handleModeChange = useCallback((mode: 'file' | 'url') => {
    setUploadMode(mode);
    if (mode === 'file') {
      setValue('url', undefined);
    } else {
      setValue('file', undefined);
    }
  }, [setValue]);

  const handleFormSubmit = (data: FormData) => {
    if (uploadMode === 'file') {
      if (!data.file || !(data.file instanceof File)) {
        console.error('No se seleccionó un archivo válido');
        return;
      }
      
      const submitData: UploadResourceRequest = {
        topicId,
        title: data.title.trim(),
        description: data.description?.trim(),
        type: data.type,
        order,
        file: data.file,
      };
      onSubmit(submitData);
    } else {
      if (!data.url || !data.url.trim()) {
        console.error('No se proporcionó una URL válida');
        return;
      }
      
      const submitData: CreateResourceRequest = {
        topicId,
        title: data.title.trim(),
        description: data.description?.trim(),
        type: data.type,
        url: data.url.trim(),
        order,
      };
      onSubmit(submitData);
    }
  };

  const getFileAccept = (type: ResourceType) => {
    switch (type) {
      case 'slide':
      case 'document':
        return '.pdf,.ppt,.pptx,.doc,.docx';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'type') {
        if (value.type === 'link' && uploadMode === 'file') {
          handleModeChange('url');
        }
        else if (value.type !== 'link' && uploadMode === 'url') {
          handleModeChange('file');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, uploadMode, handleModeChange]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <ModeSelector 
        mode={uploadMode} 
        onChange={handleModeChange} 
        disabled={isLoading} 
      />

      <InputText
        label="Título"
        name="title"
        type="text"
        placeholder="Ej: Introducción al tema"
        register={register}
        errors={errors}
        disabled={isLoading}
        isRequired={true}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Descripción del recurso (opcional)"
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px] resize-y disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <div>
            <ResourceTypeSelector 
              value={field.value}
              onChange={field.onChange}
            />
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
        )}
      />

      {uploadMode === 'file' ? (
        <div>
          <label className="block text-sm font-medium mb-2">
            Archivo <span className="text-red-500">*</span>
          </label>
          <Controller
            name="file"
            control={control}
            rules={{
              required: 'Debe seleccionar un archivo',
              validate: (value) => {
                if (!value || !(value instanceof File)) {
                  return 'Debe seleccionar un archivo válido';
                }
                if (value.size > 100 * 1024 * 1024) {
                  return 'El archivo no debe superar los 100MB';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <FileInput
                value={field.value || null}
                onChange={(file) => {
                  if (file instanceof File) {
                    field.onChange(file);
                  }
                }}
                accept={getFileAccept(selectedType)}
                disabled={isLoading}
                error={errors.file?.message}
              />
            )}
          />
        </div>
      ) : (
        <InputText
          label="URL"
          name="url"
          type="url"
          placeholder="https://ejemplo.com/recurso"
          register={register}
          errors={errors}
          disabled={isLoading}
          isRequired={uploadMode === 'url'}
          validationRules={{
            required: uploadMode === 'url' ? 'La URL es obligatoria' : false,
          }}
        />
      )}

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Recurso'}
        </Button>
      </div>
    </form>
  );
};
