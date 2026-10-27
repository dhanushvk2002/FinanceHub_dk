import React, { useState, useRef } from 'react';
import { X, Camera, Trash2, Check, User, Mail, Phone, Briefcase } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [form, setForm] = useState(() => ({
    displayName: profile?.displayName || 'CFO',
    fullName: profile?.fullName || 'Chief Financial Officer',
    role: profile?.role || 'Finance Admin • FY26',
    email: profile?.email || 'cfo@financehub.com',
    phone: profile?.phone || '+91 98765 43210',
    avatarUrl: profile?.avatarUrl || '/avatar.jpg',
  }));

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Edit Executive Profile</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Update your profile display name, designation and contact info
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          {/* Avatar Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              paddingBottom: '20px',
              marginBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.25rem',
                border: '2px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{form.displayName?.slice(0, 3).toUpperCase() || 'CFO'}</span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ gap: '6px' }}
                >
                  <Camera size={14} /> Upload Photo
                </button>
                {form.avatarUrl && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleRemovePhoto}
                    style={{ color: '#ef4444', gap: '4px' }}
                    title="Remove picture"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                )}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                Recommended: Square JPG or PNG, max 5MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.80rem' }}>
                Sidebar Display Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. CFO or Dhanush"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  style={{ paddingLeft: '32px' }}
                />
                <User size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Short name shown on the sidebar</span>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.80rem' }}>
                Role / Department
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Finance Admin • FY26"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  style={{ paddingLeft: '32px' }}
                />
                <Briefcase size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Subtext under your name</span>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.80rem' }}>
              Full Official Name / Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Chief Financial Officer"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.80rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="cfo@financehub.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: '32px' }}
                />
                <Mail size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.80rem' }}>
                Contact / Phone
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ paddingLeft: '32px' }}
                />
                <Phone size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              </div>
            </div>
          </div>

          <div className="modal-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', margin: 0 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
