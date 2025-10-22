import { useState } from 'react';
import { useNavigate } from 'react-router';
import SearchBar from '@/shared/components/navigation/Search';
import { TopicCard } from '../components/TopiCard';
import { Topic } from '../types/course.types';

const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Introducción a Python',
    description: 'Conceptos básicos, sintaxis y primeros programas en Python',
    duration: '2 semanas',
    difficulty: 'easy',
    learningObjectives: ['Sintaxis básica', 'Variables y tipos de datos'],
    instructor: {
      id: '1',
      name: 'Dr. María González',
      bio: 'Doctora en Ciencias de la Computación',
      expertise: ['Python', 'Algoritmos'],
    },
  },
  {
    id: '2',
    title: 'Estructuras de Control',
    description: 'Condicionales, bucles y manejo del flujo del programa',
    duration: '3 semanas',
    difficulty: 'medium',
    learningObjectives: ['Condicionales', 'Bucles', 'Control de flujo'],
    instructor: {
      id: '2',
      name: 'Ing. Carlos Rodríguez',
      bio: 'Ingeniero de Software con experiencia en Python',
      expertise: ['Python', 'Desarrollo Web'],
    },
  },
];

export const TopicsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleViewTopic = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  const filteredTopics = mockTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tópicos del Curso
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explora todos los temas disponibles en nuestro laboratorio de Python
          </p>

          <div className="max-w-md">
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              placeholder="Buscar tópicos, profesores..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onViewDetails={handleViewTopic}
            />
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron tópicos que coincidan con tu búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
