import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFileText, FiGrid, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const Pages = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real app, this would come from an API
  const mockPages = [
    { id: '1', title: 'Getting Started', updatedAt: '2023-05-15', icon: '📝' },
    { id: '2', title: 'Project Plan', updatedAt: '2023-05-14', icon: '📊' },
    { id: '3', title: 'Meeting Notes', updatedAt: '2023-05-10', icon: '📋' },
    { id: '4', title: 'Ideas', updatedAt: '2023-05-05', icon: '💡' },
  ];

  // Simulate API call with React Query
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      // In a real app, you would fetch this from your API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockPages;
    },
  });

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredPages.length} {filteredPages.length === 1 ? 'page' : 'pages'} found
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/pages/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Page
            </Link>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="relative rounded-md shadow-sm max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md h-10"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

        {/* Pages Grid/List */}
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Get started by creating a new page'}
            </p>
            <div className="mt-6">
              <Link
                to="/pages/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Page
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPages.map((page) => (
              <Link
                key={page.id}
                to={`/pages/${page.id}`}
                className="group relative bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{page.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{page.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Updated {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span className="truncate">Last edited by You</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <li key={page.id}>
                  <Link to={`/pages/${page.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{page.icon}</span>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {page.title}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Page
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Last updated {new Date(page.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>You</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;
