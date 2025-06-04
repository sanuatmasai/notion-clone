import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { FiHome, FiLayers, FiSettings, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import WorkspaceList from './workspace/WorkspaceList';
import CreateWorkspaceModal from './workspace/CreateWorkspaceModal';
import { useModal } from '../contexts/ModalContext';

const Sidebar = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { openModal } = useModal();
  
  const handleOpenModal = (workspace = null) => {
    openModal(
      <CreateWorkspaceModal workspace={workspace} />,
      { workspace }
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      // toast.success('Successfully logged out');
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { 
      name: t('sidebar.home', 'Home'), 
      path: '/dashboard', 
      icon: <FiHome className="w-5 h-5" /> 
    },
    { 
      name: 'AI Assistant', 
      path: '/ai-assistant', 
      icon: <FiMessageSquare className="w-5 h-5" /> 
    },
    { 
      name: t('sidebar.templates', 'Templates'), 
      path: '/templates', 
      icon: <FiLayers className="w-5 h-5" /> 
    },
    { 
      name: t('sidebar.settings', 'Settings'), 
      path: '/settings', 
      icon: <FiSettings className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Main Navigation */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Workspace List */}
        <div className="flex-1 overflow-y-auto py-4">
          <WorkspaceList onOpenModal={handleOpenModal} />
        </div>
        
        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 pt-2 pb-4">
          <ul className="px-2 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full"
              src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'User')}&background=random`}
              alt=""
            />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email || ''}
            </p>
          </div>
          <div className="ml-4">
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
