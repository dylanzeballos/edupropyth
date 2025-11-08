export enum Permission {
  //Permisos de admin
  MANAGE_USERS = 'manage_users',
  CHANGE_USER_ROLES = 'change_user_roles',
  DEACTIVATE_USERS = 'deactivate_users',
  VIEW_ALL_USERS = 'view_all_users',

  //Permisos de Profesor Editor
  CREATE_TOPICS = 'create_topics',
  EDIT_TOPICS = 'edit_topics',
  DELETE_TOPICS = 'delete_topics',
  CREATE_EXERCISES = 'create_exercises',
  EDIT_EXERCISES = 'edit_exercises',
  DELETE_EXERCISES = 'delete_exercises',

  //Permisos de Profesor Ejecutor
  VIEW_TOPICS = 'view_topics',
  VIEW_EXERCISES = 'view_exercises',
  EXECUTE_CODE = 'execute_code',
  VIEW_STUDENT_SUBMISSIONS = 'view_student_submissions',
  GRADE_SUBMISSIONS = 'grade_submissions',
  PROVIDE_FEEDBACK = 'provide_feedback',

  //Permisos de gestión de ediciones y grupos
  MANAGE_COURSE_EDITIONS = 'manage_course_editions',
  MANAGE_GROUPS = 'manage_groups',
  ASSIGN_INSTRUCTORS = 'assign_instructors',
  ENROLL_STUDENTS = 'enroll_students',

  //Permisos de Estudiante
  VIEW_ASSIGNED_TOPICS = 'view_assigned_topics',
  VIEW_ASSIGNED_EXERCISES = 'view_assigned_exercises',
  SUBMIT_EXERCISES = 'submit_exercises',
  VIEW_OWN_SUBMISSIONS = 'view_own_submissions',
  VIEW_OWN_GRADES = 'view_own_grades',
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    Permission.MANAGE_USERS,
    Permission.CHANGE_USER_ROLES,
    Permission.DEACTIVATE_USERS,
    Permission.VIEW_ALL_USERS,
    Permission.CREATE_TOPICS,
    Permission.EDIT_TOPICS,
    Permission.DELETE_TOPICS,
    Permission.CREATE_EXERCISES,
    Permission.EDIT_EXERCISES,
    Permission.DELETE_EXERCISES,
    Permission.VIEW_TOPICS,
    Permission.VIEW_EXERCISES,
    Permission.EXECUTE_CODE,
    Permission.VIEW_STUDENT_SUBMISSIONS,
    Permission.GRADE_SUBMISSIONS,
    Permission.PROVIDE_FEEDBACK,
    Permission.MANAGE_COURSE_EDITIONS,
    Permission.MANAGE_GROUPS,
    Permission.ASSIGN_INSTRUCTORS,
    Permission.ENROLL_STUDENTS,
  ],
  teacher_editor: [
    Permission.CREATE_TOPICS,
    Permission.EDIT_TOPICS,
    Permission.DELETE_TOPICS,
    Permission.CREATE_EXERCISES,
    Permission.EDIT_EXERCISES,
    Permission.DELETE_EXERCISES,
    Permission.VIEW_TOPICS,
    Permission.VIEW_EXERCISES,
    Permission.EXECUTE_CODE,
    Permission.MANAGE_COURSE_EDITIONS,
    Permission.MANAGE_GROUPS,
    Permission.ASSIGN_INSTRUCTORS,
    Permission.ENROLL_STUDENTS,
  ],
  teacher_executor: [
    Permission.VIEW_TOPICS,
    Permission.VIEW_EXERCISES,
    Permission.EXECUTE_CODE,
    Permission.VIEW_STUDENT_SUBMISSIONS,
    Permission.GRADE_SUBMISSIONS,
    Permission.PROVIDE_FEEDBACK,
    Permission.MANAGE_GROUPS,
    Permission.ASSIGN_INSTRUCTORS,
    Permission.ENROLL_STUDENTS,
  ],
  student: [
    Permission.VIEW_ASSIGNED_TOPICS,
    Permission.VIEW_ASSIGNED_EXERCISES,
    Permission.SUBMIT_EXERCISES,
    Permission.VIEW_OWN_SUBMISSIONS,
    Permission.VIEW_OWN_GRADES,
  ],
};
