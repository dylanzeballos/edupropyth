import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollment.service';
import type {
  EnrollWithKeyRequest,
  EnrollWithCodeRequest,
} from '../types/enrollment.types';
import { handleError } from '@/shared/utils/error-handler';

export const useEnrollWithKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollWithKeyRequest) =>
      enrollmentService.enrollWithKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useEnrollWithCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollWithCodeRequest) =>
      enrollmentService.enrollWithCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useMyEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });
};
