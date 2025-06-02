import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceService } from '../services/workspaceService';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Get a single workspace by ID
  const getWorkspaceById = async (workspaceId) => {
    try {
      // First check if we have the workspace in our local state
      const existingWorkspace = workspaces.find(ws => ws.id === workspaceId);
      if (existingWorkspace) {
        return existingWorkspace;
      }
      
      // If not found locally, fetch from the server
      const workspace = await workspaceService.getWorkspaceById(workspaceId);
      
      // Update local state with the fetched workspace
      setWorkspaces(prev => {
        const exists = prev.some(ws => ws.id === workspaceId);
        return exists ? prev : [...prev, workspace];
      });
      
      return workspace;
    } catch (error) {
      console.error(`Failed to fetch workspace ${workspaceId}:`, error);
      throw error;
    }
  };

  const fetchWorkspaces = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await workspaceService.getWorkspaces();
      // Ensure we always set an array, even if the response is not as expected
      const workspacesData = Array.isArray(response) ? response : [];
      setWorkspaces(workspacesData);
      
      // Set the first workspace as current if none is selected
      if (workspacesData.length > 0 && !currentWorkspace) {
        setCurrentWorkspace(workspacesData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      // Ensure workspaces is always an array even on error
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (workspaceData) => {
    try {
      const newWorkspace = await workspaceService.createWorkspace({
        ...workspaceData,
        personal: true // Force personal workspaces only for now
      });
      
      setWorkspaces(prev => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      return newWorkspace;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  };

  const updateWorkspace = async (workspaceId, updates) => {
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(workspaceId, updates);
      
      setWorkspaces(prev => 
        prev.map(ws => ws.id === workspaceId ? updatedWorkspace : ws)
      );
      
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(updatedWorkspace);
      }
      
      return updatedWorkspace;
    } catch (error) {
      console.error('Failed to update workspace:', error);
      throw error;
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    try {
      await workspaceService.deleteWorkspace(workspaceId);
      
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      
      // If current workspace is deleted, select another one
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(workspaces[0]?.id === workspaceId ? workspaces[1] : workspaces[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      throw error;
    }
  };

  // Fetch workspaces when user logs in/out
  useEffect(() => {
    if (currentUser) {
      fetchWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
    }
  }, [currentUser]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        setCurrentWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        getWorkspaceById,
        refreshWorkspaces: fetchWorkspaces
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
