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
  placeholder = 'Que curso quieres aprender hoy?',
}: SearchBarProps) {
  const clearInput = () => onQueryChange('');

  return (
    <div className="relative w-96">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-10 py-2 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        buttoned
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
        <IconSearch className="text-white hover:text-blue-600" />
      </div>
      {query && (
        <button
          onClick={clearInput}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-blue-600"
        >
          <IconClose className="w-6" />
        </button>
      )}
    </div>
  );
}
