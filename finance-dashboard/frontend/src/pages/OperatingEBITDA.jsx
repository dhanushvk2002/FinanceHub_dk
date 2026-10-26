import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GitCommit, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ebitdaService } from '../services/ebitdaService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function OperatingEBITDA() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setError(null);
    return ebitdaService
      .getEbitda(selectedPeriod || undefined)
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

  if (loading && !data) return <LoadingState message="Calculating Operating EBITDA & Bridge Analysis..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operating EBITDA &amp; Bridge Analysis</h1>
          <p className="page-subtitle">
            Normalized operating earnings before interest, tax, depreciation & amortization with period delta waterfall bridge.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={data.bridgeItems} filename="ebitda_bridge_waterfall.csv" />
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Methodology Disclaimer Callout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px 20px',
          borderRadius: '10px',
          marginBottom: '24px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
        }}
      >
        <Info size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.84rem', color: '#1e3a8a', lineHeight: 1.6 }}>
          <strong>Statutory Governance Note on EBITDA:</strong> Operating EBITDA is defined as{' '}
          <code>Gross Profit − Cash OPEX</code>. It excludes non-cash Depreciation &amp; Amortization ($
          {Number(data.depreciationAndAmortization).toLocaleString()}), financing interest, and income taxes.
          EBITDA represents operating cash generation potential before capital structure decisions and is not identical to GAAP Net Profit or Operating Cash Flow.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Operating EBITDA"
          value={data.operatingEbitda}
          change={data.ebitdaGrowthPercentage}
          isPositive={Number(data.ebitdaGrowthPercentage) >= 0}
          subtext="Current reporting period"
          icon={GitCommit}
          colorScheme="purple"
        />
        <MetricCard
          title="Operating EBITDA Margin"
          value={data.ebitdaMarginPercentage}
          subtext={`${data.ebitdaMarginPercentage}% of gross revenue`}
          icon={GitCommit}
          colorScheme="blue"
          prefix=""
          suffix="%"
        />
        <MetricCard
          title="Period EBITDA Delta"
          value={data.ebitdaVariance}
          isPositive={Number(data.ebitdaVariance) >= 0}
          subtext={`vs Prior Period ($${Number(data.priorPeriodEbitda).toLocaleString()})`}
          icon={GitCommit}
          colorScheme="emerald"
        />
      </div>

      {/* EBITDA Bridge Waterfall Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            EBITDA Variance Bridge: {data.periodName} vs Prior Period
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Waterfall explaining movements from baseline to current performance
          </span>
        </div>
        <table className="finance-table">
          <thead>
            <tr>
              <th>Waterfall Step / Driver Description</th>
              <th>Impact Nature</th>
              <th className="amount-header">Delta Value (USD)</th>
              <th>Variance Context</th>
            </tr>
          </thead>
          <tbody>
            {data.bridgeItems?.map((item, idx) => {
              const impact = Number(item.impact);
              return (
                <tr
                  key={idx}
                  style={
                    item.isSummary
                      ? { backgroundColor: '#f8fafc', fontWeight: 700 }
                      : {}
                  }
                >
                  <td style={{ fontWeight: item.isSummary ? 700 : 500 }}>{item.step}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.type === 'POSITIVE'
                          ? 'badge-success'
                          : item.type === 'NEGATIVE'
                          ? 'badge-danger'
                          : 'badge-neutral'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td
                    className="amount"
                    style={{
                      color:
                        item.type === 'POSITIVE'
                          ? '#16a34a'
                          : item.type === 'NEGATIVE'
                          ? '#dc2626'
                          : '#1e40af',
                      fontWeight: 700,
                    }}
                  >
                    {impact > 0 && !item.isSummary ? '+' : ''}${impact.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {item.isSummary
                      ? 'Reconciled subtotal benchmark'
                      : item.type === 'POSITIVE'
                      ? 'Accretive operating expansion'
                      : 'Operational headwind / strategic investment'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
