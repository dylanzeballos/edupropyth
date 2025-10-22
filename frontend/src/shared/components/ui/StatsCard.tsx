import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  delay?: number;
}

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'blue',
  delay = 0,
}: StatsCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-gray-900/10 dark:hover:shadow-gray-900/50 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
