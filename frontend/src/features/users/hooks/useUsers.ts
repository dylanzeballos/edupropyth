import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from '../types/user-admin.types';
import { toast } from 'sonner';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAllUsers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: UpdateUserRoleDto) => usersService.updateUserRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Rol actualizado correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar el rol';
      toast.error(errorMessage);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateUserStatusDto) =>
      usersService.updateUserStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el estado';
      toast.error(errorMessage);
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    updateRole: updateRoleMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingRole: updateRoleMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
};
