import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'teal' | 'yellow' | 'red';
}

export function StatCard({ label, value, icon, color = 'blue' }: StatCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    teal: 'bg-teal-50 text-teal-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`text-3xl p-3 rounded-lg ${colorStyles[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
