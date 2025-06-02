import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { usePage } from '../../contexts/PageContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { toast } from 'react-hot-toast';



const PageCreationModal = ({ open, onClose }) => {
  const { createPage } = usePage();
  const { currentWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    content: ''
  });
  
  // Update form data when inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Create a clean data object directly from state
      console.log(formData,"formDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      const pageData = {
        title: formData.title || 'Untitled',
        icon: formData.icon || '',
        content: JSON.stringify({
          type: "doc",
          content: []
        }),
        workspaceId: currentWorkspace.id
      };
      
      console.log('Submitting page data:', pageData); // Debug log
      
      await createPage(pageData);
      setFormData({ title: '', icon: '', content: '' });
      onClose();
      toast.success('Page created successfully');
    } catch (error) {
      toast.error('Failed to create page');
      console.error('Create page error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${open ? 'block' : 'hidden'} transition-opacity duration-300`}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl transform transition-all duration-300">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Create New Page</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 space-y-4"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select an icon</option>
                  <option value="📝">📝 Note</option>
                  <option value="📊">📊 Chart</option>
                  <option value="📅">📅 Calendar</option>
                  <option value="📋">📋 Checklist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter page content"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageCreationModal;
