export enum RealtimeEvent {
  COURSE_UPDATED = 'COURSE_UPDATED',
  MODULE_CREATED = 'MODULE_CREATED',
  LESSON_PUBLISHED = 'LESSON_PUBLISHED',
}

export type CourseEventPayload = {
  courseId: string;
  byUserId: string;
  at: string; // ISO date
  link?: string; // deep-link al recurso
  diff?: Record<string, unknown>;
};
