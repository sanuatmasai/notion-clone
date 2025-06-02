import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiMoreVertical, FiTrash2, FiShare2, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { $getRoot, $getSelection } from 'lexical';

// Custom Plugins
import ToolbarPlugin from '../components/editor/ToolbarPlugin';
import AutoLinkPlugin from '../components/editor/AutoLinkPlugin';
import CodeHighlightPlugin from '../components/editor/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from '../components/editor/ListMaxIndentLevelPlugin';

// Theme
const editorConfig = {
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
    },
  },
  namespace: 'PageEditor',
  // Handling of errors during update
  onError(error) {
    console.error(error);
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    LinkNode,
  ],
};

// Mock API functions
const fetchPage = async (pageId) => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const mockPages = {
    '1': {
      id: '1',
      title: 'Getting Started',
      content: JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Welcome to your new page!',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: 'left',
              indent: 0,
              type: 'heading1',
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Start writing here...',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: 'left',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }),
      updatedAt: new Date().toISOString(),
      createdAt: '2023-05-15T10:00:00Z',
    },
  };

  return mockPages[pageId] || null;
};

const updatePage = async ({ id, title, content }) => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

const PageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editorState, setEditorState] = useState(null);

  // Fetch page data
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', id],
    queryFn: () => fetchPage(id),
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        // In a real app, we would set the initial editor state here
      }
    },
  });

  // Update page mutation
  const updatePageMutation = useMutation({
    mutationFn: updatePage,
    onSuccess: () => {
      queryClient.invalidateQueries(['page', id]);
      toast.success('Page saved successfully');
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
      setIsSaving(false);
    },
  });

  // Handle save
  const handleSave = useCallback(() => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    
    updatePageMutation.mutate({
      id,
      title,
      content: editorState ? JSON.stringify(editorState) : '',
    });
  }, [id, title, editorState, updatePageMutation]);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!title || !editorState) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, editorState, handleSave]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">Error loading page: {error.message}</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-6 text-center">
        <div>Page not found</div>
        <button
          onClick={() => navigate('/pages')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Pages
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                className="block w-full border-0 py-2 text-xl font-semibold text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none"
                placeholder="Untitled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center text-xs text-gray-500">
              <FiClock className="mr-1 h-4 w-4" />
              <span>Last saved {new Date(page.updatedAt).toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>
              
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                    >
                      <FiShare2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Share
                    </button>
                    <button
                      className="group flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                    >
                      <FiTrash2 className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LexicalComposer initialConfig={editorConfig}>
            <div className="relative">
              <ToolbarPlugin />
              <div className="relative
                border border-gray-300 rounded-b-lg
                focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
                overflow-hidden
              ">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable 
                      className="min-h-[300px] p-4 focus:outline-none"
                    />
                  }
                  placeholder={
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                      Start writing...
                    </div>
                  }
                />
                <AutoFocusPlugin />
                <HistoryPlugin />
                <LinkPlugin />
                <ListPlugin />
                <AutoLinkPlugin />
                <CodeHighlightPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
              </div>
            </div>
          </LexicalComposer>
        </div>
      </div>
    </div>
  );
};

export default PageDetail;
