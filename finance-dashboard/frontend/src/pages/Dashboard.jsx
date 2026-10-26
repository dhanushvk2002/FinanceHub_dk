import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Scale,
  Activity,
  FileText,
  FileCheck,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';
import {
  RevenueExpenseTrendChart,
  CashFlowTrendChart,
  CategoryDonutChart,
} from '../components/charts/FinanceCharts';

export default function Dashboard() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setError(null);
    return dashboardService
      .getSummary({ periodId: selectedPeriod || undefined })
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  if (loading && !data) return <LoadingState message="Aggregating executive financial dashboard..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Financial Dashboard</h1>
          <p className="page-subtitle">
            Real-time multi-dimensional financial intelligence, ledger reconciliation, and cash liquidity.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={data.revenueExpenseTrends} filename="executive_financial_trends.csv" />
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* 8 Primary KPI Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Net Revenue"
          value={data.totalRevenue}
          change={12.4}
          isPositive={true}
          subtext="vs previous period"
          icon={DollarSign}
          colorScheme="blue"
        />
        <MetricCard
          title="Operating Expenses"
          value={data.totalExpenses}
          change={-3.2}
          isPositive={false}
          subtext="OPEX burn rate"
          icon={Receipt}
          colorScheme="rose"
        />
        <MetricCard
          title="Gross Profit"
          value={data.grossProfit}
          change={data.grossMarginPercentage}
          isPositive={true}
          subtext={`${data.grossMarginPercentage}% Gross Margin`}
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <MetricCard
          title="Operating EBITDA"
          value={data.operatingEbitda}
          change={data.ebitdaMarginPercentage}
          isPositive={true}
          subtext={`${data.ebitdaMarginPercentage}% EBITDA Margin`}
          icon={Activity}
          colorScheme="purple"
        />
      </div>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <MetricCard
          title="Treasury Cash Balance"
          value={data.cashBalance}
          change={8.5}
          isPositive={true}
          subtext="Bank & liquid reserves"
          icon={Scale}
          colorScheme="emerald"
        />
        <MetricCard
          title="Accounts Receivable (AR)"
          value={data.accountsReceivable}
          change={null}
          subtext="Customer invoice balances"
          icon={FileText}
          colorScheme="blue"
        />
        <MetricCard
          title="Accounts Payable (AP)"
          value={data.accountsPayable}
          change={null}
          subtext="Pending vendor obligations"
          icon={FileCheck}
          colorScheme="amber"
        />
        <MetricCard
          title="Overdue Receivables"
          value={
            data.overdueReceivables?.reduce(
              (acc, r) => acc + (Number(r.outstandingBalance) || 0),
              0
            ) || 0
          }
          isPositive={false}
          subtext="Action required / Aging"
          icon={Receipt}
          colorScheme="rose"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Revenue vs Operating Expenses Trend</h2>
              <p className="card-subtitle">Monthly trajectory comparison with net margin curves</p>
            </div>
            <Link to="/finance/revenue" className="btn btn-secondary btn-sm">
              Explore Inflows <ArrowUpRight size={14} />
            </Link>
          </div>
          <RevenueExpenseTrendChart data={data.revenueExpenseTrends} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Operating Cash Flow & Net Liquidity</h2>
              <p className="card-subtitle">Net monthly cash movement from business activities</p>
            </div>
            <Link to="/finance/cash-flow" className="btn btn-secondary btn-sm">
              Cash Statement <ArrowUpRight size={14} />
            </Link>
          </div>
          <CashFlowTrendChart data={data.cashFlowTrend} />
        </div>
      </div>

      {/* Category Breakdown & Activity Grids */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Revenue Category Allocation</h2>
              <p className="card-subtitle">Product and contract distribution</p>
            </div>
          </div>
          <CategoryDonutChart data={data.revenueBreakdown} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Customer Invoices</h2>
              <p className="card-subtitle">Accounts Receivable ledger</p>
            </div>
            <Link to="/finance/accounts-receivable" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.recentInvoices?.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{inv.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {inv.invoiceNumber} • Due {inv.dueDate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${Number(inv.totalAmount).toLocaleString()}
                  </div>
                  <span
                    className={`badge ${
                      inv.status === 'PAID'
                        ? 'badge-success'
                        : inv.status === 'OVERDUE'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Upcoming Supplier Obligations</h2>
              <p className="card-subtitle">Accounts Payable schedule</p>
            </div>
            <Link to="/finance/accounts-payable" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.upcomingPayables?.map((bill) => (
              <div
                key={bill.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{bill.vendorName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {bill.billNumber} • Due {bill.dueDate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${Number(bill.outstandingBalance).toLocaleString()}
                  </div>
                  <span
                    className={`badge ${
                      bill.status === 'OVERDUE' ? 'badge-danger' : 'badge-neutral'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
