import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import type { Route } from "./+types/redaction";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redaction & Privacy - CouncilPoint" },
    { name: "description", content: "Redaction and privacy controls" }
  ];
}

export default function Redaction() {
  const [selectedRedactions, setSelectedRedactions] = useState<string[]>(['name', 'address', 'email', 'phone']);

  const originalText = `Lucy Chen lives at 24 Green Lane, Uxbridge. Her email is lucy.chen@example.com and her phone number is 07123 456789. She reported missed food waste collections.`;

  const redactedText = `[REDACTED NAME] lives at [REDACTED ADDRESS]. Her email is [REDACTED EMAIL] and her phone number is [REDACTED PHONE]. She reported missed food waste collections.`;

  const sensitiveDataTypes = [
    { id: 'name', label: 'Name', color: 'red' },
    { id: 'address', label: 'Address', color: 'red' },
    { id: 'email', label: 'Email', color: 'orange' },
    { id: 'phone', label: 'Phone', color: 'orange' }
  ];

  const toggleRedaction = (id: string) => {
    setSelectedRedactions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <SectionHeader
        title="Redaction & Privacy"
        description="Review and redact sensitive information before sharing"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Original Text */}
        <Card title="Original Text">
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-24">
              <p className="text-gray-700 text-sm leading-relaxed">{originalText}</p>
            </div>
          </div>
        </Card>

        {/* Redacted Text */}
        <Card title="Redacted Text">
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-24">
              <p className="text-gray-700 text-sm leading-relaxed">{redactedText}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Redaction Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Sensitive Data Detected">
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {sensitiveDataTypes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={selectedRedactions.includes(item.id)}
                        onChange={() => toggleRedaction(item.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor={item.id} className="flex-1 cursor-pointer">
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </label>
                    </div>
                    <Badge variant={item.color === 'red' ? 'danger' : 'warning'}>
                      {item.color === 'red' ? 'High Risk' : 'Medium Risk'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>GDPR Share-Safe Score:</strong> 88/100
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  This score estimates how safe a document is to share based on remaining sensitive information.
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="primary" className="w-full">Auto-redact</Button>
                <Button variant="secondary" className="w-full">Mark Text Manually</Button>
                <Button variant="ghost" className="w-full">Download Redacted Copy</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Score Panel */}
        <div className="space-y-6">
          <Card title="Share-Safe Assessment">
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">88</div>
                <p className="text-sm text-gray-600">/100</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Status</p>
                <Badge variant="warning">Review Recommended</Badge>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Explanation</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The Share-Safe Score estimates how safe a document is to share after redaction, based on remaining sensitive information.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-teal-50 border-teal-200">
            <p className="text-sm text-teal-900">
              <strong>🔒 Privacy First:</strong> Always verify redaction is complete before external sharing.
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
