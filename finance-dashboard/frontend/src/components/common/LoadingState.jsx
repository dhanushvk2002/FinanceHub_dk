import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading financial ledger & data...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '70px 20px',
        color: 'var(--text-muted)',
        gap: '14px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
      }}
    >
      <Loader2 size={34} color="var(--primary)" className="spin" />
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
        {message}
      </span>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
        Reconciling ledger records • Enterprise ERP
      </span>
    </div>
  );
}
