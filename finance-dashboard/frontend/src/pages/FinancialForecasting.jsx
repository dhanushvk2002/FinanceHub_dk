import React, { useState, useEffect } from 'react';
import { LineChart, Plus, Trash2 } from 'lucide-react';
import { forecastService } from '../services/forecastService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';
import { ForecastComparisonChart } from '../components/charts/FinanceCharts';

export default function FinancialForecasting() {
  const [forecasts, setForecasts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    modelName: 'FY27-Q1 Growth Model',
    forecastMonth: '2027-02',
    projectedRevenue: '',
    projectedOpex: '',
    projectedCogs: '',
    projectedCashFlow: '',
    actualRevenue: '0.00',
    actualOpex: '0.00',
    revenueGrowthRate: '15.00',
    assumptions: '',
  });

  const loadData = () => {
    setError(null);
    return Promise.all([forecastService.getAll(), forecastService.getAnalytics()])
      .then(([fRes, aRes]) => {
        setForecasts(fRes?.data || []);
        setAnalytics(aRes?.data || null);
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
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    forecastService
      .create({
        ...form,
        projectedRevenue: parseFloat(form.projectedRevenue),
        projectedOpex: parseFloat(form.projectedOpex),
        projectedCogs: parseFloat(form.projectedCogs),
        projectedCashFlow: parseFloat(form.projectedCashFlow),
        actualRevenue: parseFloat(form.actualRevenue || 0),
        actualOpex: parseFloat(form.actualOpex || 0),
        revenueGrowthRate: parseFloat(form.revenueGrowthRate || 10),
      })
      .then(() => {
        setShowModal(false);
        setForm({
          modelName: 'FY27-Q1 Growth Model',
          forecastMonth: '2027-02',
          projectedRevenue: '',
          projectedOpex: '',
          projectedCogs: '',
          projectedCashFlow: '',
          actualRevenue: '0.00',
          actualOpex: '0.00',
          revenueGrowthRate: '15.00',
          assumptions: '',
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this financial projection month?')) {
      forecastService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && forecasts.length === 0) return <LoadingState message="Simulating Financial Forecast Models..." />;
  if (error && forecasts.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Forecasting &amp; Predictive Models</h1>
          <p className="page-subtitle">
            Forward-looking revenue projections, cash runway simulations, scenario modeling &amp; variance tracking.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={forecasts} filename="financial_projections.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Forecast Horizon
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      {/* Forecast comparison chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Projected Revenue vs Realized Actuals &amp; Cash Flow</h2>
            <p className="card-subtitle">Trajectory tracking and assumption sensitivity curve</p>
          </div>
        </div>
        <ForecastComparisonChart data={forecasts} />
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
            Forecast Line Item Assumptions &amp; Variance Register
          </span>
        </div>
        <div className="table-scroll">
          <table className="finance-table">
            <thead>
              <tr>
                <th>Forecast Month</th>
                <th>Model Title</th>
                <th className="amount-header">Projected Revenue</th>
                <th className="amount-header">Actual Revenue</th>
                <th className="amount-header">Variance</th>
                <th className="amount-header">Projected OPEX</th>
                <th className="amount-header">Projected COGS</th>
                <th className="amount-header">Projected Cash</th>
                <th>Assumptions / Notes</th>
                <th style={{ width: 50 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((f) => {
                const revVariance = Number(f.actualRevenue) > 0 ? Number(f.actualRevenue) - Number(f.projectedRevenue) : null;
                return (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{f.forecastMonth}</td>
                    <td style={{ fontWeight: 500 }}>{f.modelName}</td>
                    <td className="amount" style={{ fontWeight: 600 }}>
                      ${Number(f.projectedRevenue).toLocaleString()}
                    </td>
                    <td className="amount">
                      {Number(f.actualRevenue) > 0 ? `$${Number(f.actualRevenue).toLocaleString()}` : <span style={{ color: '#94a3b8' }}>Pending</span>}
                    </td>
                    <td className="amount" style={{ fontWeight: 700, color: revVariance !== null && revVariance >= 0 ? '#16a34a' : '#ef4444' }}>
                      {revVariance !== null ? `${revVariance >= 0 ? '+' : ''}$${revVariance.toLocaleString()}` : '—'}
                    </td>
                    <td className="amount">${Number(f.projectedOpex).toLocaleString()}</td>
                    <td className="amount">${Number(f.projectedCogs).toLocaleString()}</td>
                    <td className="amount" style={{ color: '#16a34a', fontWeight: 600 }}>
                      ${Number(f.projectedCashFlow).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{f.assumptions || '—'}</td>
                    <td>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => handleDelete(f.id)}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create Monthly Forecast Model</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Model Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={form.modelName}
                      onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Forecast Month (YYYY-MM)</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="2027-02"
                      value={form.forecastMonth}
                      onChange={(e) => setForm({ ...form, forecastMonth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Projected Revenue ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="600000.00"
                      value={form.projectedRevenue}
                      onChange={(e) => setForm({ ...form, projectedRevenue: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Projected OPEX ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="190000.00"
                      value={form.projectedOpex}
                      onChange={(e) => setForm({ ...form, projectedOpex: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Projected COGS ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="180000.00"
                      value={form.projectedCogs}
                      onChange={(e) => setForm({ ...form, projectedCogs: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Projected Net Cash Flow ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="230000.00"
                      value={form.projectedCashFlow}
                      onChange={(e) => setForm({ ...form, projectedCashFlow: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Underlying Strategic Assumptions</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="e.g. Assumes 3 new enterprise tier closes, expansion in APAC direct channel"
                    value={form.assumptions}
                    onChange={(e) => setForm({ ...form, assumptions: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Model Horizon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
