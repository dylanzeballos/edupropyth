import { motion } from 'framer-motion';
import { Code2, BookOpen, Zap, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  type?: 'login' | 'register';
}

const features = [
  {
    icon: Code2,
    title: 'Editor de Código Interactivo',
    description: 'Escribe, ejecuta y depura código Python en tiempo real',
  },
  {
    icon: BookOpen,
    title: 'Aprendizaje Progresivo',
    description:
      'Desde conceptos básicos hasta algoritmos avanzados y estructuras de datos',
  },
  {
    icon: Zap,
    title: 'Retroalimentación Instantánea',
    description:
      'Obtén resultados inmediatos y explicaciones detalladas de errores',
  },
];

export const AuthLayout = ({ children, type = 'login' }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Python Lab</h1>
                <p className="text-sm text-cyan-300">
                  Código • Aprende • Crece
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                Domina Python a través de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  práctica
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-12">
                Únete a miles de desarrolladores aprendiendo Python mediante
                ejercicios interactivos, ejecución de código en tiempo real, y
                desafíos progresivos diseñados para desarrollar tus habilidades.
              </p>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-700"
          >
            <div>
              <div className="text-3xl font-bold text-white mb-1">1000+</div>
              <div className="text-sm text-gray-400">Estudiantes Activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">Ejercicios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-sm text-gray-400">Tasa de Éxito</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 lg:hidden"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Python Lab
            </span>
          </div>
        </motion.div>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {type === 'login' ? 'Bienvenido de Vuelta' : 'Crea tu Cuenta'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'login'
                ? 'Inicia sesión para continuar tu trayectoria de aprendizaje en Python'
                : 'Regístrate para comenzar tu trayectoria de aprendizaje en Python'}
            </p>
          </motion.div>

          {children}
        </div>
      </div>
    </div>
  );
};
