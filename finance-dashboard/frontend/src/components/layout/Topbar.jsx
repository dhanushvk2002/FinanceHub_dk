import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Calendar,
  Layers,
  Database,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../../context/ThemeContext';
import { periodService } from '../../services/periodService';

const ROUTE_INFO_MAP = {
  '/dashboard': { title: 'Executive Financial Dashboard', category: 'Overview', tag: 'KPI' },
  '/finance/profit-loss': { title: 'Profit & Loss Statement (P&L)', category: 'Core Statements', tag: 'P&L' },
  '/finance/balance-sheet': { title: 'Balance Sheet & Capital', category: 'Core Statements', tag: 'BS' },
  '/finance/cash-flow': { title: 'Cash Flow Statement & Liquidity', category: 'Core Statements', tag: 'CF' },
  '/finance/ebitda': { title: 'Operating EBITDA & Bridge', category: 'Core Statements', tag: 'EBITDA' },
  '/finance/revenue': { title: 'Revenue Intelligence & Inflows', category: 'Revenue & Margins', tag: 'REV' },
  '/finance/gross-profit': { title: 'Gross Profit & Unit Economics', category: 'Revenue & Margins', tag: 'GP' },
  '/finance/cogs': { title: 'Cost of Goods Sold (COGS)', category: 'Revenue & Margins', tag: 'COGS' },
  '/finance/operating-expenses': { title: 'Operating Expenses (OPEX)', category: 'Revenue & Margins', tag: 'OPEX' },
  '/finance/accounts-receivable': { title: 'Accounts Receivable (AR)', category: 'Working Capital', tag: 'AR' },
  '/finance/accounts-payable': { title: 'Accounts Payable (AP)', category: 'Working Capital', tag: 'AP' },
  '/finance/payments': { title: 'Payments & Gateway Settlement', category: 'Working Capital', tag: 'PAY' },
  '/finance/refunds': { title: 'Refunds & Reversals Ledger', category: 'Working Capital', tag: 'REF' },
  '/finance/gst-invoices': { title: 'GST Tax Invoices Register', category: 'Tax & Planning', tag: 'GST' },
  '/finance/tax-compliance': { title: 'Statutory Tax Compliance', category: 'Tax & Planning', tag: 'TAX' },
  '/finance/forecasting': { title: 'Financial Forecasting & Models', category: 'Tax & Planning', tag: 'FCST' },
  '/finance/breakeven': { title: 'Breakeven Analysis & Costs', category: 'Tax & Planning', tag: 'BEP' },
};

export default function Topbar({
  selectedPeriod,
  onPeriodChange,
  isCollapsed,
  onToggleCollapse,
}) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [periods, setPeriods] = useState([
    { id: 4, periodName: 'Q4-2026 (Oct - Dec 2026)' },
    { id: 3, periodName: 'Q3-2026 (Jul - Sep 2026)' },
    { id: 2, periodName: 'Q2-2026 (Apr - Jun 2026)' },
    { id: 1, periodName: 'Q1-2026 (Jan - Mar 2026)' },
  ]);

  useEffect(() => {
    periodService
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setPeriods(res.data);
        }
      })
      .catch(() => {
        // Fallback already pre-populated
      });
  }, []);

  const routeMeta = ROUTE_INFO_MAP[location.pathname] || {
    title: 'Financial Module',
    category: 'FinanceHub',
    tag: 'FIN',
  };

  return (
    <header className="topbar">
      {/* Left: Collapse toggle + Modern Breadcrumb */}
      <div className="topbar-left">
        <button
          className="topbar-sidebar-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <div className="breadcrumb-trail">
          <Link to="/dashboard" className="breadcrumb-root">
            FinanceHub
          </Link>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-category">{routeMeta.category}</span>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{routeMeta.title}</span>
          <span className="breadcrumb-tag">{routeMeta.tag}</span>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="topbar-right">
        {/* Live System Health Badge */}
        <div className="topbar-status-badge" title="Database Synced & Audited">
          <span className="status-ping" />
          <span className="status-text">Live Ledger • FY26</span>
        </div>

        {/* Global Financial Period Selector */}
        <div className="topbar-period-selector" title="Select Global Financial Period">
          <Calendar size={15} className="period-icon" />
          <select
            value={selectedPeriod || ''}
            onChange={(e) => onPeriodChange(Number(e.target.value) || '')}
            className="period-select-field"
            aria-label="Select Financial Period"
          >
            <option value="">Full Fiscal Year 2026</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.periodName}
              </option>
            ))}
          </select>
        </div>

        {/* Dark/Light Theme Switcher */}
        <button
          className="topbar-action-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="theme-icon sun-icon" />
          ) : (
            <Moon size={17} className="theme-icon moon-icon" />
          )}
        </button>

        {/* Audit Notifications */}
        <NotificationDropdown />
      </div>
    </header>
  );
}
