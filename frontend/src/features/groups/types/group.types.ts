export interface GroupEnrollment {
  id: string;
  groupId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  courseId: string;
  name: string;
  schedule?: string;
  instructorId?: string | null;
  isActive: boolean;
  enrollmentKey?: string;
  maxStudents?: number;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  isEnrollmentOpen: boolean;
  enrollments?: GroupEnrollment[];
  studentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  schedule?: string;
  instructorId?: string | null;
  maxStudents?: number;
  enrollmentKey?: string;
  isEnrollmentOpen?: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
}

export type UpdateGroupRequest = Partial<CreateGroupRequest> & {
  isActive?: boolean;
};
