import type { Course } from './course.types';

export interface EnrollWithKeyRequest {
  groupId: string;
  enrollmentKey: string;
}

export interface EnrollWithCodeRequest {
  enrollmentKey: string;
}

export interface Enrollment {
  id: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'active' | 'suspended' | 'completed' | 'dropped';
  isActive: boolean;
  enrolledBy: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  group?: Group;
}

export interface Group {
  id: string;
  courseId: string;
  name: string;
  schedule?: string;
  instructorId?: string;
  maxStudents?: number;
  enrollmentKey?: string;
  isEnrollmentOpen: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  course?: Course;
}
