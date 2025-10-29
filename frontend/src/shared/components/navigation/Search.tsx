import IconClose from '../icons/close';
import IconSearch from '../icons/search';
type SearchBarProps = {
  query: string;
  onQueryChange: (newQuery: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  query,
  onQueryChange,
  placeholder = 'Buscar ejercicios, tópicos...',
}: SearchBarProps) {
  const clearInput = () => onQueryChange('');

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <IconSearch className="text-gray-800 dark:text-gray-100 w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
