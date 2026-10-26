import React, { useState, useEffect } from 'react';
import { FileCheck, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { payablesService } from '../services/payablesService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function AccountsPayable() {
  const [bills, setBills] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    billNumber: '',
    vendorName: '',
    vendorCategory: 'Direct Materials COGS',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalAmount: '',
    amountPaid: '0.00',
    paymentTerms: 'Net 30',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      payablesService.getAll({ status: statusFilter || undefined, search: search || undefined }),
      payablesService.getAnalytics(),
    ])
      .then(([billRes, anaRes]) => {
        setBills(billRes?.data || []);
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
  }, [statusFilter, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    payablesService
      .create({
        ...form,
        totalAmount: parseFloat(form.totalAmount),
        amountPaid: parseFloat(form.amountPaid || 0),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          billNumber: '',
          vendorName: '',
          vendorCategory: 'Direct Materials COGS',
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalAmount: '',
          amountPaid: '0.00',
          paymentTerms: 'Net 30',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleMarkPaid = (bill) => {
    payablesService
      .update(bill.id, {
        ...bill,
        amountPaid: bill.totalAmount,
        status: 'PAID',
      })
      .then(loadData)
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this supplier bill obligation?')) {
      payablesService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && bills.length === 0) return <LoadingState message="Fetching Accounts Payable commitments..." />;
  if (error && bills.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounts Payable (AP)</h1>
          <p className="page-subtitle">
            Vendor liabilities, procurement commitments, credit term management, and upcoming payment obligations.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={bills} filename="accounts_payable.csv" />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setForm({
                ...form,
                billNumber: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> New Supplier Bill
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* AP Metrics */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total AP Liability"
          value={analytics?.totalOutstanding || 0}
          subtext="Net pending vendor obligations"
          icon={FileCheck}
          colorScheme="amber"
        />
        <MetricCard
          title="Upcoming in 7 Days"
          value={analytics?.upcomingObligations || 0}
          subtext="Scheduled treasury disbursement"
          icon={FileCheck}
          colorScheme="purple"
        />
        <MetricCard
          title="Past-Due Bills (Overdue)"
          value={analytics?.totalOverdue || 0}
          isPositive={false}
          subtext="Requires prompt settlement"
          icon={FileCheck}
          colorScheme="rose"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search vendor name..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'OVERDUE', label: 'Overdue' },
                { value: 'PAID', label: 'Paid' },
              ],
            },
          ]}
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Bill #</th>
              <th>Vendor Name</th>
              <th>Category</th>
              <th>Bill Date</th>
              <th>Due Date</th>
              <th>Terms</th>
              <th className="amount-header">Total Amount</th>
              <th className="amount-header">Paid</th>
              <th className="amount-header">Balance Due</th>
              <th>Status</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600, color: '#2563eb' }}>{b.billNumber}</td>
                <td style={{ fontWeight: 600 }}>{b.vendorName}</td>
                <td>
                  <span className="badge badge-neutral">{b.vendorCategory}</span>
                </td>
                <td>{b.billDate}</td>
                <td>{b.dueDate}</td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.paymentTerms}</td>
                <td className="amount">${Number(b.totalAmount).toLocaleString()}</td>
                <td className="amount" style={{ color: '#16a34a' }}>
                  ${Number(b.amountPaid).toLocaleString()}
                </td>
                <td className="amount" style={{ fontWeight: 700, color: Number(b.outstandingBalance) > 0 ? '#ef4444' : '#64748b' }}>
                  ${Number(b.outstandingBalance).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      b.status === 'PAID'
                        ? 'badge-success'
                        : b.status === 'OVERDUE'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {b.status !== 'PAID' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 6px' }}
                        onClick={() => handleMarkPaid(b)}
                        title="Mark Settled"
                      >
                        <CheckCircle2 size={13} color="#16a34a" />
                      </button>
                    )}
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                      onClick={() => handleDelete(b.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Bill Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Supplier AP Bill</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bill Number</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.billNumber}
                      onChange={(e) => setForm({ ...form, billNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vendor Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. NVIDIA Enterprise hardware"
                      value={form.vendorName}
                      onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vendor Category</label>
                    <select
                      className="form-select"
                      value={form.vendorCategory}
                      onChange={(e) => setForm({ ...form, vendorCategory: e.target.value })}
                    >
                      <option value="Direct Materials COGS">Direct Materials COGS</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="Office Leases">Office Leases</option>
                      <option value="Legal Services">Legal Services</option>
                      <option value="Payroll & HR">Payroll & HR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Terms</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.paymentTerms}
                      onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="45000.00"
                      value={form.totalAmount}
                      onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Paid Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={form.amountPaid}
                      onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bill Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.billDate}
                      onChange={(e) => setForm({ ...form, billDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Supplier Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
