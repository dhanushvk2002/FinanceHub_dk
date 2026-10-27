import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { receivablesService } from '../services/receivablesService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function AccountsReceivable() {
  const [invoices, setInvoices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: '',
    customerName: '',
    customerEmail: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalAmount: '',
    amountPaid: '0.00',
    notes: '',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      receivablesService.getAll({ status: statusFilter || undefined, search: search || undefined }),
      receivablesService.getAnalytics(),
    ])
      .then(([invRes, anaRes]) => {
        setInvoices(invRes?.data || []);
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
    receivablesService
      .create({
        ...form,
        totalAmount: parseFloat(form.totalAmount),
        amountPaid: parseFloat(form.amountPaid || 0),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          invoiceNumber: '',
          customerName: '',
          customerEmail: '',
          invoiceDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalAmount: '',
          amountPaid: '0.00',
          notes: '',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleMarkPaid = (inv) => {
    receivablesService
      .update(inv.id, {
        ...inv,
        amountPaid: inv.totalAmount,
      })
      .then(loadData)
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer invoice?')) {
      receivablesService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && invoices.length === 0) return <LoadingState message="Fetching Accounts Receivable ledger..." />;
  if (error && invoices.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Accounts Receivable (AR)</h1>
          <p className="page-subtitle">
            Customer invoice aging, collections tracking, credit terms, and cash realization.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={invoices} filename="accounts_receivable.csv" />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setForm({
                ...form,
                invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> New Customer Invoice
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* AR Aging Analytics */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Outstanding AR"
          value={analytics?.totalOutstanding || 0}
          subtext="Net unpaid customer balances"
          icon={FileText}
          colorScheme="blue"
        />
        <MetricCard
          title="Overdue Receivables"
          value={analytics?.totalOverdue || 0}
          isPositive={false}
          subtext="Past due credit terms"
          icon={FileText}
          colorScheme="rose"
        />
        <MetricCard
          title="Aging 0–30 Days"
          value={analytics?.aging0to30 || 0}
          subtext="Recent past-due balances"
          icon={FileText}
          colorScheme="amber"
        />
        <MetricCard
          title="Aging 60+ Days (Critical)"
          value={analytics?.agingOver60 || 0}
          subtext="High default risk accounts"
          icon={FileText}
          colorScheme="rose"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search customer name..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Statuses' },
                { value: 'UNPAID', label: 'Unpaid' },
                { value: 'PARTIAL', label: 'Partial' },
                { value: 'OVERDUE', label: 'Overdue' },
                { value: 'PAID', label: 'Paid' },
              ],
            },
          ]}
        />
        <div className="table-scroll">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Aging</th>
                <th className="amount-header">Total Amount</th>
                <th className="amount-header">Paid</th>
                <th className="amount-header">Balance Due</th>
                <th>Status</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, color: '#2563eb' }}>{inv.invoiceNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inv.customerEmail}</div>
                  </td>
                  <td>{inv.invoiceDate}</td>
                  <td>{inv.dueDate}</td>
                  <td>
                    {Number(inv.overdueDays) > 0 ? (
                      <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.8rem' }}>
                        {inv.overdueDays}d overdue
                      </span>
                    ) : (
                      <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>Current</span>
                    )}
                  </td>
                  <td className="amount">${Number(inv.totalAmount).toLocaleString()}</td>
                  <td className="amount" style={{ color: '#16a34a' }}>
                    ${Number(inv.amountPaid).toLocaleString()}
                  </td>
                  <td className="amount" style={{ fontWeight: 700, color: Number(inv.outstandingBalance) > 0 ? '#ef4444' : '#64748b' }}>
                    ${Number(inv.outstandingBalance).toLocaleString()}
                  </td>
                  <td>
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
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {inv.status !== 'PAID' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 6px' }}
                          onClick={() => handleMarkPaid(inv)}
                          title="Mark Paid"
                        >
                          <CheckCircle2 size={13} color="#16a34a" />
                        </button>
                      )}
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(inv.id)}
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
      </div>

      {/* Add Invoice Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create Customer AR Invoice</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Invoice Number</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.invoiceNumber}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Customer Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Horizon Fintech Inc"
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Billing Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="billing@horizonfin.com"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Total Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="87000.00"
                      value={form.totalAmount}
                      onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Amount Paid ($)</label>
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
                    <label className="form-label">Invoice Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.invoiceDate}
                      onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date (Credit Terms)</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes &amp; PO References</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Net 30 days pending customer PO certification"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Issue Customer Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
