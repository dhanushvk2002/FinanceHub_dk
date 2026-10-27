import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({
  title = 'No records available',
  message = 'There are no financial transactions or items matching your current filters.',
  action,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 20px',
        backgroundColor: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: '12px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          marginBottom: '12px',
        }}
      >
        <FileQuestion size={24} />
      </div>
      <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '400px', marginBottom: action ? '16px' : '0' }}>
        {message}
      </p>
      {action}
    </div>
  );
}
