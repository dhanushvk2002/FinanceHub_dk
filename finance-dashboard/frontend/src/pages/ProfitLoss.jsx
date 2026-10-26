import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, ArrowDownRight, FileSpreadsheet } from 'lucide-react';
import { profitLossService } from '../services/profitLossService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function ProfitLoss() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setError(null);
    return profitLossService
      .getReport(selectedPeriod || undefined)
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

  if (loading && !data) return <LoadingState message="Compiling Income Statement (P&L)..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  const exportRows = [
    { LineItem: 'Total Net Revenue', Current: data.totalRevenue, Previous: data.prevRevenue },
    { LineItem: 'Cost of Goods Sold (COGS)', Current: data.costOfGoodsSold, Previous: data.prevCogs },
    { LineItem: 'Gross Profit', Current: data.grossProfit, Previous: data.prevGrossProfit },
    { LineItem: 'Operating Expenses (OPEX)', Current: data.operatingExpenses, Previous: data.prevOpex },
    { LineItem: 'Operating Profit (EBIT)', Current: data.operatingProfit, Previous: '' },
    { LineItem: 'Other Income', Current: data.otherIncome, Previous: '' },
    { LineItem: 'Interest Expense', Current: data.interestExpense, Previous: '' },
    { LineItem: 'Corporate Taxes (21%)', Current: data.taxes, Previous: '' },
    { LineItem: 'Net Profit', Current: data.netProfit, Previous: data.prevNetProfit },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Profit & Loss Statement (P&L)</h1>
          <p className="page-subtitle">
            Comprehensive income statement, gross margins, operational profitability, and period-over-period variance.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={exportRows} filename="profit_loss_statement.csv" />
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Highlights summary */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Gross Margin</span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div className="metric-value">{data.grossMarginPercentage}%</div>
          <div className="metric-footer">
            <span className="metric-subtext">Gross Profit: ${Number(data.grossProfit).toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Operating Margin (EBIT)</span>
            <TrendingUp size={18} color="#2563eb" />
          </div>
          <div className="metric-value">{data.operatingMarginPercentage}%</div>
          <div className="metric-footer">
            <span className="metric-subtext">Operating Profit: ${Number(data.operatingProfit).toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Net Profit Margin</span>
            <TrendingUp size={18} color="#7c3aed" />
          </div>
          <div className="metric-value">{data.netProfitMarginPercentage}%</div>
          <div className="metric-footer">
            <span className="metric-subtext">Net Income: ${Number(data.netProfit).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Income Statement Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} color="#2563eb" />
            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
              Reporting Period: {data.periodName} vs {data.previousPeriodName}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            All calculations computed using server-authoritative BigDecimal rules.
          </div>
        </div>

        <table className="finance-table">
          <thead>
            <tr>
              <th>Financial Statement Line Item</th>
              <th className="amount-header">{data.periodName} (USD)</th>
              <th className="amount-header">{data.previousPeriodName} (USD)</th>
              <th className="amount-header">Delta Variance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Total Gross Revenue & Inflows</td>
              <td className="amount">${Number(data.totalRevenue).toLocaleString()}</td>
              <td className="amount">${Number(data.prevRevenue).toLocaleString()}</td>
              <td className="amount" style={{ color: '#10b981' }}>
                +{data.revenueGrowthPercentage}%
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '28px', color: '#64748b' }}>Less: Cost of Goods Sold (COGS)</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.costOfGoodsSold).toLocaleString()}</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.prevCogs).toLocaleString()}</td>
              <td className="amount" style={{ color: '#64748b' }}>—</td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
              <td>GROSS PROFIT</td>
              <td className="amount">${Number(data.grossProfit).toLocaleString()}</td>
              <td className="amount">${Number(data.prevGrossProfit).toLocaleString()}</td>
              <td className="amount" style={{ color: '#10b981' }}>
                {data.grossMarginPercentage}% margin
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '28px', color: '#64748b' }}>Less: Operating Expenses (OPEX)</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.operatingExpenses).toLocaleString()}</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.prevOpex).toLocaleString()}</td>
              <td className="amount" style={{ color: '#64748b' }}>—</td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
              <td>OPERATING PROFIT (EBIT)</td>
              <td className="amount">${Number(data.operatingProfit).toLocaleString()}</td>
              <td className="amount">—</td>
              <td className="amount" style={{ color: '#2563eb' }}>
                {data.operatingMarginPercentage}% margin
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '28px' }}>Other Income / Treasury Yield</td>
              <td className="amount">+${Number(data.otherIncome).toLocaleString()}</td>
              <td className="amount">—</td>
              <td className="amount">—</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '28px', color: '#64748b' }}>Interest & Debt Servicing</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.interestExpense).toLocaleString()}</td>
              <td className="amount">—</td>
              <td className="amount">—</td>
            </tr>
            <tr>
              <td style={{ paddingLeft: '28px', color: '#64748b' }}>Statutory Corporate Taxes</td>
              <td className="amount" style={{ color: '#ef4444' }}>-${Number(data.taxes).toLocaleString()}</td>
              <td className="amount">—</td>
              <td className="amount">21% Eff.</td>
            </tr>
            <tr style={{ backgroundColor: '#eff6ff', fontWeight: 800, fontSize: '0.9375rem', borderTop: '2px solid #2563eb' }}>
              <td style={{ color: '#1e40af' }}>NET PROFIT (EAT)</td>
              <td className="amount" style={{ color: '#1e40af' }}>${Number(data.netProfit).toLocaleString()}</td>
              <td className="amount" style={{ color: '#1e40af' }}>${Number(data.prevNetProfit).toLocaleString()}</td>
              <td className="amount" style={{ color: '#10b981' }}>
                +{data.netProfitGrowthPercentage}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
