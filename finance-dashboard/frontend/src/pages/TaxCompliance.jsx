import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, CheckCircle } from 'lucide-react';
import { taxComplianceService } from '../services/taxComplianceService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function TaxCompliance() {
  const [filings, setFilings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    taxType: 'GST GSTR-3B (Summary Return)',
    jurisdiction: 'India',
    taxPeriod: 'September 2026',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedTaxAmount: '',
    amountPaid: '0.00',
    challanAcknowledgementNo: '',
    status: 'PENDING',
    verifiedStatutoryStatus: 'SELF_RECORDED',
    remarks: '',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      taxComplianceService.getAll({
        status: statusFilter || undefined,
        jurisdiction: jurisdictionFilter || undefined,
      }),
      taxComplianceService.getAnalytics(),
    ])
      .then(([taxRes, anaRes]) => {
        setFilings(taxRes?.data || []);
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
  }, [statusFilter, jurisdictionFilter]);

  const handleCreate = (e) => {
    e.preventDefault();
    taxComplianceService
      .create({
        ...form,
        estimatedTaxAmount: parseFloat(form.estimatedTaxAmount),
        amountPaid: parseFloat(form.amountPaid || 0),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          taxType: 'GST GSTR-3B (Summary Return)',
          jurisdiction: 'India',
          taxPeriod: 'September 2026',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimatedTaxAmount: '',
          amountPaid: '0.00',
          challanAcknowledgementNo: '',
          status: 'PENDING',
          verifiedStatutoryStatus: 'SELF_RECORDED',
          remarks: '',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this statutory tax filing record?')) {
      taxComplianceService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && filings.length === 0) return <LoadingState message="Tracking statutory tax obligations..." />;
  if (error && filings.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Statutory Tax Compliance</h1>
          <p className="page-subtitle">
            Tax periods, jurisdictions, statutory filing deadlines, challan acknowledgements &amp; verified compliance status.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={filings} filename="statutory_tax_compliance.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Filing Obligation
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Tax Obligations"
          value={analytics?.totalTaxObligations || 0}
          subtext="Assessed statutory dues"
          icon={ShieldAlert}
          colorScheme="blue"
        />
        <MetricCard
          title="Taxes Paid & Deposited"
          value={analytics?.totalTaxesPaid || 0}
          isPositive={true}
          subtext="EFTPS / NSDL challans deposited"
          icon={ShieldAlert}
          colorScheme="emerald"
        />
        <MetricCard
          title="Pending Tax Liability"
          value={analytics?.pendingTaxLiability || 0}
          isPositive={false}
          subtext={`Statutory Compliance: ${analytics?.complianceRatePercentage || 0}%`}
          icon={ShieldAlert}
          colorScheme="amber"
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
                { value: 'PENDING', label: 'Pending Filing' },
                { value: 'PAID', label: 'Paid / Deposited' },
                { value: 'FILED', label: 'Filed with Agency' },
                { value: 'OVERDUE', label: 'Overdue' },
              ],
            },
            {
              value: jurisdictionFilter,
              onChange: setJurisdictionFilter,
              options: [
                { value: '', label: 'All Jurisdictions' },
                { value: 'India', label: 'India' },
                { value: 'US Federal IRS', label: 'US Federal IRS' },
                { value: 'Delaware SOS', label: 'Delaware SOS' },
              ],
            },
          ]}
        />
        <div className="table-scroll">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Obligation / Tax Form</th>
                <th>Jurisdiction</th>
                <th>Period</th>
                <th>Due Date</th>
                <th className="amount-header">Assessed Tax</th>
                <th className="amount-header">Amount Paid</th>
                <th>Filing Status</th>
                <th>Statutory Verification</th>
                <th>Acknowledgement Ref</th>
                <th style={{ width: 50, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filings.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.taxType}</td>
                  <td>{f.jurisdiction}</td>
                  <td>{f.taxPeriod}</td>
                  <td>{f.dueDate}</td>
                  <td className="amount">${Number(f.estimatedTaxAmount).toLocaleString()}</td>
                  <td className="amount" style={{ color: '#16a34a' }}>
                    ${Number(f.amountPaid).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        f.status === 'FILED' || f.status === 'PAID'
                          ? 'badge-success'
                          : f.status === 'OVERDUE'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        f.verifiedStatutoryStatus === 'GOVT_ACKNOWLEDGED' || f.verifiedStatutoryStatus === 'AUDITOR_VERIFIED'
                          ? 'badge-success'
                          : 'badge-neutral'
                      }`}
                    >
                      {f.verifiedStatutoryStatus === 'GOVT_ACKNOWLEDGED'
                        ? 'Govt Verified'
                        : f.verifiedStatutoryStatus === 'AUDITOR_VERIFIED'
                        ? 'Auditor Verified'
                        : f.verifiedStatutoryStatus === 'SELF_RECORDED'
                        ? 'Self Recorded'
                        : f.verifiedStatutoryStatus}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    {f.challanAcknowledgementNo || '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                      onClick={() => handleDelete(f.id)}
                      title="Delete Filing"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Statutory Tax Obligation</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tax Form / Obligation</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. GST GSTR-3B (Summary Return)"
                      value={form.taxType}
                      onChange={(e) => setForm({ ...form, taxType: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jurisdiction</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. India / US Federal"
                      value={form.jurisdiction}
                      onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tax Period</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. September 2026 / Q3-2026"
                      value={form.taxPeriod}
                      onChange={(e) => setForm({ ...form, taxPeriod: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Statutory Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Estimated Tax Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="68400.00"
                      value={form.estimatedTaxAmount}
                      onChange={(e) => setForm({ ...form, estimatedTaxAmount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount Paid ($)</label>
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
                    <label className="form-label">Challan / ARN Receipt #</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ARN-AA290926018821"
                      value={form.challanAcknowledgementNo}
                      onChange={(e) => setForm({ ...form, challanAcknowledgementNo: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Statutory Verification Status</label>
                    <select
                      className="form-select"
                      value={form.verifiedStatutoryStatus}
                      onChange={(e) => setForm({ ...form, verifiedStatutoryStatus: e.target.value })}
                    >
                      <option value="SELF_RECORDED">Self-Recorded (Reminder / Draft)</option>
                      <option value="AUDITOR_VERIFIED">Auditor Verified (Signed Off)</option>
                      <option value="GOVT_ACKNOWLEDGED">Government Acknowledged (Challan Validated)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Tax Filing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
