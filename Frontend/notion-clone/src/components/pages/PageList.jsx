import React, { useState, useCallback } from 'react';
import { FiFile, FiChevronRight, FiChevronDown, FiPlus, FiStar, FiTrash2, FiEdit2 } from 'react-icons/fi';
import EditPageModal from '../modals/EditPageModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { usePage } from '../../contexts/PageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageCreationModal from './PageCreationModal';

const PageItem = ({ page, onToggle, open, onEdit, onDelete, onFavorite }) => {
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

const PageList = () => {
  const { pages, loadPages, createPage, updatePage, deletePage, toggleFavorite } = usePage();
  const [expandedPages, setExpandedPages] = useState(new Set());
  const [editingPage, setEditingPage] = useState(null);
  const [deletingPage, setDeletingPage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const renderPage = (page, level = 0) => {
    const isExpanded = expandedPages.has(page.id);

    return (
      <div key={page.id}>
        <PageItem
          page={page}
          onToggle={() => handleToggle(page.id)}
          open={isExpanded}
onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onFavorite={toggleFavorite}
        />
        {isExpanded &&
          page.children?.map((child) => renderPage(child, level + 1))}
      </div>
    );
  };

  const handleCreatePage = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-2">
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pages</h2>
        <button
          onClick={handleCreatePage}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          New Page
        </button>
      </div>
      
      <PageCreationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {pages.map((page) => renderPage(page))}
    </div>
  );
};

export default PageList;
