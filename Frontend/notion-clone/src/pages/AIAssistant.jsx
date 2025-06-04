import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiSend, FiLoader, FiMessageSquare, FiArrowLeft, FiArrowRight, FiEyeOff, FiClock, FiEye } from 'react-icons/fi';
import { marked } from 'marked';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

const AIAssistant = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hello! I\'m your AI Assistant. How can I help you today?', 
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [history,setHistory]=useState(false)

  // Initialize chat session
  useEffect(() => {
    let isMounted = true;
    
    const initChat = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to use the AI Assistant');
          return;
        }
        
        const response = await axios.post(
          'http://localhost:8080/api/chat/upload',
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': '*/*'
            }
          }
        );
        
        if (isMounted) {
          setSessionId(response.data?.sessionId || 'default-session');
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (isMounted) {
          // Set a default session ID to allow chatting even if initialization fails
          setSessionId('fallback-session');
          toast.error('AI Assistant initialized with limited functionality');
        }
      }
    };

    if (currentUser) {
      initChat();
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      };
      
      const response = await api.post(
        history?"/chat/history":"/chat",
        {
          question: input,
          sessionId: sessionId
        },
        config
      );

      // Handle different response formats
      let responseText = 'I\'m not sure how to respond to that.';
      
      if (typeof response.data === 'string') {
        responseText = response.data;
      } else if (response.data.answer) {
        responseText = response.data.answer;
      } else if (response.data.message) {
        responseText = response.data.message;
      } else if (response.data.data) {
        responseText = response.data.data;
      }
      
      // Clean up the response text
      responseText = responseText
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
        .replace(/\n/g, '<br>') // New lines
        .replace(/^\s*[-*]\s*/gm, '• '); // List items
      
      const aiResponse = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        isFormatted: true
      };

      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse markdown to HTML
  const renderMarkdown = (text) => {
    return { __html: marked(text) };
  };

  return (
    <div className="fixed top-16 z-80 left-0 right-0 flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
            <p className="text-xs text-gray-500">Ask me anything about your workspaces</p>
          </div>
          <div className="ml-3 flex items-center">
      <button 
        onClick={() => setHistory(!history)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200 ease-in-out
          ${history 
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }
          hover:shadow-sm active:scale-95
        `}
      >
        {history ? (
          <>
            <FiClock className="w-4 h-4" />
            <span>History Enabled</span>
            <FiClock className="w-4 h-4 opacity-60" />
          </>
        ) : (
          <>
            <FiEyeOff className="w-4 h-4" />
            <span>History Disabled</span>
            <FiEye className="w-4 h-4 opacity-60" />
          </>
        )}
      </button>
      
      {/* Optional status indicator */}
      <div className={`ml-2 w-2 h-2 rounded-full ${history ? 'bg-green-400' : 'bg-red-400'}`} />
    </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 pt-4 space-y-4 w-full pl-72">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiMessageSquare className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 max-w-md">Ask me anything about your workspaces, documents, or tasks.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 transition-all duration-200 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-white border border-gray-100 rounded-bl-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                {message.isUser ? (
                  <p className="text-white">{message.text}</p>
                ) : message.isFormatted ? (
                  <div 
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                ) : (
                  <div 
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={renderMarkdown(message.text)}
                  />
                )}
                <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-400'} opacity-80`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-100">
  <div className="max-w-4xl mx-auto px-4 py-4">
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full pl-5 pr-14 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
          isLoading || !input.trim()
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {isLoading ? (
          <FiLoader className="animate-spin h-5 w-5" />
        ) : (
          <FiSend className="h-5 w-5" />
        )}
      </button>
    </form>
    <p className="text-xs text-gray-400 text-center mt-2">
      AI Assistant may produce inaccurate information. Consider verifying important details.
    </p>
  </div>
</div>


    </div>
  );
};

export default AIAssistant;
