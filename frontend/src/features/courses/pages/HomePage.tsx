import { useState } from 'react';
import { useNavigate } from 'react-router';
import SearchBar from '@/shared/components/navigation/Search';
import { CourseHeader } from '../components/CourseHeader';
import { TopicCard } from '../components/TopiCard';
import { Course } from '../types/course.types';

// Mock data - esto vendría de tu API
const mockCourse: Course = {
  id: '1',
  title: 'Laboratorio de Programación en Python',
  description:
    'Aprende programación desde cero con Python mediante ejercicios prácticos y proyectos reales',
  level: 'beginner',
  duration: '12 semanas',
  studentsEnrolled: 1247,
  rating: 4.8,
  topics: [
    {
      id: '1',
      title: 'Introducción a Python',
      description: 'Conceptos básicos, sintaxis y primeros programas',
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
  ],
  instructors: [],
};

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate('/enroll');
  };

  const handleViewTopic = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  const filteredTopics = mockCourse.topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CourseHeader course={mockCourse} onEnroll={handleEnroll} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Explora los Tópicos
          </h2>
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            placeholder="Buscar tópicos del curso..."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onViewDetails={handleViewTopic}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
