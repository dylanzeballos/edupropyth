import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 backdrop-blur-sm'
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};
