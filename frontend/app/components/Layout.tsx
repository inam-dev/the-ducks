import { NavLink } from 'react-router';
import { useState } from 'react';
import AccessibilityToolbar from './AccessibilityToolbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">DuckDocs</h1>
                <p className="text-xs text-slate-500">Secure Document Processor</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                Upload
              </NavLink>
              <NavLink
                to="/processing"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                Processing
              </NavLink>
              <NavLink
                to="/results"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
              >
                Results
              </NavLink>
            </nav>

            {/* Accessibility Toggle */}
            <button
              onClick={() => setAccessibilityOpen(!accessibilityOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              aria-label="Toggle accessibility tools"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-1 overflow-x-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`
          }
        >
          Upload
        </NavLink>
        <NavLink
          to="/processing"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`
          }
        >
          Processing
        </NavLink>
        <NavLink
          to="/results"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`
          }
        >
          Results
        </NavLink>
      </nav>

      {/* Accessibility Toolbar */}
      {accessibilityOpen && <AccessibilityToolbar onClose={() => setAccessibilityOpen(false)} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500">
            DuckDocs © 2026 — Secure Document Processor for Local Councils
          </p>
        </div>
      </footer>
    </div>
  );
}