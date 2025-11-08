// Types
export type * from './types/course.types';

// Hooks
export {
  useCourse,
  useCourses,
  useCreateCourse,
  useUpdateCourse,
} from './hooks/useCourse';
export { useCoursePermissions } from './hooks/useCoursePermissions';
export { useCourseNavigation } from './hooks/useCourseNavigation';
export {
  useCourseTemplate,
  useCourseTemplateById,
  useCreateCourseTemplate,
  useUpdateCourseTemplate,
  useUpdateCourseTemplateByCourseId,
  useDeleteCourseTemplate,
  useDeleteCourseTemplateByCourseId,
} from './hooks/useCourseTemplate';

// Components
export { CourseForm } from './components/CourseForm';
export { EmptyCourse } from './components/EmptyCourse';
export { CourseHeader } from './components/CourseHeader';
export { CourseInfo } from './components/CourseInfo';
export { CourseTopicsList } from './components/CourseTopicsList';
export { CourseListCard } from './components/CourseListCard';
export { CourseStatusBadge } from './components/CourseStatusBadge';
export { CourseTemplateEditor } from './components/CourseTemplateEditor';
export { CourseTemplateViewer } from './components/CourseTemplateViewer';
export { StudentCourseCard } from './components/StudentCourseCard';

// Pages
export { CoursesListPage } from './pages/CoursesListPage';
export { CourseDetailPage } from './pages/CourseDetailPage';
export { CourseTemplateEditorPage } from './pages/CourseTemplateEditorPage';
export { MyCoursesPage } from './pages/MyCoursesPage';
export { CourseTopicsViewPage } from './pages/CourseTopicsViewPage';

// Services
export { courseService } from './services/course.service';
export { courseTemplateService } from './services/course-template.service';
export type {
  CourseTemplate,
  ContentBlock,
} from './services/course-template.service';

// Validation
export {
  createCourseSchema,
  updateCourseSchema,
} from './validation/course.schema';
export type {
  CreateCourseFormData,
  UpdateCourseFormData,
} from './validation/course.schema';
