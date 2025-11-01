// Types
export type * from './types/course.types';

// Hooks
export { useCourse, useCourses, useCreateCourse, useUpdateCourse } from './hooks/useCourse';
export { useCoursePermissions } from './hooks/useCoursePermissions';

// Components
export { CourseForm } from './components/CourseForm';
export { EmptyCourse } from './components/EmptyCourse';
export { CourseHeader } from './components/CourseHeader';
export { CourseInfo } from './components/CourseInfo';
export { CourseTopicsList } from './components/CourseTopicsList';
export { CourseListCard } from './components/CourseListCard';
export { CourseStatusBadge } from './components/CourseStatusBadge';

// Pages
export { CoursesListPage } from './pages/CoursesListPage';
export { CourseDetailPage } from './pages/CourseDetailPage';

// Services
export { courseService } from './services/course.service';

// Validation
export { createCourseSchema, updateCourseSchema } from './validation/course.schema';
export type { CreateCourseFormData, UpdateCourseFormData } from './validation/course.schema';
