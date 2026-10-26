import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cashFlowService } from '../services/cashFlowService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function CashFlow() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    activityType: 'OPERATING',
    itemDescription: '',
    cashInflow: '',
    cashOutflow: '',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  const loadData = () => {
    setError(null);
    return cashFlowService
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

  const handleCreate = (e) => {
    e.preventDefault();
    cashFlowService
      .createRecord({
        ...form,
        cashInflow: form.cashInflow ? parseFloat(form.cashInflow) : 0,
        cashOutflow: form.cashOutflow ? parseFloat(form.cashOutflow) : 0,
        period: selectedPeriod ? { id: selectedPeriod } : null,
      })
      .then(() => {
        setShowModal(false);
        setForm({
          activityType: 'OPERATING',
          itemDescription: '',
          cashInflow: '',
          cashOutflow: '',
          transactionDate: new Date().toISOString().split('T')[0],
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this cash flow movement record?')) {
      cashFlowService.deleteRecord(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && !data) return <LoadingState message="Reconciling Cash Flow & Liquidity Movements..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cash Flow Statement & Liquidity</h1>
          <p className="page-subtitle">
            Operating, Investing & Financing Cash Trajectory, Treasury Opening/Closing Reserves.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={data.records} filename="cash_flow_statement.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Cash Movement
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Liquidity Overview */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Opening Cash Reserve"
          value={data.openingCashBalance}
          subtext="Period initial liquidity"
          icon={Activity}
          colorScheme="blue"
        />
        <MetricCard
          title="Net Cash Movement"
          value={data.netCashFlow}
          isPositive={Number(data.netCashFlow) >= 0}
          change={Number(data.netCashFlow) >= 0 ? 14.8 : -5.2}
          subtext="Operating + Investing + Financing"
          icon={Activity}
          colorScheme={Number(data.netCashFlow) >= 0 ? 'emerald' : 'rose'}
        />
        <MetricCard
          title="Closing Cash Position"
          value={data.closingCashBalance}
          isPositive={true}
          subtext="Opening Cash + Net Movement"
          icon={Activity}
          colorScheme="purple"
        />
      </div>

      {/* Cash Flow Activities breakdown */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Operating Activities</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#16a34a' }}>
              ${Number(data.operatingCashFlow).toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Cash receipts from customers less operational and payroll disbursements.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Investing Activities</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#dc2626' }}>
              ${Number(data.investingCashFlow).toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Capital expenditure for lab hardware, server infrastructure, and IP patents.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Financing Activities</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#2563eb' }}>
              ${Number(data.financingCashFlow).toLocaleString()}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Debt servicing, equity financing, and shareholder capital movements.
          </p>
        </div>
      </div>

      {/* Cash Flow Records Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            Detailed Cash Movement Journal ({data.records?.length || 0} Records)
          </span>
        </div>
        <table className="finance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity Classification</th>
              <th>Description</th>
              <th className="amount-header">Cash Inflow</th>
              <th className="amount-header">Cash Outflow</th>
              <th className="amount-header">Net Impact</th>
              <th style={{ width: 60 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.records?.map((r) => {
              const isPositive = Number(r.netMovement) >= 0;
              return (
                <tr key={r.id}>
                  <td>{r.transactionDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.activityType === 'OPERATING'
                          ? 'badge-success'
                          : r.activityType === 'INVESTING'
                          ? 'badge-danger'
                          : 'badge-neutral'
                      }`}
                    >
                      {r.activityType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.itemDescription}</td>
                  <td className="amount" style={{ color: '#16a34a' }}>
                    {Number(r.cashInflow) > 0 ? `+$${Number(r.cashInflow).toLocaleString()}` : '—'}
                  </td>
                  <td className="amount" style={{ color: '#dc2626' }}>
                    {Number(r.cashOutflow) > 0 ? `-$${Number(r.cashOutflow).toLocaleString()}` : '—'}
                  </td>
                  <td className="amount" style={{ color: isPositive ? '#16a34a' : '#dc2626' }}>
                    {isPositive ? '+' : ''}${Number(r.netMovement).toLocaleString()}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Cash Flow Movement</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    value={form.activityType}
                    onChange={(e) => setForm({ ...form, activityType: e.target.value })}
                  >
                    <option value="OPERATING">Operating Activity</option>
                    <option value="INVESTING">Investing Activity (CapEx)</option>
                    <option value="FINANCING">Financing Activity</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Item Description</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Enterprise Client Quarterly Subscription Inflow"
                    value={form.itemDescription}
                    onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cash Inflow ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="0.00"
                      value={form.cashInflow}
                      onChange={(e) => setForm({ ...form, cashInflow: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cash Outflow ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="0.00"
                      value={form.cashOutflow}
                      onChange={(e) => setForm({ ...form, cashOutflow: e.target.value })}
                    />
                  </div>
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Cash Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
