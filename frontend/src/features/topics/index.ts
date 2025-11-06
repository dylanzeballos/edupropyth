// Components
export { TopicCard } from './components/TopicCard';
export { TopicForm } from './components/TopicForm';

// Hooks
export { useTopic, useTopics } from './hooks/useTopic';
export { useTopicActions } from './hooks/useTopicActions';
export { useTopicNavigation } from './hooks/useTopicNavigation';
export { useTopicPermissions } from './hooks/useTopicPermissions';
export { useDefaultTemplate } from './hooks/useDefaultTemplate';

// Types
export type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
} from './types/topic.types';
export type {
  TopicTemplate,
  ContentBlock,
  ContentBlockType,
  LayoutType,
  ContentBlockData,
  CreateTemplateRequest,
  UpdateTemplateRequest,
} from './types/template.types';

// Validation
export type {
  CreateTopicFormData,
  UpdateTopicFormData,
} from './validation/topic.schema';

// Pages
export { TopicPublicViewPage } from './pages/TopicPublicViewPage';
