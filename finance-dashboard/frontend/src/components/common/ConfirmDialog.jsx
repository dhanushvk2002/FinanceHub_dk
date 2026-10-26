import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Financial Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color={isDangerous ? '#ef4444' : '#2563eb'} />
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
