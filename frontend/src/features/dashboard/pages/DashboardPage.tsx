import { motion, progress } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, Edit, Plus } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { CourseCard } from '../components/CourseCard';
import { canEditCourse } from '@/shared/utils/permissions';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const course = {
    id: '1',
    title: 'Curso completo de python',
    description:
      'Aprende python desde cero hasta nivel avanzado con proyectos prácticos',
    image: 'https://via.placeholder.com/150',
    totalTopics: 10,
    completedTopics: 5,
    totalStudents: 100,
    progress: 50,
    instructor: {
      name: 'dr. maria gonzales',
      avatar: 'https://via.placeholder.com/150',
    },
  };
  const hasEditPermissions = canEditCourse(user);
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenido, {user?.firstName || user?.email}
              </h1>
              <p className="text-blue-100 mb-4">
                {user?.userType === 'Estudiante' &&
                  'Bienvenido de vuelta, sigue aprendiendo'}
                {user?.userType === 'Profesor' &&
                  'Bienvenido de vuelta, sigue enseñando'}
                {user?.userType === 'Admin' &&
                  'Bienvenido de vuelta, sigue administrando'}
              </p>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  {user?.userType}
                </span>
                <span className="text-sm text-blue-100">
                  Miembro desde{' '}
                  {new Date(user?.createdAt || '').toLocaleDateString('es-ES', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {hasEditPermissions && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Contenido
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={BookOpen}
          label="Tópicos Completados"
          value={course.completedTopics}
          subtitle={`de ${course.totalTopics} totales`}
          color="blue"
          delay={0}
        />
        <StatsCard
          icon={TrendingUp}
          label="Progreso del Curso"
          value={`${course.progress}%`}
          color="green"
          delay={0.1}
        />
        <StatsCard
          icon={Award}
          label="Puntos Ganados"
          value="340"
          subtitle="660 restantes"
          color="yellow"
          delay={0.2}
        />
        {hasEditPermissions && (
          <StatsCard
            icon={Users}
            label="Estudiantes Activos"
            value={course.totalStudents}
            color="purple"
            delay={0.3}
          />
        )}
      </div>

      {/* Course Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tu Curso Actual
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Continúa donde lo dejaste
            </p>
          </div>
        </div>

        <CourseCard course={course} canEdit={hasEditPermissions} />
      </div>

      {/* Quick Actions */}
      {hasEditPermissions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:shadow-md transition-all text-left"
            >
              <Edit className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Editar Curso
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Actualiza el contenido
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:shadow-md transition-all text-left"
            >
              <Plus className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Nuevo Tópico
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Agrega más contenido
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:shadow-md transition-all text-left"
            >
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Ver Estudiantes
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestiona inscripciones
              </p>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
