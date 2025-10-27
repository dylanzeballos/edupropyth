import { motion } from 'framer-motion';
import { Users, Shield, ShieldCheck, GraduationCap } from 'lucide-react';
import { UserStats } from '../types/user-admin.types';
import { UserRole } from '@/features/auth/types/user.type';

interface UserStatsCardsProps {
  stats: UserStats;
  isLoading: boolean;
}

export const UserStatsCards = ({ stats, isLoading }: UserStatsCardsProps) => {
  const cards = [
    {
      title: 'Total Usuarios',
      value: stats.total,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Administradores',
      value: stats.byRole[UserRole.ADMIN] || 0,
      icon: ShieldCheck,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Profesores',
      value:
        (stats.byRole[UserRole.TEACHER_EDITOR] || 0) +
        (stats.byRole[UserRole.TEACHER_EXECUTOR] || 0),
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Estudiantes',
      value: stats.byRole[UserRole.STUDENT] || 0,
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}
          />
        </motion.div>
      ))}
    </div>
  );
};
