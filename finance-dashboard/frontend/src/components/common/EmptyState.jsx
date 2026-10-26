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
        padding: '64px 24px',
        backgroundColor: 'var(--bg-card)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '16px',
        }}
      >
        <FileQuestion size={26} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: action ? '20px' : '0', lineHeight: 1.5 }}>
        {message}
      </p>
      {action}
    </div>
  );
}
