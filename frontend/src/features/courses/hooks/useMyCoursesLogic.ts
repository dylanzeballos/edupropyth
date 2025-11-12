import { useMemo } from 'react';
import { useCourses } from './useCourse';
import { useMyEnrollments } from './useEnrollment';
import type { Course } from '../types/course.types';

interface MyCoursesData {
  enrolledCourses: Course[];
  historicCourses: Course[];
  availableCourses: Course[];
  isLoading: boolean;
  error: Error | null;
}

export const useMyCoursesLogic = (): MyCoursesData => {
  const { data: allCourses, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments();

  const { enrolledCourses, historicCourses, availableCourses } = useMemo(() => {
    if (!allCourses || !enrollments) {
      return { 
        enrolledCourses: [], 
        historicCourses: [],
        availableCourses: [] 
      };
    }

    const enrolledCourseIds = new Set(
      enrollments
        .map((e) => e.group?.course?.id)
        .filter((id): id is string => Boolean(id))
    );

    const enrolled: Course[] = [];
    const historic: Course[] = [];
    
    allCourses.forEach((course) => {
      if (enrolledCourseIds.has(course.id)) {
        if (course.status === 'historic') {
          historic.push(course);
        } else {
          enrolled.push(course);
        }
      }
    });

    const available = allCourses.filter(
      (course) => 
        !enrolledCourseIds.has(course.id) && 
        course.status === 'active'
    );

    return { 
      enrolledCourses: enrolled, 
      historicCourses: historic,
      availableCourses: available 
    };
  }, [allCourses, enrollments]);

  return {
    enrolledCourses,
    historicCourses,
    availableCourses,
    isLoading: coursesLoading || enrollmentsLoading,
    error: coursesError,
  };
};
