import { apiClient } from '@/lib/api';
import type {
  EnrollWithKeyRequest,
  EnrollWithCodeRequest,
  Enrollment,
} from '../types/enrollment.types';

export const enrollmentService = {
  enrollWithKey: async (data: EnrollWithKeyRequest): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>(
      '/enrollments/enroll',
      data,
    );
    return response.data;
  },

  enrollWithCode: async (data: EnrollWithCodeRequest): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>(
      '/enrollments/enroll-with-code',
      data,
    );
    return response.data;
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const response = await apiClient.get<Enrollment[]>(
      '/enrollments/my-enrollments',
    );
    return response.data;
  },

  unenroll: async (groupId: string): Promise<void> => {
    await apiClient.delete(`/enrollments/${groupId}`);
  },
};
