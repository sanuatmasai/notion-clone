import React, { useState } from 'react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const CreateWorkspaceModal = ({ onClose, workspace: editingWorkspace }) => {
  console.log('Modal props:', { editingWorkspace });
  const { createWorkspace, updateWorkspace } = useWorkspace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!editingWorkspace?.id;
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: editingWorkspace?.name || '',
      description: editingWorkspace?.description || ''
    }
  });
  
  // Update form values when editingWorkspace changes
  React.useEffect(() => {
    console.log('Editing workspace changed:', editingWorkspace);
    if (editingWorkspace) {
      console.log('Setting form values:', {
        name: editingWorkspace.name || '',
        description: editingWorkspace.description || ''
      });
      setValue('name', editingWorkspace.name || '');
      setValue('description', editingWorkspace.description || '');
    } else {
      console.log('Resetting form values');
      setValue('name', '');
      setValue('description', '');
    }
  }, [editingWorkspace, setValue]);

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('Submitting form, isEditing:', isEditing);
      
      if (isEditing) {
        console.log('Updating workspace:', editingWorkspace.id, 'with data:', data);
        const result = await updateWorkspace(editingWorkspace.id, data);
        console.log('Update result:', result);
        toast.success('Workspace updated successfully!');
      } else {
        console.log('Creating new workspace with data:', data);
        const result = await createWorkspace(data);
        console.log('Create result:', result);
        toast.success('Workspace created successfully!');
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} workspace:`, error);
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} workspace`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Workspace' : 'Create New Workspace'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isSubmitting}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { 
                required: 'Workspace name is required',
                maxLength: {
                  value: 100,
                  message: 'Name cannot exceed 100 characters'
                }
              })}
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter workspace name"
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters'
                }
              })}
              rows={4}
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Add a description for your workspace"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-sm text-gray-500">
              What's this workspace for?
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
            >
              {isSubmitting 
                ? isEditing ? 'Saving...' : 'Creating...' 
                : isEditing ? 'Save Changes' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
