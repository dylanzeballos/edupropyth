export type ContentBlockType =
  | 'video'
  | 'document'
  | 'resource'
  | 'html'
  | 'activities';

export type LayoutType =
  | 'full'
  | 'half'
  | 'third'
  | 'quarter'
  | 'two-thirds'
  | 'three-quarters';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  layout: LayoutType;
  order: number;
  content: ContentBlockData;
  style?: {
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

export interface ContentBlockData {
  html?: string;
}

export interface ContentBlockData {
  html?: string;
  videoUrl?: string;
  resourceIds?: string[];
  activityIds?: string[];
  documentUrl?: string;
  title?: string;
  description?: string;
}

export interface TopicTemplate {
  id: string;
  topicId: string;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateTemplateRequest {
  topicId: string;
  blocks: Omit<ContentBlock, 'id'>[];
}

export interface UpdateTemplateRequest {
  blocks?: Omit<ContentBlock, 'id'>[];
}
