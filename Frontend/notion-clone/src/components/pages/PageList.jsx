import React, { useState, useCallback } from 'react';
import { FiFile, FiChevronRight, FiChevronDown, FiPlus, FiStar, FiTrash2, FiEdit2, FiRefreshCw } from 'react-icons/fi';
import { pageService } from '../../services/pageService';
import EditPageModal from '../modals/EditPageModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { usePage } from '../../contexts/PageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageCreationModal from './PageCreationModal';

const PageItem = ({ page, onToggle, open, onEdit, onDelete, onFavorite, onSuggestNames }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  return (
    <div className="flex items-center py-2 pl-4">
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {open ? <FiChevronDown /> : <FiChevronRight />}
        <span className="ml-2 flex items-center">
          {page.icon ? (
            <span className="mr-2" role="img" aria-label="page-icon">
              {page.icon}
            </span>
          ) : (
            <FiFile className="mr-2" />
          )}
          <span 
          className="truncate hover:underline cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/workspace/${workspaceId}/pages/${page.id}`);
          }}
        >
          {page.title}
        </span>
        </span>
      </button>
      <div className="ml-auto flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(page);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiEdit2 />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(page.id);
          }}
          className={`${page.favorite ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-700'}`}
          title={page.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiStar fill={page.favorite ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSuggestNames(page);
          }}
          className="text-blue-500 hover:text-blue-700"
          title="Suggest page names"
        >
          <FiRefreshCw size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(page.id, page.parentId);
          }}
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

const SuggestionModal = ({ isOpen, onClose, suggestions, onSelect, isLoading }) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!isOpen && 'hidden'}`}>
    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">
      <h3 className="text-lg font-medium mb-4">Suggested Page Names</h3>
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <FiRefreshCw className="animate-spin text-blue-500" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              className="w-full text-left p-2 bg-gray-100 rounded-md transition-colors cursor-pointer"
            >
              {suggestion}
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-center py-2">No suggestions available</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const PageList = () => {
  const { pages, loadPages, createPage, updatePage, deletePage, toggleFavorite } = usePage();
  const [expandedPages, setExpandedPages] = useState(new Set());
  const [editingPage, setEditingPage] = useState(null);
  const [deletingPage, setDeletingPage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  const handleToggle = (pageId) => {
    setExpandedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleEditClick = (page) => {
    setEditingPage(page);
  };

  const handleEdit = async (newTitle) => {
    if (!editingPage) return;
    
    try {
      await updatePage(editingPage.id, { title: newTitle });
      toast.success('Page updated successfully');
      setEditingPage(null);
    } catch (err) {
      console.error('Error updating page:', err);
      toast.error('Failed to update page');
    }
  };

  const handleDeleteClick = (pageId, parentId) => {
    setDeletingPage({ id: pageId, parentId });
  };

  const handleDelete = async () => {
    if (!deletingPage) return;
    
    try {
      await deletePage(deletingPage.id, deletingPage.parentId);
      toast.success('Page moved to trash');
      setDeletingPage(null);
    } catch (err) {
      console.error('Error deleting page:', err);
      toast.error('Failed to delete page');
      setDeletingPage(null);
    }
  };

  const handleSuggestNames = async (page) => {
    setCurrentPage(page);
    setIsSuggestionModalOpen(true);
    setIsSuggesting(true);
    
    try {
      const data = await pageService.getPageNameSuggestions(page.id);
      setSuggestions(data.suggested_names || []);
    } catch (error) {
      console.error('Error getting name suggestions:', error);
      // toast.error('Failed to get name suggestions');
      setSuggestions([]);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    if (!currentPage) return;
    
    try {
      await updatePage(currentPage.id, { title: suggestion });
      toast.success('Page name updated');
      setIsSuggestionModalOpen(false);
    } catch (error) {
      console.error('Error updating page name:', error);
      toast.error('Failed to update page name');
    }
  };

  const renderPage = (page, level = 0) => {
    const isExpanded = expandedPages.has(page.id);

    return (
      <div key={page.id} className="mb-1">
        <PageItem
          page={page}
          onToggle={() => handleToggle(page.id)}
          open={isExpanded}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onFavorite={toggleFavorite}
          onSuggestNames={handleSuggestNames}
        />
        {isExpanded && (
          <div className="ml-4 border-l-2 border-gray-100 pl-2">
            {page.children?.map((child) => renderPage(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleCreatePage = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-3 p-2">
      <SuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        suggestions={suggestions}
        onSelect={handleSelectSuggestion}
        isLoading={isSuggesting}
      />
      <EditPageModal
        isOpen={!!editingPage}
        onClose={() => setEditingPage(null)}
        initialTitle={editingPage?.title || ''}
        onSave={handleEdit}
      />
      <DeleteConfirmationModal
        isOpen={!!deletingPage}
        onClose={() => setDeletingPage(null)}
        onConfirm={handleDelete}
        title="Delete page?"
        message="This will move the page to trash. You can restore it later from the trash."
        confirmText="Delete page"
        cancelText="Cancel"
      />
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Pages</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCreatePage}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-1.5" />
            New Page
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
        <div className="divide-y divide-gray-100">
          <PageCreationModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
          {pages.map((page) => renderPage(page))}
        </div>
      </div>
    </div>
  );
};

export default PageList;
