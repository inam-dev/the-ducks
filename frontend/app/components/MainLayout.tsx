import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Upload & Categorise', icon: '📤' },
    { path: '/summary', label: 'Summary', icon: '📝' },
    { path: '/redaction', label: 'Redaction & Privacy', icon: '🔒' },
    { path: '/translation', label: 'Translation', icon: '🌐' },
    { path: '/handwritten', label: 'Handwritten Notes', icon: '✍️' },
    { path: '/accessibility', label: 'Accessibility', icon: '♿' },
    { path: '/history', label: 'Document History', icon: '📋' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg transition-all duration-300 overflow-y-auto`}>
        <div className="p-4 border-b border-blue-700">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="md" />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold truncate">CouncilPoint</h1>
                <p className="text-xs text-blue-100 truncate">Smart document management</p>
              </div>
            )}
          </Link>
        </div>

        <nav className="px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-700 text-white font-medium'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm flex-1">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 ml-4">
              <h2 className="text-2xl font-bold text-gray-900">CouncilPoint</h2>
              <p className="text-sm text-gray-600">Secure documents. Smarter decisions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Council Staff</p>
                <p className="text-xs text-gray-600">Ready to help</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold">
                CS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
