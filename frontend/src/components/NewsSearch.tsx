import { useState, useEffect } from 'react';
import { NewsFilters } from '../services/api';
import { useNewsFilters } from '../hooks/useSWR';
import Dropdown from './common/Dropdown';

interface NewsSearchProps {
  filters: NewsFilters;
  onFiltersChange: (filters: NewsFilters) => void;
}

const NewsSearch = ({ filters, onFiltersChange }: NewsSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedTag, setSelectedTag] = useState(filters.tag || '');
  const [selectedAuthor, setSelectedAuthor] = useState(filters.author || '');
  
  const { filters: availableFilters, isLoading: filtersLoading } = useNewsFilters();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFiltersChange({ ...filters, search: searchTerm || undefined, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    onFiltersChange({ ...filters, tag: tag || undefined, page: 1 });
  };

  const handleAuthorChange = (author: string) => {
    setSelectedAuthor(author);
    onFiltersChange({ ...filters, author: author || undefined, page: 1 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedAuthor('');
    onFiltersChange({});
  };

  const hasActiveFilters = searchTerm || selectedTag || selectedAuthor;

  return (
    <div className="card mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tag Filter */}
          <div className="flex-1">
            <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Tag
            </label>
            <Dropdown
              value={selectedTag}
              onChange={(value) => handleTagChange(value as string)}
              options={availableFilters.tags}
              placeholder="All Tags"
              disabled={filtersLoading}
            />
          </div>

          {/* Author Filter */}
          <div className="flex-1">
            <label htmlFor="author-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Author
            </label>
            <Dropdown
              value={selectedAuthor}
              onChange={(value) => handleAuthorChange(value as string)}
              options={availableFilters.authors}
              placeholder="All Authors"
              disabled={filtersLoading}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Active filters: {searchTerm && 'Search'}{searchTerm && (selectedTag || selectedAuthor) && ', '}{selectedTag && `Tag: ${selectedTag}`}{selectedTag && selectedAuthor && ', '}{selectedAuthor && `Author: ${selectedAuthor}`}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSearch;