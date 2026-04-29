import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import type { Route } from "./+types/summary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Summary - CouncilPoint" },
    { name: "description", content: "Document summary" }
  ];
}

export default function Summary() {
  const [showGenerated, setShowGenerated] = useState(false);

  const mockDocument = {
    name: 'Missed Waste Collection Complaint',
    category: 'Complaint',
    originalSummary: 'Resident reports repeated missed food waste collections over a two-week period and requests follow-up from Waste Management.',
    keyPoints: [
      'Repeated missed collection',
      'Resident has contacted the council before',
      'Follow-up required'
    ],
    detectedDetails: {
      name: 'Lucy Chen',
      address: '24 Green Lane, Uxbridge',
      email: 'lucy.chen@example.com',
      suggestedDepartment: 'Waste Management',
      urgency: 'Medium'
    }
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Summary"
        description="AI-generated document summaries with key details extracted"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Document Summary */}
          <Card title="Document Summary">
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Document Name</p>
                <p className="text-lg font-semibold text-gray-900">{mockDocument.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Category</p>
                <Badge variant="info">{mockDocument.category}</Badge>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 font-medium mb-3">Summary</p>
                <p className="text-gray-700 leading-relaxed">
                  {showGenerated ? mockDocument.originalSummary : 'Click "Generate Summary" to process this document.'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-medium mb-3">Key Points</p>
                <ul className="space-y-2">
                  {mockDocument.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="primary"
                onClick={() => setShowGenerated(!showGenerated)}
                className="w-full"
              >
                {showGenerated ? 'Hide Summary' : 'Generate Summary'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Detected Details */}
          <Card title="Detected Details">
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Resident Name</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{mockDocument.detectedDetails.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Address</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{mockDocument.detectedDetails.address}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Email</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{mockDocument.detectedDetails.email}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-600 font-medium uppercase">Suggested Department</p>
                <Badge variant="info" className="mt-2">{mockDocument.detectedDetails.suggestedDepartment}</Badge>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Urgency</p>
                <Badge variant="warning" className="mt-2">{mockDocument.detectedDetails.urgency}</Badge>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Summaries help staff quickly understand document content and identify routing needs.
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
