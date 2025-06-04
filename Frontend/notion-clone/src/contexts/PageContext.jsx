import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pageService } from '../services/pageService';
import { toast } from 'react-hot-toast';

const PageContext = createContext();

export function PageProvider({ children }) {
  const { workspaceId } = useParams();
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPages = useCallback(async (parentId = null) => {
    if (!workspaceId) return;
    
    try {
      setIsLoading(true);
      const data = await pageService.getPagesByWorkspace(workspaceId, parentId);
      setPages(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  const loadPage = useCallback(async (pageId) => {
    try {
      setIsLoading(true);
      const data = await pageService.getPageById(pageId);
      setCurrentPage(data);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPage = async (pageData) => {
    try {
      const newPage = await pageService.createPage(workspaceId, {
        title: pageData.title || 'Untitled',
        content: pageData.content || '',
        ...pageData
      });
      await loadPages(pageData.parentId);
      return newPage;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const chatPage = async (req) => {
    try {
      const newPage = await pageService.chatPage(req);
     
      return newPage;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const updatePage = async (pageId, updates) => {
    try {
      const updatedPage = await pageService.updatePage(pageId, updates);
      setCurrentPage(prev => ({ ...prev, ...updatedPage }));
      await loadPages(updates.parentId);
      return updatedPage;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const chatUploadPage = async (sourcePageId) => {
    try {
      const newPage = await pageService.chatUploadPage(sourcePageId);
     
      return newPage;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const movePage = async (pageId, moveData) => {
    try {
      const updatedPage = await pageService.movePage(pageId, moveData);
      await loadPages(moveData.newParentId);
      return updatedPage;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const toggleFavorite = async (pageId) => {
    try {
      // Toggle favorite and get the updated page
      const updatedPage = await pageService.toggleFavorite(pageId);
      
      // Update the pages list with the new favorite status
      setPages(prevPages => 
        prevPages.map(page => 
          page.id === pageId 
            ? { ...page, favorite: updatedPage.favorite }
            : page
        )
      );
      
      return updatedPage.favorite;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const deletePage = async (pageId, parentId) => {
    try {
      await pageService.deletePage(pageId);
      await loadPages(parentId);
      toast.success('Page moved to trash');
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const loadFavorites = useCallback(async () => {
    try {
      const data = await pageService.getFavorites();
      setFavorites(data);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  useEffect(() => {
    if (workspaceId) {
      loadPages();
      loadFavorites();
    }
  }, [workspaceId, loadPages, loadFavorites]);

  return (
    <PageContext.Provider
      value={{
        pages,
        currentPage,
        favorites,
        isLoading,
        error,
        loadPages,
        loadPage,
        createPage,
        updatePage,
        movePage,
        toggleFavorite,
        deletePage,
        chatUploadPage,
        chatPage
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};
