import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { paymentsService } from '../services/paymentsService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function PaymentsSettlement() {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gatewayFilter, setGatewayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    paymentRef: '',
    invoiceRef: '',
    paymentMethod: 'CREDIT_CARD',
    gateway: 'Stripe',
    grossAmount: '',
    gatewayFee: '',
    settlementDate: new Date().toISOString().split('T')[0],
    reconciliationStatus: 'SETTLED',
    currency: 'USD',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      paymentsService.getAll({ gateway: gatewayFilter || undefined, status: statusFilter || undefined }),
      paymentsService.getAnalytics(),
    ])
      .then(([payRes, anaRes]) => {
        setPayments(payRes?.data || []);
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
  }, [gatewayFilter, statusFilter]);

  const handleCreate = (e) => {
    e.preventDefault();
    paymentsService
      .create({
        ...form,
        grossAmount: parseFloat(form.grossAmount),
        gatewayFee: parseFloat(form.gatewayFee || 0),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          paymentRef: '',
          invoiceRef: '',
          paymentMethod: 'CREDIT_CARD',
          gateway: 'Stripe',
          grossAmount: '',
          gatewayFee: '',
          settlementDate: new Date().toISOString().split('T')[0],
          reconciliationStatus: 'SETTLED',
          currency: 'USD',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this payment settlement transaction?')) {
      paymentsService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && payments.length === 0) return <LoadingState message="Reconciling Gateway Settlements..." />;
  if (error && payments.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments &amp; Gateway Settlement</h1>
          <p className="page-subtitle">
            Payment gateway gross processing, fee deductions, net bank payouts, and treasury clearing reconciliation.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={payments} filename="gateway_settlements.csv" />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setForm({
                ...form,
                paymentRef: `PAY-TX-${Math.floor(1000 + Math.random() * 9000)}`,
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> Record Payment
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Gross Volume"
          value={analytics?.totalGrossVolume || 0}
          subtext="Processed via gateways"
          icon={CreditCard}
          colorScheme="blue"
        />
        <MetricCard
          title="Total Gateway Fees"
          value={analytics?.totalGatewayFees || 0}
          subtext="Interchange & processor costs"
          icon={CreditCard}
          colorScheme="rose"
        />
        <MetricCard
          title="Net Settled to Bank"
          value={analytics?.totalSettledAmount || 0}
          isPositive={true}
          subtext="Cleared liquid disbursements"
          icon={CreditCard}
          colorScheme="emerald"
        />
        <MetricCard
          title="Effective Fee Take Rate"
          value={analytics?.averageFeeTakeRatePercentage || 0}
          subtext="Fee percentage of gross volume"
          icon={CreditCard}
          colorScheme="purple"
          prefix=""
          suffix="%"
        />
      </div>

      <div className="table-container">
        <FilterBar
          filters={[
            {
              value: gatewayFilter,
              onChange: setGatewayFilter,
              options: [
                { value: '', label: 'All Gateways' },
                { value: 'Stripe', label: 'Stripe' },
                { value: 'Razorpay', label: 'Razorpay' },
                { value: 'Chase Paymentech', label: 'Chase Paymentech' },
                { value: 'Adyen', label: 'Adyen' },
              ],
            },
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Reconciliation' },
                { value: 'SETTLED', label: 'Settled' },
                { value: 'PENDING', label: 'Pending Settlement' },
                { value: 'DISCREPANCY', label: 'Discrepancy' },
              ],
            },
          ]}
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Payment Ref</th>
              <th>Linked Invoice</th>
              <th>Method</th>
              <th>Gateway</th>
              <th>Settlement Date</th>
              <th className="amount-header">Gross Amount</th>
              <th className="amount-header">Gateway Fee</th>
              <th className="amount-header">Net Settled</th>
              <th>Reconciliation</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: '#2563eb' }}>{p.paymentRef}</td>
                <td>{p.invoiceRef || '—'}</td>
                <td>
                  <span className="badge badge-neutral">{p.paymentMethod}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{p.gateway}</td>
                <td>{p.settlementDate || 'Pending'}</td>
                <td className="amount">${Number(p.grossAmount).toLocaleString()}</td>
                <td className="amount" style={{ color: '#ef4444' }}>
                  -${Number(p.gatewayFee).toLocaleString()}
                </td>
                <td className="amount" style={{ fontWeight: 700, color: '#16a34a' }}>
                  ${Number(p.settlementAmount).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      p.reconciliationStatus === 'SETTLED'
                        ? 'badge-success'
                        : p.reconciliationStatus === 'PENDING'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {p.reconciliationStatus}
                  </span>
                </td>
                <td>
                  <button
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    onClick={() => handleDelete(p.id)}
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
              <h3 className="modal-title">Record Gateway Payment</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Payment Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.paymentRef}
                      onChange={(e) => setForm({ ...form, paymentRef: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Linked Invoice Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. INV-2026-004"
                      value={form.invoiceRef}
                      onChange={(e) => setForm({ ...form, invoiceRef: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    >
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="WIRE_TRANSFER">Wire Transfer</option>
                      <option value="ACH">ACH Direct Debit</option>
                      <option value="UPI">UPI Instant</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Gateway</label>
                    <select
                      className="form-select"
                      value={form.gateway}
                      onChange={(e) => setForm({ ...form, gateway: e.target.value })}
                    >
                      <option value="Stripe">Stripe</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Chase Paymentech">Chase Paymentech</option>
                      <option value="Adyen">Adyen</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gross Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="30000.00"
                      value={form.grossAmount}
                      onChange={(e) => setForm({ ...form, grossAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gateway Fee ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="870.00"
                      value={form.gatewayFee}
                      onChange={(e) => setForm({ ...form, gatewayFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Settlement Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.settlementDate}
                      onChange={(e) => setForm({ ...form, settlementDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reconciliation Status</label>
                    <select
                      className="form-select"
                      value={form.reconciliationStatus}
                      onChange={(e) => setForm({ ...form, reconciliationStatus: e.target.value })}
                    >
                      <option value="SETTLED">Settled in Bank</option>
                      <option value="PENDING">Pending Gateway Clearance</option>
                      <option value="DISCREPANCY">Discrepancy Under Audit</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
