// Types
export type {
  Resource,
  CreateResourceRequest,
  UploadResourceRequest,
  UpdateResourceRequest,
} from './types/resource.types';

// Validation
export {
  createResourceSchema,
  uploadResourceSchema,
  updateResourceSchema,
} from './validation/resource.schema';

// Services
export {
  createResource,
  uploadResource,
  updateResource,
  deleteResource,
} from './services/resource.service';

// Hooks
export {
  useCreateResource,
  useUploadResource,
  useUpdateResource,
  useDeleteResource,
} from './hooks/useResource';
export { useResourceActions } from './hooks/useResourceActions';

// Components
export { ResourceForm } from './components/ResourceForm';
export { ResourceCard } from './components/ResourceCard';
export { FileInput } from './components/FileInput';
export { ModeSelector } from './components/ModeSelector';
export { ResourceTypeSelector } from './components/ResourceTypeSelector';
