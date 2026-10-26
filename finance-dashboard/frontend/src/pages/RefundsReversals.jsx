import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { refundsService } from '../services/refundsService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function RefundsReversals() {
  const [refunds, setRefunds] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    refundId: '',
    originalPaymentRef: '',
    customerName: '',
    refundAmount: '',
    reason: '',
    processingStatus: 'COMPLETED',
    processedDate: new Date().toISOString().split('T')[0],
    gatewayRefundRef: '',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      refundsService.getAll({ status: statusFilter || undefined }),
      refundsService.getAnalytics(),
    ])
      .then(([refRes, anaRes]) => {
        setRefunds(refRes?.data || []);
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
  }, [statusFilter]);

  const handleCreate = (e) => {
    e.preventDefault();
    refundsService
      .create({
        ...form,
        refundAmount: parseFloat(form.refundAmount),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          refundId: '',
          originalPaymentRef: '',
          customerName: '',
          refundAmount: '',
          reason: '',
          processingStatus: 'COMPLETED',
          processedDate: new Date().toISOString().split('T')[0],
          gatewayRefundRef: '',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this refund ledger entry? (Audit trail will log deletion)')) {
      refundsService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && refunds.length === 0) return <LoadingState message="Auditing Refunds & Reversals Ledger..." />;
  if (error && refunds.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Refunds &amp; Reversals Ledger</h1>
          <p className="page-subtitle">
            Payment clawbacks, subscription pro-rata adjustments, reversal references & duplicate protection audit log.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={refunds} filename="refunds_reversals_ledger.csv" />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setForm({
                ...form,
                refundId: `REF-${Math.floor(100 + Math.random() * 900)}`,
                gatewayRefundRef: `STR-REF-${Math.floor(1000 + Math.random() * 9000)}`,
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> Process Reversal
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Reversals & Refunds"
          value={analytics?.totalRefundedAmount || 0}
          isPositive={false}
          subtext="Net capital refunded"
          icon={RotateCcw}
          colorScheme="rose"
        />
        <MetricCard
          title="Completed Refunds"
          value={analytics?.totalRefundsProcessed || 0}
          subtext="Cleared through payment gateway"
          icon={RotateCcw}
          colorScheme="emerald"
          prefix=""
        />
        <MetricCard
          title="Pending Authorization"
          value={analytics?.pendingRefundRequests || 0}
          subtext="Awaiting secondary finance sign-off"
          icon={RotateCcw}
          colorScheme="amber"
          prefix=""
        />
      </div>

      <div className="table-container">
        <FilterBar
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Statuses' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'PROCESSING', label: 'Processing' },
                { value: 'INITIATED', label: 'Initiated' },
              ],
            },
          ]}
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Refund ID</th>
              <th>Original Payment Ref</th>
              <th>Customer Name</th>
              <th>Processed Date</th>
              <th>Reason &amp; Documentation</th>
              <th className="amount-header">Refund Amount</th>
              <th>Gateway Reversal Ref</th>
              <th>Status</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: '#dc2626' }}>{r.refundId}</td>
                <td style={{ color: '#2563eb', fontWeight: 500 }}>{r.originalPaymentRef}</td>
                <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                <td>{r.processedDate}</td>
                <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>{r.reason}</td>
                <td className="amount" style={{ color: '#dc2626', fontWeight: 700 }}>
                  -${Number(r.refundAmount).toLocaleString()}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {r.gatewayRefundRef || '—'}
                </td>
                <td>
                  <span
                    className={`badge ${
                      r.processingStatus === 'COMPLETED'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {r.processingStatus}
                  </span>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Reversal / Refund Request</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Refund ID</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.refundId}
                      onChange={(e) => setForm({ ...form, refundId: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Payment Ref</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. PAY-TX-8821"
                      value={form.originalPaymentRef}
                      onChange={(e) => setForm({ ...form, originalPaymentRef: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Alpha Ventures"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Refund Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="2200.00"
                      value={form.refundAmount}
                      onChange={(e) => setForm({ ...form, refundAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Justification / Reason</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Pro-rata subscription downgrade requested by customer"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Processed Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.processedDate}
                      onChange={(e) => setForm({ ...form, processedDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gateway Reversal Ref</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.gatewayRefundRef}
                      onChange={(e) => setForm({ ...form, gatewayRefundRef: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Process &amp; Record Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
