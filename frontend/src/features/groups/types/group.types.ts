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
  instructorId?: string | null;
  isActive: boolean;
  enrollments?: GroupEnrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  instructorId?: string | null;
}

export type UpdateGroupRequest = Partial<CreateGroupRequest> & {
  isActive?: boolean;
};
