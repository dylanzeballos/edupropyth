export interface Course {
  id: string;
  title: string;
  description: string;
  content?: string;
  isActive: boolean;
  image?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  content?: string;
  image?: string;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isActive?: boolean;
}
