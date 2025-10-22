import { motion } from 'framer-motion';

interface DifficultyFilterProps {
  difficulties: ('Principiante' | 'Intermedio' | 'Avanzado')[];
  activeDifficulties: string[];
  onDifficultyToggle: (difficulty: string) => void;
}

const difficultyColors = {
  Principiante:
    'border-green-500 text-green-700 bg-green-50 dark:border-green-400 dark:text-green-300 dark:bg-green-900/20',
  Intermedio:
    'border-yellow-500 text-yellow-700 bg-yellow-50 dark:border-yellow-400 dark:text-yellow-300 dark:bg-yellow-900/20',
  Avanzado:
    'border-red-500 text-red-700 bg-red-50 dark:border-red-400 dark:text-red-300 dark:bg-red-900/20',
};

export const DifficultyFilter = ({
  difficulties,
  activeDifficulties,
  onDifficultyToggle,
}: DifficultyFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Dificultad
      </h3>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <motion.button
            key={difficulty}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDifficultyToggle(difficulty)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
              activeDifficulties.includes(difficulty)
                ? difficultyColors[difficulty] + ' shadow-md'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 backdrop-blur-sm'
            }`}
          >
            {difficulty}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
