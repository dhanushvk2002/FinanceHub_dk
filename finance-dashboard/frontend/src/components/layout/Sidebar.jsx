import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Landmark,
} from 'lucide-react';

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

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-info">
          <div className="brand-logo-icon">
            <Landmark size={20} />
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <span className="brand-title">FinanceHub</span>
              <span className="brand-tag">Enterprise ERP</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Overview</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title="Executive Dashboard"
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
            >
              <div className="sidebar-link-icon">
                <Icon size={18} />
              </div>
              <span className="sidebar-link-text">{module.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar">CFO</div>
        {!isCollapsed && (
          <div className="user-info">
            <span className="user-name">Chief Financial Officer</span>
            <span className="user-role">Finance Admin • FY26</span>
          </div>
        )}
      </div>
    </aside>
  );
}
