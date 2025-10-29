import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { UserStats, UserStatsResponse } from '../types/user-admin.types';

export const useUserStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-stats'],
    queryFn: usersService.getUserStats,
  });

  const stats: UserStats = {
    total: 0,
    byRole: {},
    active: 0,
    inactive: 0,
  };

  if (data) {
    data.forEach((stat: UserStatsResponse) => {
      const count = parseInt(stat.count, 10);
      stats.total += count;
      stats.byRole[stat.role] = count;
    });
  }

  return {
    stats,
    isLoading,
    error,
  };
};
