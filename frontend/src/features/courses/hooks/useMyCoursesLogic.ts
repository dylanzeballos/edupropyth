import { useMemo } from 'react';
import { useCourses } from './useCourse';
import { useMyEnrollments } from './useEnrollment';
import type { Course } from '../types/course.types';

interface MyCoursesData {
  enrolledCourses: Course[];
  availableCourses: Course[];
  isLoading: boolean;
  error: Error | null;
}

export const useMyCoursesLogic = (): MyCoursesData => {
  const { data: allCourses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments();

  const { enrolledCourses, availableCourses } = useMemo(() => {
    if (!allCourses || !enrollments) {
      return { enrolledCourses: [], availableCourses: allCourses || [] };
    }

    const enrolledCourseIds = new Set(
      enrollments
        .map((e) => e.group?.course?.id)
        .filter((id): id is string => Boolean(id))
    );

    const enrolled = allCourses.filter((course) =>
      enrolledCourseIds.has(course.id)
    );

    const available = allCourses.filter(
      (course) => !enrolledCourseIds.has(course.id)
    );

    return { enrolledCourses: enrolled, availableCourses: available };
  }, [allCourses, enrollments]);

  return {
    enrolledCourses,
    availableCourses,
    isLoading: coursesLoading || enrollmentsLoading,
    error: coursesError,
  };
};
