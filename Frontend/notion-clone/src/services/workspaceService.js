import api from '../lib/api';

export const workspaceService = {
  // Get all workspaces for current user
  getWorkspaces: async () => {
    try {
      console.log('Fetching workspaces...');
      const response = await api.get('/workspaces');
      console.log('Workspaces response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      console.log('Creating workspace with data:', workspaceData);
      const response = await api.post('/workspaces', workspaceData);
      console.log('Create workspace response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Get a single workspace by ID
  getWorkspaceById: async (workspaceId) => {
    try {
      console.log(`Fetching workspace with ID: ${workspaceId}`);
      const response = await api.get(`/workspaces/${workspaceId}`);
      console.log('Workspace response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching workspace:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Update a workspace
  updateWorkspace: async (workspaceId, workspaceData) => {
    try {
      const response = await api.put(`/workspaces/${workspaceId}`, workspaceData);
      return response.data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },

  // Delete a workspace
  deleteWorkspace: async (workspaceId) => {
    try {
      await api.delete(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  }
};
