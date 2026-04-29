import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getDocuments, type Document } from '../api/documentsApi';

export function meta() {
  return [
    { title: "DuckDocs - Processing" },
    { name: "description", content: "View documents currently being processed" },
  ];
}

export default function ProcessingPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocuments().then(docs => {
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const processingDocs = documents.filter(d => d.status === 'processing' || d.status === 'pending');

  const steps = [
    { id: 1, name: 'Upload', description: 'Document received', completed: true },
    { id: 2, name: 'Extract', description: 'Extracting key data', completed: true },
    { id: 3, name: 'Detect', description: 'Detecting sensitive information', completed: true },
    { id: 4, name: 'Redact', description: 'Redacting GDPR data', inProgress: true },
    { id: 5, name: 'Score', description: 'Calculating GDPR Score', pending: true },
    { id: 6, name: 'Route', description: 'Routing to department', pending: true },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Processing</h1>
        <p className="text-slate-600 mt-1">Documents currently being processed</p>
      </div>

      {/* Processing Status */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-slate-800">Current Processing Job</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Document Info */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-800">housing-repair-request.pdf</p>
              <p className="text-sm text-slate-500">Uploaded 2 minutes ago</p>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex items-start gap-4">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.inProgress
                      ? 'bg-blue-500 text-white'
                      : step.completed
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {step.completed ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.inProgress ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <p className={`font-medium ${
                      step.inProgress ? 'text-blue-800' : 
                      step.completed ? 'text-slate-800' : 'text-slate-500'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Processing Queue</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : processingDocs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500">No documents in processing queue</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Upload a document
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {processingDocs.map((doc) => (
              <div key={doc.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(doc.uploadedAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estimated Time */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Estimated Completion</h3>
            <p className="text-sm text-yellow-700">
              Processing typically takes 15-30 seconds. Results will include GDPR Score, 
              sensitive data detection, auto-routing suggestion, and translation options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}