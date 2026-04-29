import React, { useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { SectionHeader } from '../components/SectionHeader';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export function meta() {
  return [
    { title: "Dashboard - CouncilPoint" },
    { name: "description", content: "CouncilPoint Dashboard" }
  ];
}

export default function Dashboard() {
  const recentActivity = [
    { id: 1, action: 'Document processed', document: 'Missed Waste Collection Complaint', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'Redaction review', document: 'Passport Copy', time: '5 hours ago', status: 'pending' },
    { id: 3, action: 'Document uploaded', document: 'Council Tax Query', time: '1 day ago', status: 'completed' },
    { id: 4, action: 'Translation requested', document: 'Housing Form', time: '2 days ago', status: 'completed' },
  ];

  return (
    <MainLayout>
      <SectionHeader
        title="Welcome to CouncilPoint"
        description="Secure document processing for council staff"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Documents Processed"
          value="247"
          icon="📄"
          color="blue"
        />
        <StatCard
          label="Needs Review"
          value="12"
          icon="⚠️"
          color="yellow"
        />
        <StatCard
          label="High Confidentiality"
          value="8"
          icon="🔒"
          color="red"
        />
        <StatCard
          label="Avg Share-Safe Score"
          value="87"
          icon="✓"
          color="teal"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card title="Recent Activity">
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.document}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{activity.time}</span>
                      <Badge variant={activity.status === 'completed' ? 'success' : 'warning'}>
                        {activity.status === 'completed' ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Pro Tips Card */}
        <div>
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-bold text-gray-900 text-lg">Pro Tip</h3>
              <p className="text-sm text-gray-700 mt-2">
                Always verify the Share-Safe Score before sharing documents externally.
              </p>
              <div className="mt-4 pt-4 border-t border-teal-200">
                <p className="text-xs text-gray-600 font-medium">Use redaction controls to protect sensitive resident data</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Why This Matters */}
      <Card title="Why This Matters" className="mb-8">
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            Council staff often process sensitive documents manually. CouncilPoint reduces admin time, improves consistency, and helps protect resident data before documents are shared. By automating categorisation, redaction, and access control, we ensure GDPR compliance and maintain resident privacy.
          </p>
        </div>
      </Card>
    </MainLayout>
  );
}
