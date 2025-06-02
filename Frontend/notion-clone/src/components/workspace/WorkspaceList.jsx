import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { FiPlus, FiChevronDown, FiChevronRight, FiGrid, FiTrash2, FiEdit2 } from 'react-icons/fi';

const WorkspaceList = ({ onOpenModal }) => {
  const { workspaces, currentWorkspace, setCurrentWorkspace, deleteWorkspace } = useWorkspace();
  const [expandedWorkspace, setExpandedWorkspace] = useState(null);
  const location = useLocation();

  const toggleWorkspace = (e, workspaceId) => {
    // Don't toggle if clicking on action buttons
    if (e.target.closest('button, a')) {
      return;
    }
    setExpandedWorkspace(expandedWorkspace === workspaceId ? null : workspaceId);
  };

  const handleDeleteWorkspace = async (e, workspaceId) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      try {
        await deleteWorkspace(workspaceId);
      } catch (error) {
        console.error('Failed to delete workspace:', error);
      }
    }
  };

  const handleEditWorkspace = (e, workspace) => {
    e.stopPropagation();
    console.log('Edit workspace clicked:', workspace);
    
    // Create a copy of the workspace object to avoid potential reference issues
    const workspaceCopy = { ...workspace };
    console.log('Setting editing workspace to:', workspaceCopy);
    
    setEditingWorkspace(workspaceCopy);
    setIsModalOpen(true);
  };

  // Ensure workspaces is always an array
  const safeWorkspaces = Array.isArray(workspaces) ? workspaces : [];

  if (safeWorkspaces.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">No workspaces yet</p>
        <button
          onClick={() => onOpenModal()}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md group"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          New Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="px-4 py-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspaces</h3>
        <button
          onClick={() => onOpenModal()}
          className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-md"
          title="Create new workspace"
        >
          <FiPlus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-1">
        {safeWorkspaces.map((workspace) => (
          <div key={workspace.id} className="group">
            <div
              className={`flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer ${
                currentWorkspace?.id === workspace.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={(e) => toggleWorkspace(e, workspace.id)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 ml-1 mr-2 text-gray-400">
                  {expandedWorkspace === workspace.id ? (
                    <FiChevronDown className="h-4 w-4" />
                  ) : (
                    <FiChevronRight className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-shrink-0 mr-2">
                  <div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                    <FiGrid className="h-3 w-3" />
                  </div>
                </div>
                <span className="truncate">{workspace.name}</span>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(workspace);
                  }}
                  className="text-gray-400 hover:text-blue-600 p-1 rounded"
                  title="Edit workspace"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => handleDeleteWorkspace(e, workspace.id)}
                  className="text-gray-400 hover:text-red-600 p-1 rounded"
                  title="Delete workspace"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {expandedWorkspace === workspace.id && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to={`/workspace/${workspace.id}`}
                  className={`block px-3 py-1.5 text-sm rounded-md ${
                    location.pathname === `/workspace/${workspace.id}`
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to={`/workspace/${workspace.id}/pages`}
                  className={`block px-3 py-1.5 text-sm rounded-md ${
                    location.pathname.startsWith(`/workspace/${workspace.id}/pages`)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Pages
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      

    </div>
  );
};

export default WorkspaceList;
