import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiGrid, FiList, FiStar, FiClock, FiFileText } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';

// Mock data for templates
const mockTemplates = [
  {
    id: '1',
    name: 'Meeting Notes',
    description: 'Template for taking structured meeting notes with action items.',
    category: 'Productivity',
    isFavorite: true,
    lastUsed: '2023-05-10',
    icon: '📝',
  },
  {
    id: '2',
    name: 'Project Plan',
    description: 'Template for planning projects with tasks, timelines, and resources.',
    category: 'Project Management',
    isFavorite: true,
    lastUsed: '2023-05-15',
    icon: '📊',
  },
  {
    id: '3',
    name: 'Personal Journal',
    description: 'Daily journal template with prompts for reflection and gratitude.',
    category: 'Personal',
    isFavorite: false,
    lastUsed: '2023-05-12',
    icon: '📔',
  },
  {
    id: '4',
    name: 'Product Requirements',
    description: 'Template for documenting product requirements and specifications.',
    category: 'Product',
    isFavorite: false,
    lastUsed: '2023-04-28',
    icon: '📋',
  },
  {
    id: '5',
    name: 'Sprint Retrospective',
    description: 'Template for agile sprint retrospectives with team feedback sections.',
    category: 'Engineering',
    isFavorite: true,
    lastUsed: '2023-05-01',
    icon: '🔄',
  },
];

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories for filter
  const categories = ['All', ...new Set(mockTemplates.map(t => t.category))];

  // Simulate API call with React Query
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTemplates;
    },
  });

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle favorite status
  const toggleFavorite = (id) => {
    // In a real app, this would be an API call
    console.log(`Toggled favorite for template ${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/templates/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Template
            </Link>
          </div>
        </div>

        {/* Search, Filter, and View Toggle */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative rounded-md shadow-sm max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex rounded-md shadow-sm">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Grid view"
              >
                <FiGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <FiList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Get started by creating a new template'}
            </p>
            <div className="mt-6">
              <Link
                to="/templates/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Template
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-3">{template.icon}</div>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                      aria-label={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FiStar
                        className={`h-5 w-5 ${template.isFavorite ? 'text-yellow-400 fill-current' : ''}`}
                      />
                    </button>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{template.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {template.category}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <FiClock className="mr-1 h-3 w-3" />
                      <span>Used {new Date(template.lastUsed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t border-gray-200">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <li key={template.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-2xl mr-4">{template.icon}</div>
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600">{template.name}</p>
                            <button
                              onClick={() => toggleFavorite(template.id)}
                              className="ml-2 text-gray-300 hover:text-yellow-400 focus:outline-none"
                              aria-label={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <FiStar
                                className={`h-4 w-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : ''}`}
                              />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Use Template
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {template.category}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                        <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Last used {new Date(template.lastUsed).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
