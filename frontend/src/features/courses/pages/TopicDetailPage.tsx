import { useParams, useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui';
import { Topic } from '../types/course.types';

const mockTopic: Topic = {
  id: '1',
  title: 'Introducción a Python',
  description:
    'En este tópico aprenderás los conceptos fundamentales de Python, incluyendo sintaxis básica, variables, tipos de datos y estructuras de control.',
  duration: '2 semanas',
  difficulty: 'easy',
  prerequisites: ['Conocimientos básicos de computación'],
  learningObjectives: [
    'Comprender la sintaxis básica de Python',
    'Trabajar con variables y tipos de datos',
    'Implementar estructuras de control',
    'Crear funciones básicas',
    'Manejar entrada y salida de datos',
  ],
  instructor: {
    id: '1',
    name: 'Dr. María González',
    avatar: '/instructor-avatar.jpg',
    bio: 'Doctora en Ciencias de la Computación con más de 10 años de experiencia enseñando Python y desarrollo de software.',
    expertise: [
      'Python',
      'Algoritmos',
      'Estructura de Datos',
      'Machine Learning',
    ],
  },
};

export const TopicDetailPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const handleStartTopic = () => {
    navigate(`/topics/${topicId}/lessons`);
  };

  const handleEnroll = () => {
    navigate('/course#enroll');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {mockTopic.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                  Nivel Fácil
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ⏱️ {mockTopic.duration}
                </span>
              </div>
            </div>
            <Button
              label="Comenzar Tópico"
              onClick={handleStartTopic}
              variantColor="primary"
              className="px-6 py-3"
            />
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {mockTopic.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Objetivos de Aprendizaje
              </h2>
              <ul className="space-y-3">
                {mockTopic.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {mockTopic.prerequisites && mockTopic.prerequisites.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Prerrequisitos
                </h2>
                <ul className="space-y-2">
                  {mockTopic.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {prereq}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tu Instructor
              </h3>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {mockTopic.instructor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {mockTopic.instructor.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {mockTopic.instructor.bio}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {mockTopic.instructor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ¿Listo para empezar?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Inscríbete al curso completo para acceder a todos los tópicos y
                ejercicios prácticos.
              </p>
              <Button
                label="Inscríbete Ahora"
                onClick={handleEnroll}
                variantColor="tertiary"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
