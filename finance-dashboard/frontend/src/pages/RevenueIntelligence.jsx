import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Plus, Trash2, PieChart } from 'lucide-react';
import { revenueService } from '../services/revenueService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';
import { CategoryDonutChart } from '../components/charts/FinanceCharts';

export default function RevenueIntelligence() {
  const { selectedPeriod } = useOutletContext();
  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    productCategory: 'Enterprise SaaS',
    channel: 'Direct Sales',
    transactionDate: new Date().toISOString().split('T')[0],
    unitsSold: 1,
    unitPrice: '',
    discountAmount: 0,
    currency: 'USD',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      revenueService.getAll({ periodId: selectedPeriod || undefined, search: search || undefined }),
      revenueService.getAnalytics(selectedPeriod || undefined),
    ])
      .then(([recRes, anaRes]) => {
        setRecords(recRes?.data || []);
        setAnalytics(anaRes?.data || null);
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
  }, [selectedPeriod, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    revenueService
      .create({
        ...form,
        unitsSold: parseInt(form.unitsSold, 10),
        unitPrice: parseFloat(form.unitPrice),
        discountAmount: parseFloat(form.discountAmount || 0),
        period: selectedPeriod ? { id: selectedPeriod } : null,
      })
      .then(() => {
        setShowModal(false);
        setForm({
          customerName: '',
          productCategory: 'Enterprise SaaS',
          channel: 'Direct Sales',
          transactionDate: new Date().toISOString().split('T')[0],
          unitsSold: 1,
          unitPrice: '',
          discountAmount: 0,
          currency: 'USD',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this revenue entry?')) {
      revenueService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && records.length === 0) return <LoadingState message="Loading revenue intelligence records..." />;
  if (error && records.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  const donutData =
    analytics?.categoryBreakdown?.map((c) => ({
      name: c.category,
      value: Number(c.total),
    })) || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Revenue Intelligence & Inflows</h1>
          <p className="page-subtitle">
            Customer recurring revenues, contract channels, monetization segments & inflow tracking.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={records} filename="revenue_intelligence.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Record Revenue
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Net Inflows"
          value={analytics?.totalRevenue || 0}
          change={12.4}
          isPositive={true}
          subtext="Net recognized revenue"
          icon={DollarSign}
          colorScheme="blue"
        />
        <MetricCard
          title="Active Revenue Contracts"
          value={records.length}
          subtext="Enterprise clients billed"
          icon={DollarSign}
          colorScheme="emerald"
          prefix=""
        />
        <MetricCard
          title="Average Deal Size (ACV)"
          value={
            records.length > 0 && analytics?.totalRevenue
              ? Number(analytics.totalRevenue) / records.length
              : 0
          }
          subtext="Per enterprise invoice"
          icon={DollarSign}
          colorScheme="purple"
        />
      </div>

      {/* Category breakdown visual */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Revenue by Product Category</h2>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Portfolio weighting</span>
          </div>
          <CategoryDonutChart data={donutData} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Channel Distribution</h2>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Inflow route breakdown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            {analytics?.channelBreakdown?.map((c, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>{c.channel}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ${Number(c.total).toLocaleString()}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: idx === 0 ? '#2563eb' : idx === 1 ? '#10b981' : '#f59e0b',
                      width: `${Math.min(
                        100,
                        (Number(c.total) / (Number(analytics.totalRevenue) || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search customer name..."
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Product Category</th>
              <th>Channel</th>
              <th className="amount-header">Units</th>
              <th className="amount-header">Unit Price</th>
              <th className="amount-header">Discount</th>
              <th className="amount-header">Net Amount</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.transactionDate}</td>
                <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                <td>
                  <span className="badge badge-neutral">{r.productCategory}</span>
                </td>
                <td>{r.channel}</td>
                <td className="amount">{r.unitsSold}</td>
                <td className="amount">${Number(r.unitPrice).toLocaleString()}</td>
                <td className="amount" style={{ color: '#ef4444' }}>
                  {Number(r.discountAmount) > 0 ? `-$${Number(r.discountAmount).toLocaleString()}` : '$0'}
                </td>
                <td className="amount" style={{ color: '#16a34a' }}>
                  ${Number(r.netAmount).toLocaleString()}
                </td>
                <td>
                  <button
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Revenue Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Revenue Inflow</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer / Client Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Acme Global Corporation"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Category</label>
                    <select
                      className="form-select"
                      value={form.productCategory}
                      onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                    >
                      <option value="Enterprise SaaS">Enterprise SaaS</option>
                      <option value="API Infrastructure">API Infrastructure</option>
                      <option value="Consulting & Setup">Consulting & Setup</option>
                      <option value="Data Compliance Suite">Data Compliance Suite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sales Channel</label>
                    <select
                      className="form-select"
                      value={form.channel}
                      onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    >
                      <option value="Direct Sales">Direct Sales</option>
                      <option value="Partner">Partner</option>
                      <option value="Online">Online</option>
                      <option value="Reseller">Reseller</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Units Sold</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      required
                      value={form.unitsSold}
                      onChange={(e) => setForm({ ...form, unitsSold: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="15000.00"
                      value={form.unitPrice}
                      onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={form.discountAmount}
                      onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transaction Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.transactionDate}
                      onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Inflow Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
