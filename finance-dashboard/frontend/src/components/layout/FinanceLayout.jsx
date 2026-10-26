import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function FinanceLayout() {
  const [selectedPeriod, setSelectedPeriod] = useState(4); // Default to Q4-2026 (id=4)
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`app-container ${isCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <div className="main-content">
        <Topbar
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="page-container">
          <Outlet context={{ selectedPeriod }} />
        </main>
      </div>
    </div>
  );
}
