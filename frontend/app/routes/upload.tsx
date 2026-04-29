import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertToast } from '../components/AlertToast';
import type { Route } from "./+types/upload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload & Categorise - CouncilPoint" },
    { name: "description", content: "Upload and categorise documents" }
  ];
}

export default function Upload() {
  const [fileName, setFileName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [confidentiality, setConfidentiality] = useState<string>('Internal');
  const [accessLevel, setAccessLevel] = useState<string>('Department only');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const categories = [
    'Passport',
    'Visa',
    'Proof of Address',
    'Council Tax Letter',
    'Housing Form',
    'Complaint',
    'Medical Evidence',
    'Handwritten Notes',
    'General Document'
  ];

  const confidentialityLevels = ['Public', 'Internal', 'Confidential', 'Highly Confidential'];
  const accessLevels = ['View only', 'Department only', 'Case worker only', 'Redacted public copy'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleConfidentialityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setConfidentiality(value);
    setShowWarning(value === 'Highly Confidential');
  };

  const handleProcess = () => {
    if (!fileName || !title || !category) {
      alert('Please fill in all required fields');
      return;
    }
    setSuccessMessage('Document queued for secure processing.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Upload & Categorise"
        description="Upload documents and classify them for processing"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card title="Upload Document">
            <div className="p-6 space-y-6">
              {/* Drag & Drop Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="text-4xl mb-3">📁</div>
                <p className="font-medium text-gray-900">Drag and drop your document here</p>
                <p className="text-sm text-gray-600 mt-1">or click to select a file</p>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </div>

              {fileName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">✓ File selected: {fileName}</p>
                </div>
              )}

              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Document Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Missed Waste Collection Complaint"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Document Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Confidentiality Level */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Confidentiality Level</label>
                <select
                  value={confidentiality}
                  onChange={handleConfidentialityChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {confidentialityLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Access Level</label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {accessLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Warning for Highly Confidential */}
              {showWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-900">
                    ⚠️ This document may contain sensitive personal data. Redaction and access controls are required before sharing.
                  </p>
                </div>
              )}

              {/* Process Button */}
              <Button variant="primary" onClick={handleProcess} className="w-full">
                Process Document
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card title="Tips" className="p-6">
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✓ Supported formats: PDF, DOC, DOCX, PNG, JPG</li>
              <li>✓ Maximum file size: 50 MB</li>
              <li>✓ Always verify the category before processing</li>
              <li>✓ Highly Confidential documents require extra review</li>
            </ul>
          </Card>

          <Card title="Categories" className="p-6">
            <p className="text-xs text-gray-600 mb-2 font-medium">Common document types:</p>
            <div className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat} className="text-xs text-gray-700">• {cat}</div>
              ))}
              <div className="text-xs text-gray-500 pt-2">+ {categories.length - 5} more categories</div>
            </div>
          </Card>
        </div>
      </div>

      {successMessage && (
        <AlertToast message={successMessage} type="success" onClose={() => setSuccessMessage('')} />
      )}
    </MainLayout>
  );
}
