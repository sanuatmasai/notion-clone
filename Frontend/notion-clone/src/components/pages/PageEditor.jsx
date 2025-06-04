import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePage } from '../../contexts/PageContext';
import { useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiMessageSquare, FiSend, FiX, FiLoader, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import TailwindAdvancedEditor from '../novel/advanced-editor';
import { useDebouncedCallback } from 'use-debounce';
import CrazySpinner from '../novel/ui/icons/crazy-spinner';
import { marked } from 'marked';
import Modal from '../common/Modal';
import api from '@/lib/api';

const PageEditor = () => {
  const { currentPage, updatePage, loadPage,chatUploadPage,chatPage } = usePage();
  const { pageId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1,isUser:false, text: 'Hello! I\'m your AI writing assistant. How can I help you with your document today?', sender: 'ai' }
  ]);
  const [loading,setLoading]=useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummaryType, setSelectedSummaryType] = useState('');
  const [summaryContent, setSummaryContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const messagesEndRef = useRef(null);
  console.log(summaryContent,"summaryContent")

  const summaryTitle={
    1:"Quick Glance",2:"Detail Insights",3:"Key Insights"
  }

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

  const handleSummarize=async(type )=>{

    setIsSummarizing(true);
    setSelectedSummaryType(type);
    try {
      const response = await api.post('/chat/content-summary', {
        sourceId:pageId,
        summaryType:type
      });
      setSummaryContent(response.data);
    } catch (error) {
      console.error('Failed to summarize document:', error);
      toast.error('Failed to summarize document');
    } finally {
      setIsSummarizing(false);
    }
    
  }

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

      const actualContent = content.getText() || ""
      
      await updatePage(pageId, {
        title: page.title,
        actualContent: actualContent, 
        content: JSON.stringify(json),
      });
      console.log('Auto-saved content');
    } catch (error) {
      console.error("Failed to auto-save page:", error);
      toast.error("Failed to auto-save page");
    }
  }, 2000);

  const handleSave = useCallback((content) => {
    // Update local state immediately
    setPage(prev => ({
      ...prev,
      content
    }));
    
    // Trigger debounced save
    debouncedSave(content);
  }, [debouncedSave]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setLoading(true)

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      isUser:true
    };
    const req={
      sourceId:pageId,
      question:inputMessage
    }
    const chatRes=await chatPage(req)

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');



    // Simulate AI response (in a real app, you would call an API here)
    const aiResponse = {
      id: messages.length + 2,
      text: chatRes,
      sender: 'ai',
      isUser:false
    };
    setMessages(prev => [...prev, aiResponse]);
    setLoading(false)
    
  };

  const renderMarkdown = (text) => {
      return { __html: marked(text) };
    };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (<>
  
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button
            // onClick={() => setShowSummaryModal(true)}
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            disabled={isSummarizing}
          >
            {isSummarizing ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Summarizing...
              </>
            ) : (
              <>
                <FiFileText className="mr-2" />
                Summarize
              </>
            )}
          </button> */}
          <button
            onClick={() => setShowSummaryModal(true)}

            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiMessageSquare className="mr-2" />
            BrieflyAI
          </button>
        </div>
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
      <div className='flex'>
        <div className="w-3/4">



      <TailwindAdvancedEditor 
        content={page?.content ?? null}
        onUpdate={handleSave} 
        />
      </div>
        <div className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${showChat ? 'translate-x-0' : 'translate-x-full'} w-120 z-10 flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Assistant</h3>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              return(
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender==="user"
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-white border border-gray-100 rounded-bl-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
               }`}
                >
                  {message.sender=="user"?<p className="text-white">{message.text}</p>:
                  <div 
                  className={`prose max-w-none text-gray-800`}
                    dangerouslySetInnerHTML={renderMarkdown(message.text)}
                    />
                  }
                </div>
              </div>
            )})}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 relative">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-5 pr-14 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
                 />
              <button 
                type="submit"
                className={`absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  loading || !inputMessage.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}   >
              {loading ? (
                        <FiLoader className="animate-spin h-5 w-5" />
                      ) : (
                        <FiSend className="h-5 w-5" />
                      )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Chat toggle button */}
        {!showChat && (
          <button 
            onClick={async() => {
              await chatUploadPage(pageId);
              setShowChat(true);
            }}
            className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center"
            aria-label="Open AI Assistant"
          >
            <FiMessageSquare size={24} />
          </button>
        )}
        </div>
    </div>
    </div>

      {/* Summary Modal */}
      <Modal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} title="Document Summary">
        <div className="space-y-4">
          {!selectedSummaryType ? (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Choose Summary Type</h3>
              <button
                onClick={() => handleSummarize(1)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">Quick Glance</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get a brief overview of the main points</p>
              </button>
              <button
                onClick={() => handleSummarize(2)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">Detailed Insights</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">In-depth analysis of the document content</p>
              </button>
              <button
                onClick={() => handleSummarize(3)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">Key Points</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Concise bullet points of the main ideas</p>
              </button>
            </div>
          ) : isSummarizing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FiLoader className="animate-spin text-2xl text-primary mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Generating {summaryTitle?.[selectedSummaryType]||"Summary"}...</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {summaryTitle?.[selectedSummaryType]||"Summary"}
                </h3>
                <button
                  onClick={() => setSelectedSummaryType('')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Back to options
                </button>
              </div>
              <div 
                className="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                dangerouslySetInnerHTML={renderMarkdown(summaryContent)}
              />
            </div>
          )}
        </div>
      </Modal>
      </>
  );
};

export default PageEditor;
