import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Receipt, Plus, Trash2, Check, XCircle } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function OperatingExpenses() {
  const { selectedPeriod } = useOutletContext();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    expenseCategory: 'Cloud Infrastructure',
    department: 'Engineering',
    vendorName: '',
    expenseDate: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    approvedBy: 'VP Finance',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      expenseService.getAll({
        periodId: selectedPeriod || undefined,
        category: categoryFilter || undefined,
        search: search || undefined,
      }),
      expenseService.getAnalytics(selectedPeriod || undefined),
    ])
      .then(([expRes, anaRes]) => {
        setExpenses(expRes?.data || []);
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
  }, [selectedPeriod, categoryFilter, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    expenseService
      .create({
        ...form,
        amount: parseFloat(form.amount),
        period: selectedPeriod ? { id: selectedPeriod } : null,
      })
      .then(() => {
        setShowModal(false);
        setForm({
          expenseCategory: 'Cloud Infrastructure',
          department: 'Engineering',
          vendorName: '',
          expenseDate: new Date().toISOString().split('T')[0],
          amount: '',
          description: '',
          approvalStatus: 'APPROVED',
          paymentStatus: 'PAID',
          approvedBy: 'VP Finance',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this operating expense record?')) {
      expenseService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && expenses.length === 0) return <LoadingState message="Fetching operating expense records..." />;
  if (error && expenses.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operating Expenses (OPEX)</h1>
          <p className="page-subtitle">
            Departmental operational expenditure, vendor management, approval tracking & cost optimization.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={expenses} filename="operating_expenses.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Expense Record
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Analytics KPI row */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total OPEX Burn"
          value={analytics?.totalExpenses || 0}
          subtext="Operational expenses period total"
          icon={Receipt}
          colorScheme="rose"
        />
        <MetricCard
          title="Active Expense Lines"
          value={expenses.length}
          subtext="Approved & processed items"
          icon={Receipt}
          colorScheme="amber"
          prefix=""
        />
        <MetricCard
          title="Top Category"
          value={analytics?.categoryBreakdown?.[0]?.category || 'Payroll & Benefits'}
          subtext={`$${Number(analytics?.categoryBreakdown?.[0]?.total || 0).toLocaleString()} spent`}
          icon={Receipt}
          colorScheme="purple"
          prefix=""
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
              value: categoryFilter,
              onChange: setCategoryFilter,
              options: [
                { value: '', label: 'All Categories' },
                { value: 'Cloud Infrastructure', label: 'Cloud Infrastructure' },
                { value: 'Payroll & Benefits', label: 'Payroll & Benefits' },
                { value: 'Marketing & Advertising', label: 'Marketing & Advertising' },
                { value: 'Office & Facilities', label: 'Office & Facilities' },
                { value: 'Legal & Professional', label: 'Legal & Professional' },
              ],
            },
          ]}
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Department</th>
              <th>Vendor Name</th>
              <th>Description</th>
              <th className="amount-header">Amount</th>
              <th>Approval Status</th>
              <th>Approved By</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.expenseDate}</td>
                <td>
                  <span className="badge badge-neutral">{e.expenseCategory}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{e.department}</td>
                <td>{e.vendorName}</td>
                <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{e.description}</td>
                <td className="amount" style={{ color: '#ef4444' }}>
                  ${Number(e.amount).toLocaleString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      e.approvalStatus === 'APPROVED'
                        ? 'badge-success'
                        : e.approvalStatus === 'REJECTED'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {e.approvalStatus}
                  </span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{e.approvedBy || '—'}</td>
                <td>
                  <button
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                    onClick={() => handleDelete(e.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create Operating Expense Record</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expense Category</label>
                    <select
                      className="form-select"
                      value={form.expenseCategory}
                      onChange={(e) => setForm({ ...form, expenseCategory: e.target.value })}
                    >
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="Payroll & Benefits">Payroll & Benefits</option>
                      <option value="Marketing & Advertising">Marketing & Advertising</option>
                      <option value="Office & Facilities">Office & Facilities</option>
                      <option value="Legal & Professional">Legal & Professional</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Growth">Growth / Marketing</option>
                      <option value="Administration">Administration</option>
                      <option value="Compliance">Compliance & Legal</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vendor Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Amazon Web Services"
                      value={form.vendorName}
                      onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="12500.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expense Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.expenseDate}
                      onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Approved By</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.approvedBy}
                      onChange={(e) => setForm({ ...form, approvedBy: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Business Purpose</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Q4 cloud compute and database hosting cluster"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save OPEX Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
