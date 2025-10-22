import { motion } from "framer-motion";
import {Clock, Trophy, Play } from 'lucide-react';

interface ExerciseCardProps {
  title: string;
  description: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  points?: number;
  duration: string;
  testCases: number;
  tags: string[];
  isStarted?: boolean;
  onStart: () => void;
}

const difficultyColors = {
  'Principiante': 'bg-green-100 text-green-800 border-green-200',
  'Intermedio': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Avanzado': 'bg-red-100 text-red-800 border-red-200'
}

const difficultyColorsDark = {
  'Principiante': 'bg-green-900/30 text-green-400 border-green-700/50',
  'Intermedio': 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
  'Avanzado': 'bg-red-900/30 text-red-400 border-red-700/50'
}

export const ExerciseCard = ({
  title,
  description,
  difficulty,
  category,
  points,
  duration,
  testCases,
  tags,
  isStarted=false,
  onStart
}: ExerciseCardProps) => {
  return(
    <motion.div
    whileHover={{y: -2, scale: 1.01}}
    transition={{type:"spring", stiffness:300, damping:30}}
    className="group relative bg-white/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md border ${difficultyColors[difficulty]} dark:${difficultyColorsDark[difficulty]}`}>
                    {difficulty}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50">
                    {category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isStarted ? 'No Iniciado' : 'No Iniciado'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {title}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{points}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
                <span>{testCases} caso{testCases !== 1 ? 's' : ''} de prueba</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-cyan-500/25"
              >
                <Play className="w-4 h-4" />
                Iniciar
              </motion.button>
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        );
      };

}
