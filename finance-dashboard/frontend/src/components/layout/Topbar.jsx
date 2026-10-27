import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Topbar({ onToggleMobileSidebar }) {
  const location = useLocation();

  // Format breadcrumb title
  const currentPath = location.pathname;
  let pageTitle = 'Executive Dashboard';
  if (currentPath.includes('/finance/')) {
    const slug = currentPath.replace('/finance/', '');
    pageTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-toggle-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb-trail">
          <span className="breadcrumb-hide-mobile">FinanceHub</span>
          <span className="breadcrumb-hide-mobile">/</span>
          <span className="breadcrumb-hide-mobile">Financial Suite</span>
          <span className="breadcrumb-hide-mobile">/</span>
          <span className="breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <NotificationDropdown />
      </div>
    </header>
  );
}
