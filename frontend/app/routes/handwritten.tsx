import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import type { Route } from "./+types/handwritten";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Handwritten Notes - CouncilPoint" },
    { name: "description", content: "Handwritten notes OCR processing" }
  ];
}

export default function Handwritten() {
  const [showExtracted, setShowExtracted] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const mockExtractedText = 'Resident visited reception regarding missed collection. Follow-up requested. Priority: Medium.';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Handwritten Notes"
        description="Extract and process handwritten text using OCR"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card title="Upload Scanned Document">
            <div className="p-6 space-y-6">
              {/* Drag & Drop */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('handwritten-file')?.click()}
              >
                <div className="text-4xl mb-3">✍️</div>
                <p className="font-medium text-gray-900">Upload scanned handwritten notes</p>
                <p className="text-sm text-gray-600 mt-1">Drag and drop or click to select</p>
                <input
                  id="handwritten-file"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </div>

              {fileName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">✓ File selected: {fileName}</p>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900">⚠️ Handwritten text may require staff review for accuracy.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card title="OCR Tips" className="p-6">
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✓ Best results: Clear, dark ink</li>
              <li>✓ Minimum resolution: 300 DPI</li>
              <li>✓ Supported formats: PNG, JPG, PDF</li>
              <li>✓ Maximum file: 50 MB</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Extracted Text Section */}
      {(fileName || showExtracted) && (
        <div className="mt-8">
          <Card title="Extracted Text">
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-24">
                {showExtracted ? (
                  <p className="text-gray-700 text-sm leading-relaxed">{mockExtractedText}</p>
                ) : (
                  <p className="text-gray-500 text-sm italic">Click "Review extracted text" to process...</p>
                )}
              </div>

              {!showExtracted && (
                <Button variant="primary" onClick={() => setShowExtracted(true)} className="w-full">
                  Review Extracted Text
                </Button>
              )}

              {showExtracted && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Staff review required</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    Please verify the extracted text is accurate before processing further. Manual corrections may be needed for difficult handwriting.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
