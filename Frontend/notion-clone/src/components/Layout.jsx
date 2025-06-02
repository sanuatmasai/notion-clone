import React from 'react';
import Header from './Header.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Simple footer */}
      <footer className="py-4 border-t border-light-border dark:border-dark-border">
        <div className="container mx-auto px-4 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
          © {new Date().getFullYear()} Notion Clone. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
