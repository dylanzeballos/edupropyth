import { useTeachers } from '@/features/users';
import { useMemo } from 'react';

export const useTeacherInfo = (teacherId?: string | null) => {
  const { data: teachers = [], isLoading } = useTeachers();

  const teacher = useMemo(() => {
    if (!teacherId) return null;
    return teachers.find((t) => t.id === teacherId);
  }, [teachers, teacherId]);

  const teacherName = useMemo(() => {
    if (!teacher) return null;
    return `${teacher.firstName} ${teacher.lastName}`.trim();
  }, [teacher]);

  return {
    teacher,
    teacherName,
    isLoading,
  };
};
