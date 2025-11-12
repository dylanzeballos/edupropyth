import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';

export const TEACHERS_QUERY_KEY = ['teachers'] as const;

export const useTeachers = () => {
  return useQuery({
    queryKey: TEACHERS_QUERY_KEY,
    queryFn: usersService.getTeachers,
    staleTime: 5 * 60 * 1000, 
  });
};
