import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Search,
  X,
  Sparkles,
} from 'lucide-react';

export const FINANCE_SECTIONS = [
  {
    category: 'Core Statements',
    modules: [
      { name: 'Profit & Loss (P&L)', tag: 'P&L', path: '/finance/profit-loss', icon: TrendingUp },
      { name: 'Balance Sheet', tag: 'BS', path: '/finance/balance-sheet', icon: Scale },
      { name: 'Cash Flow & Liquidity', tag: 'CF', path: '/finance/cash-flow', icon: Activity },
      { name: 'Operating EBITDA', tag: 'EBITDA', path: '/finance/ebitda', icon: GitCommit },
    ],
  },
  {
    category: 'Revenue & Margins',
    modules: [
      { name: 'Revenue Intelligence', tag: 'REV', path: '/finance/revenue', icon: DollarSign },
      { name: 'Gross Profit & Units', tag: 'GP', path: '/finance/gross-profit', icon: PieChart },
      { name: 'Cost of Goods (COGS)', tag: 'COGS', path: '/finance/cogs', icon: Boxes },
      { name: 'Operating Expenses', tag: 'OPEX', path: '/finance/operating-expenses', icon: Receipt },
    ],
  },
  {
    category: 'Working Capital',
    modules: [
      { name: 'Accounts Receivable', tag: 'AR', path: '/finance/accounts-receivable', icon: FileText },
      { name: 'Accounts Payable', tag: 'AP', path: '/finance/accounts-payable', icon: FileCheck },
      { name: 'Payments & Settlement', tag: 'PAY', path: '/finance/payments', icon: CreditCard },
      { name: 'Refunds & Reversals', tag: 'REF', path: '/finance/refunds', icon: RotateCcw },
    ],
  },
  {
    category: 'Tax & Planning',
    modules: [
      { name: 'GST Tax Invoices', tag: 'GST', path: '/finance/gst-invoices', icon: Percent },
      { name: 'Statutory Compliance', tag: 'TAX', path: '/finance/tax-compliance', icon: ShieldAlert },
      { name: 'Financial Forecasting', tag: 'FCST', path: '/finance/forecasting', icon: LineChart },
      { name: 'Breakeven Analysis', tag: 'BEP', path: '/finance/breakeven', icon: Target },
    ],
  },
];

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  // Filter 16 modules in real-time
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return FINANCE_SECTIONS;
    const term = searchTerm.toLowerCase().trim();
    return FINANCE_SECTIONS.map((section) => ({
      ...section,
      modules: section.modules.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.tag.toLowerCase().includes(term) ||
          m.path.toLowerCase().includes(term)
      ),
    })).filter((section) => section.modules.length > 0);
  }, [searchTerm]);

  const totalFilteredCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.modules.length, 0);
  }, [filteredSections]);

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-info">
          <div className="brand-logo-icon">
            <Landmark size={20} />
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <div className="brand-title-wrap">
                <span className="brand-title">FinanceHub</span>
                <span className="brand-badge-live">LIVE</span>
              </div>
              <span className="brand-tag">Enterprise ERP • 16 Modules</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
      </div>

      {/* Module Filter / Search Bar in Sidebar */}
      {!isCollapsed && (
        <div className="sidebar-search-container">
          <div className="sidebar-search-box">
            <Search size={14} className="sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search 16 modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
            />
            {searchTerm && (
              <button
                className="sidebar-search-clear"
                onClick={() => setSearchTerm('')}
                title="Clear filter"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {/* Executive Dashboard Link */}
        {(!searchTerm || 'executive dashboard'.includes(searchTerm.toLowerCase())) && (
          <div className="sidebar-group">
            <div className="sidebar-section-title">
              <span>Overview</span>
            </div>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title="Executive Dashboard"
            >
              <div className="sidebar-link-icon">
                <LayoutDashboard size={18} />
              </div>
              <span className="sidebar-link-text">Executive Dashboard</span>
              <span className="module-tag-badge">KPI</span>
            </NavLink>
          </div>
        )}

        {/* 16 Finance Submodules Grouped Elegantly */}
        {filteredSections.map((section) => (
          <div key={section.category} className="sidebar-group">
            <div className="sidebar-section-title">
              <span>{section.category}</span>
              <span className="section-count">{section.modules.length}</span>
            </div>
            {section.modules.map((module) => {
              const Icon = module.icon;
              return (
                <NavLink
                  key={module.path}
                  to={module.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  title={`${module.name} (${module.tag})`}
                >
                  <div className="sidebar-link-icon">
                    <Icon size={17} />
                  </div>
                  <span className="sidebar-link-text">{module.name}</span>
                  <span className="module-tag-badge">{module.tag}</span>
                </NavLink>
              );
            })}
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="sidebar-empty-search">
            <p>No modules match "{searchTerm}"</p>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Reset Search
            </button>
          </div>
        )}
      </nav>

      {/* User Footer / Profile */}
      <div className="sidebar-footer">
        <div className="user-avatar-wrap">
          <div className="user-avatar">DV</div>
          <span className="user-status-dot" title="Online & Synced" />
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <span className="user-name">Dhanush V</span>
            <span className="user-role">Finance Lead • Admin</span>
          </div>
        )}
      </div>
    </aside>
  );
}
