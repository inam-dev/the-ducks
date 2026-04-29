// filepath: F:\Hillingdom Hacky\frontend\app\routes\home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getDocuments, type Document } from '../api/documentsApi';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "DuckDocs - Dashboard" },
    { name: "description", content: "Secure Document Processor for Local Councils" },
  ];
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments().then(docs => {
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const stats = {
    total: documents.length,
    processed: documents.filter(d => d.status === 'processed').length,
    pending: documents.filter(d => d.status === 'pending').length,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome to DuckDocs — Secure Document Processor</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Documents</p>
              <p className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Processed</p>
              <p className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.processed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Recent Documents</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 mb-4">No documents uploaded yet</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Upload your first document
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <div key={doc.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(doc.uploadedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {doc.gdprScore !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-slate-500">GDPR Score</p>
                        <p className={`font-semibold ${
                          doc.gdprScore >= 80 ? 'text-teal-600' :
                          doc.gdprScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {doc.gdprScore}%
                        </p>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'processed'
                        ? 'bg-teal-50 text-teal-700'
                        : doc.status === 'processing'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/upload"
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">Upload Document</h3>
          <p className="text-sm text-slate-500">Upload a new document for processing</p>
        </Link>

        <Link
          to="/processing"
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">View Processing</h3>
          <p className="text-sm text-slate-500">See documents currently being processed</p>
        </Link>

        <Link
          to="/results"
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-yellow-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">View Results</h3>
          <p className="text-sm text-slate-500">Access processed document results</p>
        </Link>
      </div>
    </div>
  );
}
