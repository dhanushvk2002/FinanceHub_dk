import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function FinanceLayout() {
  const [selectedPeriod, setSelectedPeriod] = useState(4); // Default to Q4-2026 (id=4)

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <main className="page-container">
          <Outlet context={{ selectedPeriod }} />
        </main>
      </div>
    </div>
  );
}
