import {
  ClipboardList,
  FileText,
  MessageSquare,
  Code2,
  type LucideIcon,
} from 'lucide-react';
import { ActivityType } from '../types/activity.types';

export interface ActivityTypeConfig {
  value: ActivityType;
  label: string;
  description: string;
  Icon: LucideIcon;
  color: string;
}

export const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.QUIZ]: 'Cuestionario',
  [ActivityType.ASSIGNMENT]: 'Tarea',
  [ActivityType.DISCUSSION]: 'Discusión',
  [ActivityType.EXERCISE]: 'Ejercicio',
};

export const activityTypeColors: Record<ActivityType, string> = {
  [ActivityType.QUIZ]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  [ActivityType.ASSIGNMENT]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  [ActivityType.DISCUSSION]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  [ActivityType.EXERCISE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

export const activityTypeOptions: ActivityTypeConfig[] = [
  {
    value: ActivityType.QUIZ,
    label: 'Cuestionario',
    description: 'Preguntas de opción múltiple o verdadero/falso',
    Icon: ClipboardList,
    color: activityTypeColors[ActivityType.QUIZ],
  },
  {
    value: ActivityType.ASSIGNMENT,
    label: 'Tarea',
    description: 'Trabajos escritos o entregas de documentos',
    Icon: FileText,
    color: activityTypeColors[ActivityType.ASSIGNMENT],
  },
  {
    value: ActivityType.DISCUSSION,
    label: 'Discusión',
    description: 'Foros de debate y participación',
    Icon: MessageSquare,
    color: activityTypeColors[ActivityType.DISCUSSION],
  },
  {
    value: ActivityType.EXERCISE,
    label: 'Ejercicio',
    description: 'Ejercicios prácticos de código',
    Icon: Code2,
    color: activityTypeColors[ActivityType.EXERCISE],
  },
];
