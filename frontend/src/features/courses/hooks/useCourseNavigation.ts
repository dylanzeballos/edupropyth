import { useNavigate } from 'react-router';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { UserRole } from '@/features/auth/types/user.type';
import type { Course } from '../types/course.types';

interface UseCourseNavigationProps {
  course?: Course;
}

interface UseCourseNavigationReturn {
  navigateToCoursesPage: () => void;
  navigateToCourseView: (courseId: string) => void;
  navigateToCourseManagement: (courseId: string) => void;
  getBackPath: () => string;
  isManagementView: boolean;
}

export const useCourseNavigation = ({
  course,
}: UseCourseNavigationProps = {}): UseCourseNavigationReturn => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const canManageCourse = (currentCourse?: Course): boolean => {
    if (!user || !currentCourse) return false;

    const isAdmin = user.role === UserRole.ADMIN;
    const isInstructor = currentCourse.instructorId === user.id;
    const isTeacher =
      user.role === UserRole.TEACHER_EDITOR ||
      user.role === UserRole.TEACHER_EXECUTOR;

    return isAdmin || isInstructor || isTeacher;
  };

  const isManagementView = canManageCourse(course);

  const navigateToCoursesPage = () => {
    if (
      user &&
      (user.role === UserRole.ADMIN ||
        user.role === UserRole.TEACHER_EDITOR ||
        user.role === UserRole.TEACHER_EXECUTOR)
    ) {
      navigate('/course-management');
    } else {
      navigate('/my-courses');
    }
  };

  const navigateToCourseView = (courseId: string) => {
    navigate(`/courses/${courseId}/topics`);
  };

  const navigateToCourseManagement = (courseId: string) => {
    navigate(`/courses/${courseId}/management`);
  };

  const getBackPath = (): string => {
    if (
      user &&
      (user.role === UserRole.ADMIN ||
        user.role === UserRole.TEACHER_EDITOR ||
        user.role === UserRole.TEACHER_EXECUTOR)
    ) {
      return '/course-management';
    }
    return '/my-courses';
  };

  return {
    navigateToCoursesPage,
    navigateToCourseView,
    navigateToCourseManagement,
    getBackPath,
    isManagementView,
  };
};
