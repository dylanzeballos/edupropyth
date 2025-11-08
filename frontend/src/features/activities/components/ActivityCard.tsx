import React from 'react';
import { Link } from 'react-router';
import { Calendar, Award } from 'lucide-react';
import { Activity } from '../types/activity.types';
import { Badge } from '@/shared/components/ui/badge';
import { formatDate } from '@/shared/utils/date.utils';
import {
  activityTypeLabels,
  activityTypeColors,
} from '../constants/activity-type-config';

interface ActivityCardProps {
  activity: Activity;
  submission?: { status: string; score?: number };
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, submission }) => {
  const isOverdue = activity.dueDate && new Date(activity.dueDate) < new Date();
  
  return (
    <Link
      to={`/activities/${activity.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activity.title}
        </h3>
        <Badge className={activityTypeColors[activity.type]}>
          {activityTypeLabels[activity.type]}
        </Badge>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
        {activity.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {activity.dueDate && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Calendar className="w-4 h-4" />
              {formatDate(activity.dueDate)}
            </span>
          )}
          {activity.maxScore && (
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Award className="w-4 h-4" />
              {activity.maxScore} pts
            </span>
          )}
        </div>

        {submission && (
          <div className="flex items-center gap-2">
            {submission.score !== undefined && (
              <span className="font-semibold text-green-600">
                {submission.score}/{activity.maxScore}
              </span>
            )}
            <Badge variant={submission.status === 'graded' ? 'success' : 'warning'}>
              {submission.status}
            </Badge>
          </div>
        )}
      </div>

      {activity.isRequired && (
        <div className="mt-2">
          <Badge variant="error" className="text-xs">
            Obligatorio
          </Badge>
        </div>
      )}
    </Link>
  );
};