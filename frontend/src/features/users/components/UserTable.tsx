import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserAdmin } from '../types/user-admin.types';
import { UserRole, getRoleDisplayName } from '@/features/auth/types/user.type';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserTableProps {
  users: UserAdmin[];
  onUpdateRole: (userId: string, role: UserRole) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
  currentUserId: string;
}

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case UserRole.TEACHER_EDITOR:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case UserRole.TEACHER_EXECUTOR:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case UserRole.STUDENT:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return <ShieldCheck className="w-4 h-4" />;
    case UserRole.TEACHER_EDITOR:
    case UserRole.TEACHER_EXECUTOR:
      return <Shield className="w-4 h-4" />;
    case UserRole.STUDENT:
      return <ShieldOff className="w-4 h-4" />;
  }
};

export const UserTable = ({
  users,
  onUpdateRole,
  onToggleStatus,
  currentUserId,
}: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(search) ||
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      getRoleDisplayName(user.role).toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </p>
                      {user.id === currentUserId && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          (Tú)
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}
                  >
                    {getRoleIcon(user.role)}
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.isActive ? 'default' : 'secondary'}
                    className={
                      user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }
                  >
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        disabled={user.id === currentUserId}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                        Cambiar Rol
                      </DropdownMenuLabel>
                      {Object.values(UserRole).map((role) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => onUpdateRole(user.id, role)}
                          disabled={user.role === role}
                        >
                          {getRoleIcon(role)}
                          <span className="ml-2">
                            {getRoleDisplayName(role)}
                          </span>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(user.id, !user.isActive)}
                        className={
                          user.isActive ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {user.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
