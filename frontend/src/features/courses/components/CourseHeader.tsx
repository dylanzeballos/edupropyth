import { Course } from '../types/course.types';
import { Button } from '@/shared/components/ui';

interface CourseHeaderProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: () => void;
}

export const CourseHeader = ({
  course,
  isEnrolled = false,
  onEnroll,
}: CourseHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="mmax-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6 opacity-90">{course.description}</p>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300">*</span>
                <span>{course.rating}</span>
              </div>
              <div>
                <span className="opacity-75">Estudiantes: </span>
                <span className="font-semibold">{course.studentsEnrolled}</span>
              </div>
              <div>
                <span className="opacity-75">Duración: </span>
                <span className="font-semibold">{course.duration}</span>
              </div>
            </div>

            {!isEnrolled && onEnroll && (
              <Button
                onClick={onEnroll}
                label="Inscribite ahora"
                variantColor="tertiary"
                className="text-lg px-8 py-4"
              />
            )}
          </div>
          {course.image && (
            <div className="flex justify-center">
              <img
                src={course.image}
                alt={course.title}
                className="max-w-md rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
