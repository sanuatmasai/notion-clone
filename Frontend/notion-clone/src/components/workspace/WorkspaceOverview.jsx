import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiLoader, FiAlertTriangle, FiX, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { format, formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const WorkspaceOverview = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { getWorkspaceById, updateWorkspace, deleteWorkspace } = useWorkspace();
  const [workspace, setWorkspace] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Fetch workspace details when component mounts or workspaceId changes
  useEffect(() => {
    console.log('WorkspaceOverview mounted or workspaceId changed:', workspaceId);
    
    const fetchWorkspace = async () => {
      if (!workspaceId) {
        console.log('No workspaceId provided');
        return;
      }
      
      console.log('Fetching workspace with ID:', workspaceId);
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Calling getWorkspaceById with ID:', workspaceId);
        const token = localStorage.getItem('token');
        console.log('Current token in localStorage:', token ? 'Token exists' : 'No token found');
        
        const data = await getWorkspaceById(workspaceId);
        console.log('Received workspace data:', data);
        
        if (!data) {
          throw new Error('No data received from server');
        }
        
        setWorkspace(data);
        setFormData({
          name: data.name,
          description: data.description || ''
        });
        console.log('Workspace data set successfully');
      } catch (err) {
        console.error('Failed to fetch workspace:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load workspace';
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        console.log('Finished loading workspace');
        setIsLoading(false);
      }
    };

    fetchWorkspace();
    
    // Cleanup function
    return () => {
      console.log('Cleaning up workspace fetch');
    };
  }, [workspaceId, getWorkspaceById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading workspace...</span>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error || 'Workspace not found. Please select a valid workspace.'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedWorkspace = await updateWorkspace(workspace.id, formData);
      setWorkspace(updatedWorkspace);
      setIsEditing(false);
      toast.success('Workspace updated successfully');
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast.error(error.response?.data?.message || 'Failed to update workspace');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!workspace) return;
    
    setIsDeleting(true);
    try {
      await deleteWorkspace(workspace.id);
      toast.success('Workspace deleted successfully');
      setShowDeleteModal(false);
      // Navigate to dashboard or another appropriate page after deletion
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      toast.error(error.response?.data?.message || 'Failed to delete workspace');
    } finally {
      setIsDeleting(false);
    }
  };

    // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'N/A';
    }
  };

  const handleCreatePage = () => {
    // This will be implemented later
    toast.success('Create new page clicked');
  };

  const handleViewPages = () => {
    // Navigate to the pages list for this workspace
    navigate(`/workspace/${workspaceId}/pages`);
  };

  // Static recent activities data
  const recentActivities = [
    {
      id: 1,
      type: 'page_created',
      title: 'Project Roadmap',
      user: 'Alex Johnson',
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      userAvatar: 'AJ'
    },
    {
      id: 2,
      type: 'page_updated',
      title: 'Meeting Notes',
      user: 'Sam Wilson',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      userAvatar: 'SW'
    },
    {
      id: 3,
      type: 'comment_added',
      title: 'Product Requirements',
      user: 'Taylor Swift',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      userAvatar: 'TS'
    },
    {
      id: 4,
      type: 'page_created',
      title: 'Team Updates',
      user: 'Jordan Lee',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      userAvatar: 'JL'
    },
    {
      id: 5,
      type: 'page_updated',
      title: 'Q2 Goals',
      user: 'Alex Johnson',
      timestamp: new Date(Date.now() - 345600000), // 4 days ago
      userAvatar: 'AJ'
    }
  ];

  // Helper function to format activity message
  const getActivityMessage = (activity) => {
    const timeAgo = formatDistanceToNow(activity.timestamp, { addSuffix: true });
    
    switch(activity.type) {
      case 'page_created':
        return `${activity.user} created a new page "${activity.title}" ${timeAgo}`;
      case 'page_updated':
        return `${activity.user} updated the page "${activity.title}" ${timeAgo}`;
      case 'comment_added':
        return `${activity.user} commented on "${activity.title}" ${timeAgo}`;
      default:
        return 'Activity occurred';
    }
  };

  // Helper function to get activity icon
  const getActivityIcon = (type) => {
    switch(type) {
      case 'page_created':
        return '📄';
      case 'page_updated':
        return '✏️';
      case 'comment_added':
        return '💬';
      default:
        return '🔔';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          {isEditing ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Workspace</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSave} className="space-y-6">
                    <div>
                      <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace Name
                      </label>
                      <input
                        type="text"
                        id="workspace-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="Enter workspace name"
                        required
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-gray-400">(Optional)</span>
                      </label>
                      <textarea
                        id="workspace-description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                        placeholder="Add a description for your workspace"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        What's this workspace for?
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
              {workspace.description && (
                <p className="mt-1 text-gray-600">{workspace.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                <p>Created: {formatDate(workspace.createdAt)}</p>
                {workspace.updatedAt && workspace.updatedAt !== workspace.createdAt && (
                  <p>Last updated: {formatDate(workspace.updatedAt)}</p>
                )}
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiEdit2 className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
        <div>
          <button
            onClick={handleViewPages}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEye className="-ml-1 mr-2 h-5 w-5" />
            View Pages
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3 text-sm">
                      {activity.userAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {getActivityMessage(activity)}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className="mr-2">{getActivityIcon(activity.type)}</span>
                        <span>{format(activity.timestamp, 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  No recent activity
                </div>
              </li>
            )}
          </ul>
          {recentActivities.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-right text-sm">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {/* View all activities */}}
              >
                View all activity
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Workspace"
        message="Are you sure you want to delete this workspace? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete Workspace'}
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default WorkspaceOverview;
