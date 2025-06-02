import api from '../lib/api';

export const pageService = {
  getPagesByWorkspace: async (workspaceId, parentId = null) => {
    const params = parentId ? { parentId } : {};
    const response = await api.get(`/workspaces/${workspaceId}/pages`, { params });
    return response.data;
  },

  getPageById: async (pageId) => {
    const response = await api.get(`/pages/${pageId}`);
    return response.data;
  },

  createPage: async (workspaceId, pageData) => {
    console.log(pageData,"pageData")
    const response = await api.post(`/workspaces/${workspaceId}/pages`, {
      title: pageData.title,
      icon: pageData.icon,
      content: pageData.content,
      workspaceId: workspaceId
    });
    return response.data;
  },

  updatePage: async (pageId, pageData) => {
    const response = await api.put(`/pages/${pageId}`, pageData);
    return response.data;
  },

  movePage: async (pageId, moveData) => {
    const response = await api.post(`/pages/${pageId}/move`, moveData);
    return response.data;
  },

  toggleFavorite: async (pageId) => {
    const response = await api.post(`/pages/${pageId}/favorite`);
    return response.data;
  },

  deletePage: async (pageId) => {
    const response = await api.delete(`/pages/${pageId}`);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  }
};
