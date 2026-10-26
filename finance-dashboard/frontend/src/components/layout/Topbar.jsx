import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

export default function Topbar() {
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
        <div className="breadcrumb-trail">
          <span>FinanceHub</span>
          <span>/</span>
          <span>Financial Suite</span>
          <span>/</span>
          <span className="breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <NotificationDropdown />
      </div>
    </header>
  );
}
