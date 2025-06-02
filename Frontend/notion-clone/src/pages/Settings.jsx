import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiGlobe, FiMoon, FiSun, FiBell, FiCreditCard, FiDownload, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'en',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
  });

  // Load user data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to update the user's settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would generate and download a data export
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Data export started. You will receive an email when it\'s ready.');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: <FiUser className="mr-2 h-4 w-4" /> },
    { id: 'security', name: 'Security', icon: <FiLock className="mr-2 h-4 w-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="mr-2 h-4 w-4" /> },
    { id: 'appearance', name: 'Appearance', icon: <FiSun className="mr-2 h-4 w-4" /> },
    { id: 'billing', name: 'Billing', icon: <FiCreditCard className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Settings</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4
        ">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Export Data
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar navigation */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 mt-8"
              >
                <FiLogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <form onSubmit={handleSubmit}>
              {activeTab === 'account' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly so be careful what you share.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                            Display name
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <FiUser className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              name="displayName"
                              id="displayName"
                              value={formData.displayName}
                              onChange={handleInputChange}
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="Your name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <FiMail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your password associated with your account.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current password
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <FiLock className="h-4 w-4" />
                            </span>
                            <input
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New password
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <FiLock className="h-4 w-4" />
                            </span>
                            <input
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm new password
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              <FiLock className="h-4 w-4" />
                            </span>
                            <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Updating...' : 'Update Password'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Decide which communications you'd like to receive and how.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-6">
                        <fieldset>
                          <legend className="text-base font-medium text-gray-900">By Email</legend>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="emailNotifications"
                                  name="emailNotifications"
                                  type="checkbox"
                                  checked={formData.emailNotifications}
                                  onChange={handleInputChange}
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                                  Email notifications
                                </label>
                                <p className="text-gray-500">Get notified about account activity and updates.</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="pushNotifications"
                                  name="pushNotifications"
                                  type="checkbox"
                                  checked={formData.pushNotifications}
                                  onChange={handleInputChange}
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                                  Push notifications
                                </label>
                                <p className="text-gray-500">Receive push notifications on your device.</p>
                              </div>
                            </div>
                          </div>
                        </fieldset>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Appearance</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Customize the appearance of the app.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                            Theme
                          </label>
                          <select
                            id="theme"
                            name="theme"
                            value={formData.theme}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                          </label>
                          <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                            <option value="zh">中文</option>
                          </select>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Billing</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage billing and subscription information.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FiCreditCard className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              You're currently on the <span className="font-medium">Free Plan</span>.
                              Upgrade to access premium features.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900">Plan Details</h4>
                        <div className="mt-4 bg-gray-50 overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div>
                                <p className="text-2xl font-semibold text-gray-900">Free</p>
                                <p className="mt-1 text-sm text-gray-500">For individuals getting started</p>
                              </div>
                              <div className="ml-auto">
                                <p className="text-2xl font-semibold text-gray-900">$0<span className="text-base font-normal text-gray-500">/month</span></p>
                              </div>
                            </div>
                            <div className="mt-6">
                              <h5 className="text-sm font-medium text-gray-900">What's included:</h5>
                              <ul className="mt-2 space-y-2">
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 text-sm text-gray-700">Up to 100 notes</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 text-sm text-gray-700">Basic templates</span>
                                </li>
                                <li className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 text-sm text-gray-700">Basic support</span>
                                </li>
                              </ul>
                            </div>
                            <div className="mt-6">
                              <button
                                type="button"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Upgrade to Pro
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <h4 className="text-md font-medium text-gray-900">Payment Method</h4>
                        <div className="mt-4 bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <p className="text-sm text-gray-500">No payment method on file.</p>
                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Add Payment Method
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <h4 className="text-md font-medium text-gray-900">Billing History</h4>
                        <div className="mt-4 bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <p className="text-sm text-gray-500">No billing history available.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
