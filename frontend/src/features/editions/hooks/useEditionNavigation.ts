import { useNavigate } from 'react-router';
import { useMemo } from 'react';
import type { Edition } from '../types/edition.types';
import { useCourseNavigation } from '@/features/courses/hooks/useCourseNavigation';
import type { Course } from '@/features/courses/types/course.types';

interface UseEditionNavigationProps {
  edition?: Edition;
}

export const useEditionNavigation = ({ edition }: UseEditionNavigationProps) => {
  const navigate = useNavigate();
  const courseLike = edition as Course | undefined;
  const { navigateToCoursesPage } = useCourseNavigation({ course: courseLike });

  const handleNavigateBack = useMemo(() => {
    return () => {
      if (edition?.blueprintId) {
        navigate(`/courses/${edition.blueprintId}/management`);
        return;
      }
      navigateToCoursesPage();
    };
  }, [edition?.blueprintId, navigate, navigateToCoursesPage]);

  return {
    handleNavigateBack,
  };
};