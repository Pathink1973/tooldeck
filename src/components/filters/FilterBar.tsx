import React, { useState, useEffect } from 'react';
import { Search, Tag, Heart, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCardStore } from '../../store/cardStore';
import { useThemeStore } from '../../store/themeStore';

export const FilterBar: React.FC = () => {
  const { cards, filterTags, setFilterTags, setSearchQuery, showFavoritesOnly, toggleFavoritesFilter } = useCardStore();
  const { darkMode } = useThemeStore();
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const allTags = cards.flatMap(card => card.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    setAvailableTags(uniqueTags);
  }, [cards]);

  const handleTagToggle = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setFilterTags([]);
    setSearchInput('');
    setSearchQuery('');
  };

  const hasActiveFilters = filterTags.length > 0 || searchInput || showFavoritesOnly;
  const displayedTags = showAllTags ? availableTags : availableTags.slice(0, 10);

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-grow">
            <Input
              placeholder="Buscar recursos..."
              value={searchInput}
              onChange={handleSearchChange}
              leftIcon={<Search className="h-4 w-4" />}
              className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleFavoritesFilter}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                showFavoritesOnly
                  ? 'bg-red-500 border-red-500 text-white shadow-sm shadow-red-500/20'
                  : darkMode
                    ? 'border-gray-600 text-gray-400 hover:border-red-500/50 hover:text-red-400'
                    : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favoritos</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  darkMode
                    ? 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                    : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {availableTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Tag className={`h-3.5 w-3.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                    filterTags.includes(tag)
                      ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-sm'
                      : darkMode
                        ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {availableTags.length > 10 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showAllTags ? 'Menos' : `+${availableTags.length - 10}`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
