import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';
import type {
  CreateActivityDto,
  SubmitActivityDto,
  GradeSubmissionDto,
} from '../types/activity.types';

export const useActivity = () => {
  const queryClient = useQueryClient();

  const createActivity = useMutation({
    mutationFn: (data: CreateActivityDto) =>
      activityService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const submitActivity = useMutation({
    mutationFn: (data: SubmitActivityDto) =>
      activityService.submitActivity(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['activity-submissions', variables.activityId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
    },
  });
  const gradeSubmission = useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: string;
      data: GradeSubmissionDto;
    }) => activityService.gradeSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  return {
    createActivity,
    submitActivity,
    gradeSubmission,
  };
};

export const useMySubmissions = () => {
  return useQuery({
    queryKey: ['my-submissions'],
    queryFn: () => activityService.getMySubmissions(),
  });
};

export const useActivitySubmissions = (activityId: string) => {
  return useQuery({
    queryKey: ['activity-submissions', activityId],
    queryFn: () => activityService.getActivitySubmissions(activityId),
    enabled: !!activityId,
  });
};
