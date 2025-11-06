import { LucideIcon } from 'lucide-react';
import {
  Video,
  FileText,
  Link as LinkIcon,
  FileIcon,
  CheckSquare,
  Music,
} from 'lucide-react';

export type ContentIconType =
  | 'html'
  | 'video'
  | 'resource'
  | 'document'
  | 'activities'
  | 'audio';

interface ContentIconProps {
  type: ContentIconType;
  className?: string;
}

const iconMap: Record<ContentIconType, LucideIcon> = {
  html: FileText,
  video: Video,
  resource: LinkIcon,
  document: FileIcon,
  activities: CheckSquare,
  audio: Music,
};

const colorMap: Record<ContentIconType, string> = {
  html: 'text-blue-500',
  video: 'text-purple-500',
  resource: 'text-green-500',
  document: 'text-orange-500',
  activities: 'text-pink-500',
  audio: 'text-indigo-500',
};

export const ContentIcon = ({
  type,
  className = 'w-5 h-5',
}: ContentIconProps) => {
  const Icon = iconMap[type];
  const colorClass = colorMap[type];

  return <Icon className={`${colorClass} ${className}`} />;
};
