import React, { useState, useEffect, useCallback } from 'react';
import { usePage } from '../../contexts/PageContext';
import { useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import TailwindAdvancedEditor from '../novel/advanced-editor';
import { useDebouncedCallback } from 'use-debounce';

const PageEditor = () => {
  const { currentPage, updatePage, loadPage } = usePage();
  const { pageId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (pageId) {
      loadPage(pageId).then((page) => {
        setTitle(page.title || '');
        setContent(page.content || '');
        setPage({
          ...page,
          content: JSON.parse(page?.content ?? null) || {
            type: "doc",
            content: []
          },
        });
      });
    }
  }, [pageId, loadPage]);

  const handleTitleChange = (e) => {
    setPage(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleTitleBlur = async () => {
    try {
      await updatePage(pageId, {
        title: page.title,
        content: JSON.stringify(page.content ?? {
          type: "doc",
          content: []
        })
      });
      toast.success('Page title updated');
    } catch (error) {
      console.error('Failed to update page title:', error);
      toast.error('Failed to update page title');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  // Debounced save function with 5 second delay
  const debouncedSave = useDebouncedCallback(async (content) => {
    try {
      const json = content.getJSON();
      console.log(JSON.stringify(json), "jjjjjjjj")
      await updatePage(pageId, {
        title: page.title,
        content: JSON.stringify(json),
      });
      console.log('Auto-saved content');
    } catch (error) {
      console.error("Failed to auto-save page:", error);
      toast.error("Failed to auto-save page");
    }
  }, 5000);

  const handleSave = useCallback((content) => {
    // Update local state immediately
    setPage(prev => ({
      ...prev,
      content
    }));
    
    // Trigger debounced save
    debouncedSave(content);
  }, [debouncedSave]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <input
          type="text"
          value={page?.title || ''}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          className="w-full text-4xl font-bold bg-transparent outline-none border-none focus:ring-0 p-0 mb-2 text-foreground"
          placeholder="Untitled"
        />
        <div className="h-px bg-border w-full"></div>
      </div>
      <TailwindAdvancedEditor 
        // content={{
        //   type: "doc",
        //   content: [page?.content]
        // }} 
        content={page?.content ?? null}
        onUpdate={handleSave} 
      />
    </div>
    </div>
  );
};

export default PageEditor;
