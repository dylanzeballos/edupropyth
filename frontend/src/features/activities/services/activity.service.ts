import {apiClient} from '@/lib/api';
import type { Activity, ActivitySubmission, CreateActivityDto, SubmitActivityDto, GradeSubmissionDto } from '../types/activity.types';

export const activityService = {
    createActivity: async(data: CreateActivityDto): Promise<Activity> => {
        const response = await apiClient.post<Activity>('/activities', data);
        return response.data;
    },

    updateActivity: async(id: string, data: Partial<Activity>): Promise<Activity> => {
        const response = await apiClient.put<Activity>(`/activities/${id}`, data);
        return response.data;
    },

    deleteActivity: async(id: string): Promise<void> => {
        await apiClient.delete(`/activities/${id}`);
    },

    submitActivity: async(data: SubmitActivityDto): Promise<ActivitySubmission> => {
        const response = await apiClient.post<ActivitySubmission>('/activities/submit', data);
        return response.data;
    },

    gradeSubmission: async (submissionId: string, data: GradeSubmissionDto): Promise<ActivitySubmission> => {
        const response = await apiClient.post<ActivitySubmission>(`/activities/submissions/${submissionId}/grade`, data);
        return response.data;
    },

    getMySubmissions: async(): Promise<ActivitySubmission[]> => {
        const response = await apiClient.get<ActivitySubmission[]>('/activities/submissions/my');
        return response.data;
    },

    getActivitySubmissions: async(activityId: string): Promise<ActivitySubmission[]> => {
        const response = await apiClient.get<ActivitySubmission[]>(`/activities/${activityId}/submissions`);
        return response.data;
    },
};