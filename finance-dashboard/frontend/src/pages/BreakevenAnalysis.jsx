import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Calculator, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { breakevenService } from '../services/breakevenService';
import MetricCard from '../components/common/MetricCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';
import { BreakevenCurveChart } from '../components/charts/FinanceCharts';

export default function BreakevenAnalysis() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    modelTitle: '',
    productOrService: '',
    sellingPricePerUnit: '',
    variableCostPerUnit: '',
    monthlyFixedCosts: '',
    notes: '',
  });

  const loadData = () => {
    setError(null);
    return breakevenService
      .getAll()
      .then((res) => {
        const data = res?.data || [];
        setModels(data);
        if (data.length > 0) {
          setSelectedModel(data[0]);
        }
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
    breakevenService
      .create({
        ...form,
        sellingPricePerUnit: parseFloat(form.sellingPricePerUnit),
        variableCostPerUnit: parseFloat(form.variableCostPerUnit),
        monthlyFixedCosts: parseFloat(form.monthlyFixedCosts),
      })
      .then((res) => {
        setShowModal(false);
        setForm({
          modelTitle: '',
          productOrService: '',
          sellingPricePerUnit: '',
          variableCostPerUnit: '',
          monthlyFixedCosts: '',
          notes: '',
        });
        loadData();
      })
      .catch((err) => alert('Failed to create model: ' + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this breakeven scenario?')) {
      breakevenService
        .delete(id)
        .then(() => loadData())
        .catch((err) => alert('Failed to delete: ' + err.message));
    }
  };

  if (loading) return <LoadingState message="Calculating breakeven unit economics and curves..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const activeModel = selectedModel || models[0] || null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="finance-page-header">
        <div>
          <div className="page-breadcrumb">Financial Planning / Unit Economics</div>
          <h1 className="page-title">Cost Structure & Breakeven Analysis</h1>
          <p className="page-subtitle">
            Evaluate contribution margins, fixed cost recovery thresholds, and production volumes required for profitability.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={models} filename="breakeven-models" />
          <RefreshButton onRefresh={loadData} size={16} className="btn btn-secondary" />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Breakeven Model
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <MetricCard
          title="Active Scenario"
          value={activeModel?.model?.modelTitle || 'No Scenario'}
          subtitle={activeModel?.model?.productOrService || 'Define product parameters'}
          icon={Target}
          trend="neutral"
        />
        <MetricCard
          title="Breakeven Production"
          value={
            activeModel?.breakevenUnits != null
              ? `${Number(activeModel.breakevenUnits).toLocaleString()} units`
              : 'N/A'
          }
          subtitle="Zero profit/loss volume"
          icon={Calculator}
          trend={(activeModel?.feasible ?? activeModel?.isFeasible) ? 'up' : 'down'}
        />
        <MetricCard
          title="Breakeven Monthly Sales"
          value={
            activeModel?.breakevenRevenue != null
              ? `$${Number(activeModel.breakevenRevenue).toLocaleString()}`
              : 'N/A'
          }
          subtitle="Required revenue run-rate"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Contribution Margin Ratio"
          value={
            activeModel?.contributionMarginRatio != null
              ? `${Number(activeModel.contributionMarginRatio).toFixed(1)}%`
              : 'N/A'
          }
          subtitle={
            activeModel?.contributionMarginPerUnit != null
              ? `$${Number(activeModel.contributionMarginPerUnit).toFixed(2)} / unit`
              : 'Profit per unit'
          }
          icon={CheckCircle2}
          trend={
            activeModel?.contributionMarginRatio > 30
              ? 'up'
              : activeModel?.contributionMarginRatio > 0
              ? 'neutral'
              : 'down'
          }
        />
      </div>

      {/* Breakeven Curve Chart and Detail */}
      <div className="card">
        <div className="card-header flex justify-between items-center">
          <div>
            <h3 className="card-title">
              Breakeven Curve: {activeModel?.model?.modelTitle || 'Scenario Analysis'}
            </h3>
            <p className="card-subtitle">
              Point of intersection where Total Revenue crosses Total Cost (Fixed Costs + Variable Costs)
            </p>
          </div>
          {models.length > 1 && (
            <div className="flex items-center gap-2">
              <label style={{ fontSize: '0.85rem', color: '#64748b' }}>Select Model:</label>
              <select
                className="form-input"
                style={{ width: '220px' }}
                value={activeModel?.model?.id || ''}
                onChange={(e) => {
                  const found = models.find((m) => m.model.id === parseInt(e.target.value));
                  if (found) setSelectedModel(found);
                }}
              >
                {models.map((m) => (
                  <option key={m.model.id} value={m.model.id}>
                    {m.model.modelTitle} ({m.model.productOrService})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="card-body">
          {activeModel ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Unit Selling Price
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                    ${Number(activeModel.model.sellingPricePerUnit).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Variable Cost / Unit
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
                    ${Number(activeModel.model.variableCostPerUnit).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Monthly Fixed Costs
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748b' }}>
                    ${Number(activeModel.model.monthlyFixedCosts).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Unit Margin ($)
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                    ${Number(activeModel.contributionMarginPerUnit).toLocaleString()}
                  </div>
                </div>
              </div>

              <BreakevenCurveChart
                sellingPrice={parseFloat(activeModel.model.sellingPricePerUnit)}
                variableCost={parseFloat(activeModel.model.variableCostPerUnit)}
                fixedCosts={parseFloat(activeModel.model.monthlyFixedCosts)}
                maxUnits={Math.max(100, Math.ceil(parseFloat(activeModel.breakevenUnits) * 1.8))}
              />
            </>
          ) : (
            <div className="text-center py-8 text-muted">No models created yet.</div>
          )}
        </div>
      </div>

      {/* Models Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          className="card-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Saved Breakeven Scenarios &amp; Sensitivity Models
            </h3>
            <p className="card-subtitle" style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: '#64748b' }}>
              Comparative analysis of products, pricing tiers, and operating cost thresholds
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} /> Add Scenario
          </button>
        </div>
        <div className="table-scroll">
          <table className="finance-table">
            <thead>
              <tr>
                <th style={{ minWidth: '220px', textAlign: 'left' }}>Model Title</th>
                <th style={{ minWidth: '180px', textAlign: 'left' }}>Product / Offering</th>
                <th className="amount-header" style={{ minWidth: '105px' }}>Price / Unit</th>
                <th className="amount-header" style={{ minWidth: '100px' }}>Var Cost</th>
                <th className="amount-header" style={{ minWidth: '125px' }}>Fixed Costs / Mo</th>
                <th className="amount-header" style={{ minWidth: '105px' }}>CM / Unit</th>
                <th className="amount-header" style={{ minWidth: '95px' }}>CM Ratio</th>
                <th className="amount-header" style={{ minWidth: '135px' }}>Breakeven Volume</th>
                <th className="amount-header" style={{ minWidth: '140px' }}>Breakeven Revenue</th>
                <th style={{ minWidth: '100px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '75px', minWidth: '75px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-muted">
                    No breakeven scenarios found. Create one above to calculate margins and thresholds.
                  </td>
                </tr>
              ) : (
                models.map((item) => {
                  const isFeasible = item.feasible ?? item.isFeasible ?? (item.breakevenUnits != null && item.breakevenUnits > 0);
                  const isSelected = selectedModel?.model?.id === item.model.id;
                  return (
                    <tr
                      key={item.model.id}
                      style={{
                        backgroundColor: isSelected ? 'rgba(37,99,235,0.06)' : undefined,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onClick={() => setSelectedModel(item)}
                    >
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                          {item.model.modelTitle}
                        </div>
                        {item.model.notes && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', lineHeight: 1.3 }}>
                            {item.model.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle', fontWeight: 500, color: '#334155' }}>
                        {item.model.productOrService}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', fontWeight: 600, color: '#0f172a' }}>
                        ${Number(item.model.sellingPricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', color: '#64748b' }}>
                        ${Number(item.model.variableCostPerUnit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', color: '#64748b' }}>
                        ${Number(item.model.monthlyFixedCosts).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', fontWeight: 700, color: '#059669' }}>
                        ${Number(item.contributionMarginPerUnit).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', fontWeight: 600, color: '#0284c7' }}>
                        {Number(item.contributionMarginRatio).toFixed(1)}%
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', fontWeight: 700, color: '#2563eb' }}>
                        {item.breakevenUnits != null
                          ? `${Number(item.breakevenUnits).toLocaleString()} units`
                          : 'Infeasible'}
                      </td>
                      <td className="amount" style={{ verticalAlign: 'middle', fontWeight: 700, color: '#0f172a' }}>
                        {item.breakevenRevenue != null
                          ? `$${Number(item.breakevenRevenue).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                          : 'N/A'}
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        {isFeasible ? (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Feasible
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> Infeasible
                          </span>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-icon text-danger"
                          title="Delete scenario"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fff5f5',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff5f5';
                          }}
                          onClick={() => handleDelete(item.model.id)}
                        >
                          <Trash2 size={14} color="#ef4444" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Create Breakeven Scenario</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body space-y-4">
                <div className="form-group">
                  <label className="form-label">Scenario Model Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Enterprise SaaS Tier 1"
                    value={form.modelTitle}
                    onChange={(e) => setForm({ ...form, modelTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Product or Service Offering</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Cloud Dedicated License"
                    value={form.productOrService}
                    onChange={(e) => setForm({ ...form, productOrService: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Selling Price / Unit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-input"
                      placeholder="1500.00"
                      value={form.sellingPricePerUnit}
                      onChange={(e) => setForm({ ...form, sellingPricePerUnit: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Variable Cost / Unit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-input"
                      placeholder="500.00"
                      value={form.variableCostPerUnit}
                      onChange={(e) => setForm({ ...form, variableCostPerUnit: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Monthly Fixed Costs ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-input"
                    placeholder="45000.00"
                    value={form.monthlyFixedCosts}
                    onChange={(e) => setForm({ ...form, monthlyFixedCosts: e.target.value })}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                    Includes fixed overhead: rent, salaried payroll, depreciation, insurance.
                  </small>
                </div>
                <div className="form-group">
                  <label className="form-label">Strategic Notes / Assumptions</label>
                  <textarea
                    rows="2"
                    className="form-input"
                    placeholder="Assumes volume discount on AWS instances after 100 units..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Compute & Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
