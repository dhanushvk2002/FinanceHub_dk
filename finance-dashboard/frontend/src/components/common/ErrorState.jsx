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
        padding: '48px 24px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        margin: '20px 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          marginBottom: '14px',
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#991b1b', marginBottom: '6px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.84rem', color: '#b91c1c', maxWidth: '480px', marginBottom: '16px' }}>
        {message}
      </p>
      {onRetry && (
        <button
          className="btn btn-secondary"
          onClick={onRetry}
          style={{ borderColor: '#fca5a5' }}
        >
          <RefreshCw size={14} /> Retry Request
        </button>
      )}
    </div>
  );
}
