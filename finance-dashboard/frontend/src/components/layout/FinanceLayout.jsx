import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function FinanceLayout() {
  const [selectedPeriod, setSelectedPeriod] = useState(4); // Default to Q4-2026 (id=4)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close mobile navigation"
        />
      )}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="main-content">
        {/* Luxury Background Watermark & Ambient Glow */}
        <div className="financehub-ambient-backdrop" aria-hidden="true">
          <div className="ambient-radial-glow top-right" />
          <div className="ambient-radial-glow bottom-left" />
          <img
            src="/financehub-gold-logo.jpg"
            alt=""
            className="financehub-watermark-logo"
          />
        </div>
        <Topbar
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="page-container">
          <Outlet context={{ selectedPeriod }} />
        </main>
      </div>
    </div>
  );
}
