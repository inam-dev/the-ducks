import { useState } from 'react';
import type { Document } from '../api/documentsApi';

export function meta() {
  return [
    { title: "DuckDocs - Results" },
    { name: "description", content: "View processed document results" },
  ];
}

export default function ResultsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [activeTab, setActiveTab] = useState<'overview' | 'sensitive' | 'redacted' | 'translate'>('overview');

  // Mock processed document
  const document: Document = {
    id: '1',
    name: 'housing-repair-request.pdf',
    uploadedAt: '2026-04-29T10:30:00Z',
    status: 'processed',
    gdprScore: 92,
    gdprStatus: 'Safe after redaction',
    department: {
      name: 'Housing Repairs',
      confidence: 91,
      reason: 'document mentions damp, mould, repair, property and inspection',
      suggestedAction: 'Book inspection within 2 working days'
    },
    sensitiveData: [
      { type: 'Name', original: 'John Smith', redacted: '██████', status: 'Redacted' },
      { type: 'Address', original: '42 Maple Street, Birmingham B1 2AB', redacted: '█████████████', status: 'Redacted' },
      { type: 'Phone', original: '0121 456 7890', redacted: '██████████', status: 'Redacted' },
      { type: 'Email', original: 'john.smith@email.com', redacted: '████████████', status: 'Redacted' },
      { type: 'NI Number', original: 'AB 12 34 56 C', redacted: '███████████', status: 'Redacted' },
      { type: 'Date of Birth', original: '15/03/1985', redacted: '██/██/████', status: 'Detected' }
    ],
    extractedData: {
      propertyAddress: '42 Maple Street, Birmingham B1 2AB',
      issueType: 'Damp and mould in bedroom',
      reportedDate: '2026-04-25',
      urgency: 'High',
      tenantName: 'REDACTED',
      contactNumber: 'REDACTED'
    },
    translation: {
      originalLanguage: 'English',
      availableLanguages: ['English', 'Welsh', 'Polish', 'Urdu', 'Bengali']
    }
  };

  const gdprChecklist = [
    { item: 'Names detected', status: 'redacted' },
    { item: 'Addresses detected', status: 'redacted' },
    { item: 'Phone numbers detected', status: 'redacted' },
    { item: 'Email addresses detected', status: 'redacted' },
    { item: 'National Insurance numbers detected', status: 'redacted' },
    { item: 'Dates of birth detected', status: 'detected' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Results</h1>
          <p className="text-slate-600 mt-1">Processed document analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
            ✓ Processed
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Score & Routing */}
        <div className="space-y-6">
          {/* GDPR Score Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">GDPR Share-Safe Score</h2>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(92 / 100) * 352} 352`}
                    className="text-teal-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-800">92%</span>
                </div>
              </div>
              <p className="text-lg font-medium text-teal-700 mb-4">Safe after redaction</p>
              <div className="space-y-2 text-left">
                {gdprChecklist.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.item}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'redacted'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {item.status === 'redacted' ? '✓ Redacted' : '⚠ Detected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Routing Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Auto-Route to Department</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Suggested Department</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  Housing Repairs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Confidence</span>
                <span className="text-sm font-semibold text-slate-800">91%</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">Reason</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                  Document mentions damp, mould, repair, property and inspection
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Suggested Action</p>
                    <p className="text-sm text-yellow-700">Book inspection within 2 working days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'sensitive', label: 'Sensitive Data' },
                  { id: 'redacted', label: 'Redacted Preview' },
                  { id: 'translate', label: 'Translation' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Extracted Data</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries({
                        'Property Address': '42 Maple Street, Birmingham B1 2AB',
                        'Issue Type': 'Damp and mould in bedroom',
                        'Reported Date': '2026-04-25',
                        'Urgency': 'High',
                        'Tenant Name': 'REDACTED',
                        'Contact Number': 'REDACTED',
                      }).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 rounded-lg p-4">
                          <p className="text-sm text-slate-500 mb-1">{key}</p>
                          <p className="font-medium text-slate-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sensitive' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Sensitive Data Detected</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Original</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Redacted</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.sensitiveData?.map((item, index) => (
                          <tr key={index} className="border-b border-slate-100">
                            <td className="py-3 px-4 text-sm text-slate-800">{item.type}</td>
                            <td className="py-3 px-4 text-sm text-slate-600">{item.original}</td>
                            <td className="py-3 px-4 text-sm font-mono text-slate-800">{item.redacted}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.status === 'Redacted'
                                  ? 'bg-teal-50 text-teal-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'redacted' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Redacted Document Preview</h3>
                  <div className="bg-slate-50 rounded-lg p-6 font-mono text-sm leading-relaxed">
                    <p className="mb-4"><span className="text-slate-400">// Housing Repair Request Form</span></p>
                    <p className="mb-2"><span className="text-slate-500">Date:</span> 25/04/2026</p>
                    <p className="mb-4"><span className="text-slate-500">Reference:</span> HR-2026-0425</p>
                    <p className="mb-2"><span className="text-slate-500">Applicant Name:</span> <span className="bg-slate-200 px-1">██████</span></p>
                    <p className="mb-2"><span className="text-slate-500">Address:</span> <span className="bg-slate-200 px-1">█████████████</span></p>
                    <p className="mb-2"><span className="text-slate-500">Contact:</span> <span className="bg-slate-200 px-1">██████████</span></p>
                    <p className="mb-2"><span className="text-slate-500">Email:</span> <span className="bg-slate-200 px-1">████████████</span></p>
                    <p className="mb-2"><span className="text-slate-500">NI Number:</span> <span className="bg-slate-200 px-1">███████████</span></p>
                    <p className="mb-4"><span className="text-slate-500">Date of Birth:</span> <span className="bg-yellow-100 px-1">██/██/████</span></p>
                    <p className="mb-2"><span className="text-slate-500">Property:</span> 42 Maple Street, Birmingham B1 2AB</p>
                    <p className="mb-2"><span className="text-slate-500">Issue:</span> Severe damp and mould in bedroom</p>
                    <p className="mb-2"><span className="text-slate-500">Description:</span> Water ingress from external wall causing</p>
                    <p className="mb-2">black mould to develop on walls and ceiling. Problem</p>
                    <p className="mb-2">worsening over past 3 months.</p>
                    <p className="mt-4"><span className="text-slate-500">Requested Action:</span> Urgent inspection and repair</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-3 h-3 bg-slate-200 rounded"></span>
                    <span>Redacted</span>
                    <span className="w-3 h-3 bg-yellow-100 rounded ml-4"></span>
                    <span>Detected (not fully redacted)</span>
                  </div>
                </div>
              )}

              {activeTab === 'translate' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Translation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Original Language
                      </label>
                      <select className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Translate to
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      >
                        {['English', 'Welsh', 'Polish', 'Urdu', 'Bengali'].map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
                      Translate Document
                    </button>
                    <div className="bg-slate-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-slate-500">
                        Translation service will convert the document content to the selected language,
                        maintaining formatting and redactions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end">
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Download Report
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
          Print
        </button>
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
          Route to Department
        </button>
      </div>
    </div>
  );
}