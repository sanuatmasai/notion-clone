import React from 'react';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Notion Clone</h1>
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            This is a minimalist Notion clone with a dark theme. Use the theme toggle in the top right to switch between light and dark modes.
          </p>
          <button className="btn btn-primary">Create a new page</button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
