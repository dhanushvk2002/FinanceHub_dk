import React, { useState, useEffect } from 'react';
import { Percent, Plus, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';
import { gstService } from '../services/gstService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function GSTInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceType: 'B2B',
    customerSupplierName: '',
    gstin: '',
    placeOfSupply: 'Karnataka (29)',
    taxableValue: '',
    cgstRate: '9.00',
    sgstRate: '9.00',
    igstRate: '0.00',
    filingStatus: 'PENDING',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      gstService.getAll({ status: statusFilter || undefined, search: search || undefined }),
      gstService.getAnalytics(),
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
    gstService
      .create({
        ...form,
        taxableValue: parseFloat(form.taxableValue),
        cgstRate: parseFloat(form.cgstRate || 0),
        sgstRate: parseFloat(form.sgstRate || 0),
        igstRate: parseFloat(form.igstRate || 0),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          invoiceNumber: '',
          invoiceDate: new Date().toISOString().split('T')[0],
          invoiceType: 'B2B',
          customerSupplierName: '',
          gstin: '',
          placeOfSupply: 'Karnataka (29)',
          taxableValue: '',
          cgstRate: '9.00',
          sgstRate: '9.00',
          igstRate: '0.00',
          filingStatus: 'PENDING',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this GST invoice record?')) {
      gstService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && invoices.length === 0) return <LoadingState message="Validating GST Tax Register..." />;
  if (error && invoices.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">GST Tax Invoices Register</h1>
          <p className="page-subtitle">
            Indian Statutory GST Compliance: B2B/B2C Invoices, GSTIN Verification, CGST, SGST &amp; IGST Tax Splits.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={invoices} filename="gst_tax_register.csv" />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setForm({
                ...form,
                invoiceNumber: `GST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> New GST Invoice
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Taxable Value"
          value={analytics?.totalTaxableValue || 0}
          subtext="Base taxable assessable value"
          icon={Percent}
          colorScheme="blue"
        />
        <MetricCard
          title="Total GST Output Liability"
          value={analytics?.totalTaxLiability || 0}
          subtext="CGST + SGST + IGST Collected"
          icon={Percent}
          colorScheme="purple"
        />
        <MetricCard
          title="Gross Invoice Turnover"
          value={analytics?.totalInvoiceValue || 0}
          subtext="Taxable + Total GST"
          icon={Percent}
          colorScheme="emerald"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search customer/supplier name..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: '', label: 'All Filing Statuses' },
                { value: 'PENDING', label: 'Pending Filing' },
                { value: 'FILED', label: 'Filed GSTR-1' },
                { value: 'RECONCILED', label: 'Reconciled 2B' },
              ],
            },
          ]}
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Party Name</th>
              <th>GSTIN</th>
              <th>Place of Supply</th>
              <th className="amount-header">Taxable Value</th>
              <th className="amount-header">CGST</th>
              <th className="amount-header">SGST</th>
              <th className="amount-header">IGST</th>
              <th className="amount-header">Total Amount</th>
              <th>Filing Status</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600, color: '#2563eb' }}>{inv.invoiceNumber}</td>
                <td>{inv.invoiceDate}</td>
                <td>
                  <span className="badge badge-neutral">{inv.invoiceType}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{inv.customerSupplierName}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#334155' }}>
                  {inv.gstin}
                </td>
                <td style={{ fontSize: '0.8rem' }}>{inv.placeOfSupply}</td>
                <td className="amount">${Number(inv.taxableValue).toLocaleString()}</td>
                <td className="amount" style={{ color: '#64748b' }}>
                  ${Number(inv.cgstAmount).toLocaleString()}
                </td>
                <td className="amount" style={{ color: '#64748b' }}>
                  ${Number(inv.sgstAmount).toLocaleString()}
                </td>
                <td className="amount" style={{ color: '#64748b' }}>
                  ${Number(inv.igstAmount).toLocaleString()}
                </td>
                <td className="amount" style={{ fontWeight: 700, color: '#16a34a' }}>
                  ${Number(inv.totalInvoiceAmount).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      inv.filingStatus === 'FILED' || inv.filingStatus === 'RECONCILED'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {inv.filingStatus}
                  </span>
                </td>
                <td>
                  <button
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    onClick={() => handleDelete(inv.id)}
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
              <h3 className="modal-title">Register GST Tax Invoice</h3>
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
                    <label className="form-label">Invoice Type</label>
                    <select
                      className="form-select"
                      value={form.invoiceType}
                      onChange={(e) => setForm({ ...form, invoiceType: e.target.value })}
                    >
                      <option value="B2B">B2B Registered</option>
                      <option value="B2C">B2C Retail</option>
                      <option value="EXPORT">Export LUT / 0-Tax</option>
                      <option value="REVERSE_CHARGE">Reverse Charge (RCM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Party (Customer/Supplier) Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Tata Consultancy Services"
                      value={form.customerSupplierName}
                      onChange={(e) => setForm({ ...form, customerSupplierName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GSTIN (15 Alphanumeric)</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 27AABCT3518Q1Z1 (or URP)"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Place of Supply (State / Code)</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.placeOfSupply}
                      onChange={(e) => setForm({ ...form, placeOfSupply: e.target.value })}
                    />
                  </div>
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
                </div>

                <div className="form-group">
                  <label className="form-label">Taxable Assessable Value ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    placeholder="100000.00"
                    value={form.taxableValue}
                    onChange={(e) => setForm({ ...form, taxableValue: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CGST Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={form.cgstRate}
                      onChange={(e) => setForm({ ...form, cgstRate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SGST Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={form.sgstRate}
                      onChange={(e) => setForm({ ...form, sgstRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">IGST Rate (%) (Inter-State Supply)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={form.igstRate}
                    onChange={(e) => setForm({ ...form, igstRate: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Compute &amp; Save GST Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
