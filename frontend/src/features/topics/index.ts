// Types
export type * from './types/topic.types';

// Hooks
export {
  useTopics,
  useTopic,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  useReorderTopics,
  useCloneTopicToHistoric,
  TOPIC_QUERY_KEYS,
} from './hooks/useTopic';
export { useTopicActions } from './hooks/useTopicActions';

// Components
export { TopicForm } from './components/TopicForm';
export { TopicCard } from './components/TopicCard';

// Services
export { topicService } from './services/topic.service';

// Validation
export {
  createTopicSchema,
  updateTopicSchema,
  reorderTopicsSchema,
} from './validation/topic.schema';
export type {
  CreateTopicFormData,
  UpdateTopicFormData,
  ReorderTopicsFormData,
} from './validation/topic.schema';
