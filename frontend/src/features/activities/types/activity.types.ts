export const ActivityType = {
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  EXERCISE: 'exercise',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const SubmissionStatus = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
} as const;

export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export interface Activity {
  id: string;
  topicId: string;
  title: string;
  description: string;
  type: ActivityType;
  content: Record<string, unknown>;
  dueDate?: string;
  maxScore?: number;
  order: number;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitySubmission {
  id: string;
  activityId: string;
  userId: string;
  content: Record<string, unknown>;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  attemptNumber: number;
  createdAt: string;
  gradedAt?: string;
}

export interface CreateActivityDto {
  topicId: string;
  title: string;
  description: string;
  type: ActivityType;
  content: Record<string, unknown>;
  dueDate?: string;
  maxScore?: number;
  isRequired?: boolean;
}

export interface SubmitActivityDto {
  activityId: string;
  content: Record<string, unknown>;
}

export interface GradeSubmissionDto {
  score: number;
  feedback?: string;
}
