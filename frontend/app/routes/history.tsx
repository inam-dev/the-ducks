import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export function meta() {
  return [
    { title: "Document History - CouncilPoint" },
    { name: "description", content: "Document processing history" }
  ];
}

export default function History() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [confidentialityFilter, setConfidentialityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [accessLevelFilter, setAccessLevelFilter] = useState('');

  const documents = [
    {
      id: 1,
      name: 'Missed Waste Collection Complaint',
      category: 'Complaint',
      confidentiality: 'Confidential',
      accessLevel: 'Department only',
      status: 'Review recommended',
      shareSafeScore: 88,
      lastEdited: 'Today'
    },
    {
      id: 2,
      name: 'Passport Copy',
      category: 'Passport',
      confidentiality: 'Highly Confidential',
      accessLevel: 'Case worker only',
      status: 'Do not share',
      shareSafeScore: 62,
      lastEdited: 'Yesterday'
    },
    {
      id: 3,
      name: 'Council Tax Query',
      category: 'Council Tax Letter',
      confidentiality: 'Internal',
      accessLevel: 'Department only',
      status: 'Safe to share',
      shareSafeScore: 94,
      lastEdited: '2 days ago'
    },
    {
      id: 4,
      name: 'Housing Evidence',
      category: 'Medical Evidence',
      confidentiality: 'Highly Confidential',
      accessLevel: 'Case worker only',
      status: 'Redacted',
      shareSafeScore: 79,
      lastEdited: '3 days ago'
    },
  ];

  const filteredDocuments = documents.filter(doc => {
    if (categoryFilter && doc.category !== categoryFilter) return false;
    if (confidentialityFilter && doc.confidentiality !== confidentialityFilter) return false;
    if (statusFilter && doc.status !== statusFilter) return false;
    if (accessLevelFilter && doc.accessLevel !== accessLevelFilter) return false;
    return true;
  });

  const categories = [...new Set(documents.map(d => d.category))];
  const confidentialities = [...new Set(documents.map(d => d.confidentiality))];
  const statuses = [...new Set(documents.map(d => d.status))];
  const accessLevels = [...new Set(documents.map(d => d.accessLevel))];

  const getStatusVariant = (status: string) => {
    if (status.includes('Safe')) return 'success';
    if (status.includes('not share')) return 'danger';
    if (status.includes('Redacted')) return 'info';
    return 'warning';
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Document History"
        description="View all processed documents and their status"
      />

      {/* Filters */}
      <Card title="Filters" className="mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={confidentialityFilter}
              onChange={(e) => setConfidentialityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Confidentiality</option>
              {confidentialities.map(conf => (
                <option key={conf} value={conf}>{conf}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Status</option>
              {statuses.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>

            <select
              value={accessLevelFilter}
              onChange={(e) => setAccessLevelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Access Levels</option>
              {accessLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Document Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Confidentiality</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Access Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Share-Safe</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Edited</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, idx) => (
                <tr key={doc.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={doc.confidentiality.includes('Highly') ? 'danger' : 'warning'}>
                      {doc.confidentiality}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.accessLevel}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={getStatusVariant(doc.status)}>
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${doc.shareSafeScore}%` }}
                        ></div>
                      </div>
                      <span className="whitespace-nowrap">{doc.shareSafeScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.lastEdited}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">Showing {filteredDocuments.length} of {documents.length} documents</p>
        </div>
      </Card>
    </MainLayout>
  );
}
