import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Scale, Plus, Trash2 } from 'lucide-react';
import { balanceSheetService } from '../services/balanceSheetService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function BalanceSheet() {
  const { selectedPeriod } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New item modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    classification: 'CURRENT_ASSET',
    subCategory: '',
    accountName: '',
    amount: '',
    asOfDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const loadData = () => {
    setError(null);
    return balanceSheetService
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
    balanceSheetService
      .createItem({
        ...form,
        amount: parseFloat(form.amount),
        period: selectedPeriod ? { id: selectedPeriod } : null,
      })
      .then(() => {
        setShowModal(false);
        setForm({
          classification: 'CURRENT_ASSET',
          subCategory: '',
          accountName: '',
          amount: '',
          asOfDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this balance sheet account item?')) {
      balanceSheetService.deleteItem(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && !data) return <LoadingState message="Auditing Balance Sheet & Capital Accounts..." />;
  if (error && !data) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Balance Sheet & Capital Structure</h1>
          <p className="page-subtitle">
            Statement of Financial Position: Assets, Liabilities, Shareholder Equity, and Capital Ratios.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={data.items} filename="balance_sheet_accounts.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Account Item
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>


      {/* Ratios row */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Current Ratio</span>
            <Scale size={18} color="#2563eb" />
          </div>
          <div className="metric-value">{data.currentRatio}x</div>
          <div className="metric-footer">
            <span className="metric-subtext">Current Assets / Current Liabilities (Healthy {'>'} 1.5x)</span>
          </div>
        </div>

        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Debt-to-Equity Ratio</span>
            <Scale size={18} color="#7c3aed" />
          </div>
          <div className="metric-value">{data.debtToEquityRatio}x</div>
          <div className="metric-footer">
            <span className="metric-subtext">Total Liabilities / Total Equity</span>
          </div>
        </div>

        <div className="card">
          <div className="metric-header">
            <span className="metric-title">Debt-to-Assets Ratio</span>
            <Scale size={18} color="#f59e0b" />
          </div>
          <div className="metric-value">{data.debtToAssetsRatio}x</div>
          <div className="metric-footer">
            <span className="metric-subtext">Total Liabilities / Total Assets</span>
          </div>
        </div>
      </div>

      {/* Balance Sheet Statements Classification Grid */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        {/* ASSETS COLUMN */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
            <h2 className="card-title" style={{ color: '#1e40af' }}>Total Assets</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem' }}>
              ${Number(data.totalAssets).toLocaleString()}
            </span>
          </div>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>
            Current Assets (${Number(data.currentAssets).toLocaleString()})
          </h3>
          <table className="finance-table" style={{ marginBottom: '16px' }}>
            <tbody>
              {data.items
                ?.filter((i) => i.classification === 'CURRENT_ASSET')
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.accountName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.subCategory}</div>
                    </td>
                    <td className="amount">${Number(item.amount).toLocaleString()}</td>
                    <td style={{ width: 40 }}>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>
            Non-Current Assets (${Number(data.nonCurrentAssets).toLocaleString()})
          </h3>
          <table className="finance-table">
            <tbody>
              {data.items
                ?.filter((i) => i.classification === 'NON_CURRENT_ASSET')
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.accountName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.subCategory}</div>
                    </td>
                    <td className="amount">${Number(item.amount).toLocaleString()}</td>
                    <td style={{ width: 40 }}>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete Account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* LIABILITIES & EQUITY COLUMN */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '2px solid #7c3aed', paddingBottom: '12px' }}>
            <h2 className="card-title" style={{ color: '#5b21b6' }}>Total Liabilities &amp; Equity</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem' }}>
              ${Number(data.totalLiabilitiesAndEquity).toLocaleString()}
            </span>
          </div>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>
            Current Liabilities (${Number(data.currentLiabilities).toLocaleString()})
          </h3>
          <table className="finance-table" style={{ marginBottom: '16px' }}>
            <tbody>
              {data.items
                ?.filter((i) => i.classification === 'CURRENT_LIABILITY')
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.accountName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.subCategory}</div>
                    </td>
                    <td className="amount">${Number(item.amount).toLocaleString()}</td>
                    <td style={{ width: 40 }}>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>
            Non-Current Liabilities (${Number(data.nonCurrentLiabilities).toLocaleString()})
          </h3>
          <table className="finance-table" style={{ marginBottom: '16px' }}>
            <tbody>
              {data.items
                ?.filter((i) => i.classification === 'NON_CURRENT_LIABILITY')
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.accountName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.subCategory}</div>
                    </td>
                    <td className="amount">${Number(item.amount).toLocaleString()}</td>
                    <td style={{ width: 40 }}>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', margin: '14px 0 8px', textTransform: 'uppercase' }}>
            Shareholders' Equity (${Number(data.totalEquity).toLocaleString()})
          </h3>
          <table className="finance-table">
            <tbody>
              {data.items
                ?.filter((i) => i.classification === 'EQUITY')
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.accountName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.subCategory}</div>
                    </td>
                    <td className="amount">${Number(item.amount).toLocaleString()}</td>
                    <td style={{ width: 40 }}>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Item Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Balance Sheet Account Item</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Classification</label>
                  <select
                    className="form-select"
                    value={form.classification}
                    onChange={(e) => setForm({ ...form, classification: e.target.value })}
                  >
                    <option value="CURRENT_ASSET">Current Asset</option>
                    <option value="NON_CURRENT_ASSET">Non-Current Asset</option>
                    <option value="CURRENT_LIABILITY">Current Liability</option>
                    <option value="NON_CURRENT_LIABILITY">Non-Current Liability</option>
                    <option value="EQUITY">Shareholders' Equity</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Account Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Treasury Operating Account"
                      value={form.accountName}
                      onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sub-Category</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Cash & Equivalents"
                      value={form.subCategory}
                      onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Amount (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="50000.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">As-of Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.asOfDate}
                      onChange={(e) => setForm({ ...form, asOfDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Disclosures</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Silicon Valley Bank liquid reserve"
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
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
