import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Failed to load financial records',
  message = 'An unexpected error occurred while communicating with the Spring Boot backend.',
  onRetry,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '52px 24px',
        backgroundColor: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        borderRadius: 'var(--radius-lg)',
        margin: '20px 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 63, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--danger-text)',
          marginBottom: '16px',
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '18px', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
        >
          <RefreshCw size={14} /> Retry Request
        </button>
      )}
    </div>
  );
}
