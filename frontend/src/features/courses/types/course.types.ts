export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  studentsEnrolled: number;
  rating: number;
  topics: Topic[];
  instructors: Instructor[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  learningObjectives: string[];
  instructor: Instructor;
  isCompleted?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  expertise: string[];
}
