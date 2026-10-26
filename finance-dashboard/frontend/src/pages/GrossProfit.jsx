import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PieChart, TrendingUp, Layers, CheckCircle } from 'lucide-react';
import { grossProfitService } from '../services/grossProfitService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function GrossProfit() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setError(null);
    return grossProfitService
      .getGrossProfit(selectedPeriod || undefined)
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

  if (loading && !data) return <LoadingState message="Modeling Unit Economics & Contribution Margins..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gross Profit & Unit Economics</h1>
          <p className="page-subtitle">
            Product-level gross margin analysis, Average Revenue Per Unit (ARPU), variable cost economics & contribution margin ratios.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={data.productEconomics} filename="unit_economics_analysis.csv" />
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Top 4 Economics KPIs */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
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
          title="Average Revenue Per Unit (ARPU)"
          value={data.averageRevenuePerUnit}
          subtext="Blended average sale price"
          icon={Layers}
          colorScheme="blue"
        />
        <MetricCard
          title="Average Cost Per Unit"
          value={data.averageCostPerUnit}
          subtext="Blended variable COGS per unit"
          icon={Layers}
          colorScheme="rose"
        />
        <MetricCard
          title="Contribution Margin / Unit"
          value={data.contributionMarginPerUnit}
          change={data.contributionMarginRatio}
          isPositive={true}
          subtext={`${data.contributionMarginRatio}% CM Ratio`}
          icon={PieChart}
          colorScheme="purple"
        />
      </div>

      {/* Product-level unit economics breakdown */}
      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            Product Line Unit Economics Breakdown
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Contribution Margin = Unit Price - Unit Variable COGS
          </span>
        </div>
        <table className="finance-table">
          <thead>
            <tr>
              <th>Product Line / Category</th>
              <th className="amount-header">Units Billed</th>
              <th className="amount-header">Unit Selling Price</th>
              <th className="amount-header">Allocated COGS</th>
              <th className="amount-header">Total Gross Revenue</th>
              <th className="amount-header">Gross Profit</th>
              <th className="amount-header">Gross Margin %</th>
              <th>Economic Health</th>
            </tr>
          </thead>
          <tbody>
            {data.productEconomics?.map((item, idx) => {
              const margin = Number(item.grossMarginPercentage);
              const isHealthy = margin >= 40;
              return (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{item.productCategory}</td>
                  <td className="amount">{item.unitsSold}</td>
                  <td className="amount">${Number(item.unitPrice).toLocaleString()}</td>
                  <td className="amount" style={{ color: '#ef4444' }}>
                    -${Number(item.cogs).toLocaleString()}
                  </td>
                  <td className="amount" style={{ fontWeight: 600 }}>
                    ${Number(item.revenue).toLocaleString()}
                  </td>
                  <td className="amount" style={{ fontWeight: 700, color: '#16a34a' }}>
                    ${Number(item.grossProfit).toLocaleString()}
                  </td>
                  <td className="amount" style={{ fontWeight: 700, color: isHealthy ? '#16a34a' : '#f59e0b' }}>
                    {margin.toFixed(1)}%
                  </td>
                  <td>
                    <span className={`badge ${isHealthy ? 'badge-success' : 'badge-warning'}`}>
                      {isHealthy ? 'Strong Unit Economics' : 'Review Pricing / Variable Cost'}
                    </span>
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
