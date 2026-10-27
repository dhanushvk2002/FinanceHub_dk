import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  Activity,
  DollarSign,
  Receipt,
  Boxes,
  PieChart,
  GitCommit,
  FileText,
  FileCheck,
  Percent,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  LineChart,
  Target,
  Landmark,
  Camera,
  LogOut,
  UserCog,
  X,
} from 'lucide-react';
import EditProfileModal from './EditProfileModal';

export const FINANCE_MODULES = [
  { name: 'Profit & Loss Statement (P&L)', path: '/finance/profit-loss', icon: TrendingUp },
  { name: 'Balance Sheet & Capital Structure', path: '/finance/balance-sheet', icon: Scale },
  { name: 'Cash Flow Statement & Liquidity', path: '/finance/cash-flow', icon: Activity },
  { name: 'Revenue Intelligence & Inflows', path: '/finance/revenue', icon: DollarSign },
  { name: 'Operating Expenses (OPEX)', path: '/finance/operating-expenses', icon: Receipt },
  { name: 'Cost of Goods Sold (COGS)', path: '/finance/cogs', icon: Boxes },
  { name: 'Gross Profit & Unit Economics', path: '/finance/gross-profit', icon: PieChart },
  { name: 'Operating EBITDA & Bridge', path: '/finance/ebitda', icon: GitCommit },
  { name: 'Accounts Receivable (AR)', path: '/finance/accounts-receivable', icon: FileText },
  { name: 'Accounts Payable (AP)', path: '/finance/accounts-payable', icon: FileCheck },
  { name: 'GST Tax Invoices Register', path: '/finance/gst-invoices', icon: Percent },
  { name: 'Payments & Gateway Settlement', path: '/finance/payments', icon: CreditCard },
  { name: 'Refunds & Reversals Ledger', path: '/finance/refunds', icon: RotateCcw },
  { name: 'Statutory Tax Compliance', path: '/finance/tax-compliance', icon: ShieldAlert },
  { name: 'Financial Forecasting & Models', path: '/finance/forecasting', icon: LineChart },
  { name: 'Cost Structure & Breakeven Analysis', path: '/finance/breakeven', icon: Target },
];

export default function Sidebar({ isMobileOpen = false, onCloseMobile }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('financehub_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    const legacyAvatar = localStorage.getItem('financehub_user_avatar');
    return {
      displayName: 'CFO',
      fullName: 'Chief Financial Officer',
      role: 'Finance Admin • FY26',
      email: 'cfo@financehub.com',
      phone: '+91 98765 43210',
      avatarUrl: legacyAvatar || '/avatar.jpg',
    };
  });
  const [imgError, setImgError] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    setImgError(false);
    try {
      localStorage.setItem('financehub_user_profile', JSON.stringify(newProfile));
      if (newProfile.avatarUrl) {
        localStorage.setItem('financehub_user_avatar', newProfile.avatarUrl);
      }
    } catch (err) {
      console.warn('Could not save profile to localStorage:', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of FinanceHub?')) {
      // Clear current session alert and notify
      alert('You have been logged out successfully.');
      window.location.reload();
    }
  };
  return (
    <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-info">
          <div className="brand-logo-icon">
            <img
              src="/financehub-gold-logo.jpg"
              alt="FinanceHub Gold Logo"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-text">
            <span className="brand-title">FinanceHub</span>
            <span className="brand-tag">Executive Suite</span>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-mobile-close-btn"
          onClick={onCloseMobile}
          aria-label="Close menu"
          title="Close Navigation"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Overview</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title="Executive Dashboard"
          onClick={() => onCloseMobile?.()}
        >
          <div className="sidebar-link-icon">
            <LayoutDashboard size={18} />
          </div>
          <span className="sidebar-link-text">Executive Dashboard</span>
        </NavLink>

        <div className="sidebar-section-title">16 Finance Submodules</div>
        {FINANCE_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <NavLink
              key={module.path}
              to={module.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={module.name}
              onClick={() => onCloseMobile?.()}
            >
              <div className="sidebar-link-icon">
                <Icon size={18} />
              </div>
              <span className="sidebar-link-text">{module.name}</span>
            </NavLink>
          );
        })}

        {/* Zenve AI Sentinel & Companion Dog Card */}
        <div className="sidebar-mascot-card">
          <div className="mascot-img-container">
            <img
              src="/sidebar-mascot.jpg"
              alt="Zenve Executive Sentinel"
              className="mascot-img"
            />
            <div className="mascot-status-pill">
              <span className="mascot-status-dot" />
              <span>Guardian Active</span>
            </div>
          </div>
          <div className="mascot-info">
            <div className="mascot-name">Zenve Sentinel</div>
            <div className="mascot-desc">AI Risk &amp; Ledger Watchdog</div>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div
          className="user-avatar-wrapper"
          onClick={() => setShowProfileModal(true)}
          title="Click to edit profile"
        >
          {profile.avatarUrl && !imgError ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="user-avatar-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="user-avatar">{profile.displayName?.slice(0, 3).toUpperCase() || 'CFO'}</div>
          )}
          <div className="avatar-edit-overlay" title="Edit Profile">
            <Camera size={10} />
          </div>
        </div>

        <div
          className="user-info"
          onClick={() => setShowProfileModal(true)}
          style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
          title="Click to edit profile"
        >
          <span className="user-name">{profile.displayName || 'CFO'}</span>
          <span className="user-role">{profile.role || 'Finance Admin'}</span>
        </div>

        <div className="footer-actions">
          <button
            type="button"
            className="footer-action-btn"
            onClick={() => setShowProfileModal(true)}
            title="Edit Profile"
            aria-label="Edit Profile"
          >
            <UserCog size={16} />
          </button>
          <button
            type="button"
            className="footer-action-btn logout-btn"
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </aside>
  );
}
