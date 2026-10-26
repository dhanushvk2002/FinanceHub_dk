import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Boxes, Plus, Trash2 } from 'lucide-react';
import { cogsService } from '../services/cogsService';
import MetricCard from '../components/common/MetricCard';
import FilterBar from '../components/common/FilterBar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ExportButton from '../components/common/ExportButton';
import RefreshButton from '../components/common/RefreshButton';

export default function CostOfGoodsSold() {
  const { selectedPeriod } = useOutletContext();
  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    productLine: 'Enterprise Server Appliances',
    directMaterialCost: '',
    directLaborCost: '',
    manufacturingOverhead: '',
    freightShippingCost: '0.00',
    unitsProduced: '100',
    recordDate: new Date().toISOString().split('T')[0],
  });

  const loadData = () => {
    setError(null);
    return Promise.all([
      cogsService.getAll({ periodId: selectedPeriod || undefined, search: search || undefined }),
      cogsService.getAnalytics(selectedPeriod || undefined),
    ])
      .then(([recRes, anaRes]) => {
        setRecords(recRes?.data || []);
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
  }, [selectedPeriod, search]);

  const handleCreate = (e) => {
    e.preventDefault();
    cogsService
      .create({
        ...form,
        directMaterialCost: parseFloat(form.directMaterialCost),
        directLaborCost: parseFloat(form.directLaborCost),
        manufacturingOverhead: parseFloat(form.manufacturingOverhead),
        freightShippingCost: parseFloat(form.freightShippingCost || 0),
        unitsProduced: parseInt(form.unitsProduced, 10),
        period: selectedPeriod ? { id: selectedPeriod } : null,
      })
      .then(() => {
        setShowModal(false);
        setForm({
          productLine: 'Enterprise Server Appliances',
          directMaterialCost: '',
          directLaborCost: '',
          manufacturingOverhead: '',
          freightShippingCost: '0.00',
          unitsProduced: '100',
          recordDate: new Date().toISOString().split('T')[0],
        });
        loadData();
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this COGS production cost entry?')) {
      cogsService.delete(id).then(loadData).catch((err) => alert(err.message));
    }
  };

  if (loading && records.length === 0) return <LoadingState message="Calculating direct cost schedules..." />;
  if (error && records.length === 0) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cost of Goods Sold (COGS)</h1>
          <p className="page-subtitle">
            Direct materials, manufacturing labor, factory overhead, freight & product-level unit cost schedules.
          </p>
        </div>
        <div className="header-actions">
          <ExportButton data={records} filename="cogs_cost_schedule.csv" />
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Record Production Batch
          </button>
          <RefreshButton onRefresh={loadData} />
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <MetricCard
          title="Total Period COGS"
          value={analytics?.totalCogs || 0}
          subtext="Total direct product cost"
          icon={Boxes}
          colorScheme="rose"
        />
        <MetricCard
          title="Product Lines Monitored"
          value={records.length}
          subtext="Active production runs"
          icon={Boxes}
          colorScheme="blue"
          prefix=""
        />
        <MetricCard
          title="Average Batch Unit Cost"
          value={
            records.length > 0
              ? records.reduce((acc, r) => acc + Number(r.unitCost), 0) / records.length
              : 0
          }
          subtext="Weighted average across batches"
          icon={Boxes}
          colorScheme="amber"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search product line..."
        />
        <table className="finance-table">
          <thead>
            <tr>
              <th>Batch Date</th>
              <th>Product Line</th>
              <th className="amount-header">Direct Materials</th>
              <th className="amount-header">Direct Labor</th>
              <th className="amount-header">Overhead</th>
              <th className="amount-header">Freight</th>
              <th className="amount-header">Total COGS</th>
              <th className="amount-header">Units Produced</th>
              <th className="amount-header">Unit Cost</th>
              <th style={{ width: 50 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.recordDate}</td>
                <td style={{ fontWeight: 600 }}>{r.productLine}</td>
                <td className="amount">${Number(r.directMaterialCost).toLocaleString()}</td>
                <td className="amount">${Number(r.directLaborCost).toLocaleString()}</td>
                <td className="amount">${Number(r.manufacturingOverhead).toLocaleString()}</td>
                <td className="amount">${Number(r.freightShippingCost).toLocaleString()}</td>
                <td className="amount" style={{ fontWeight: 700, color: '#ef4444' }}>
                  ${Number(r.totalCogs).toLocaleString()}
                </td>
                <td className="amount">{r.unitsProduced}</td>
                <td className="amount" style={{ fontWeight: 700, color: '#2563eb' }}>
                  ${Number(r.unitCost).toFixed(2)}
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
              <h3 className="modal-title">Record Production Batch COGS</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Line / SKU</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Enterprise Server Appliances"
                    value={form.productLine}
                    onChange={(e) => setForm({ ...form, productLine: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Direct Material Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="45000.00"
                      value={form.directMaterialCost}
                      onChange={(e) => setForm({ ...form, directMaterialCost: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Direct Labor Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="22000.00"
                      value={form.directLaborCost}
                      onChange={(e) => setForm({ ...form, directLaborCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Manufacturing Overhead ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      placeholder="11000.00"
                      value={form.manufacturingOverhead}
                      onChange={(e) => setForm({ ...form, manufacturingOverhead: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Freight & Shipping ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="4500.00"
                      value={form.freightShippingCost}
                      onChange={(e) => setForm({ ...form, freightShippingCost: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Units Produced in Batch</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      required
                      value={form.unitsProduced}
                      onChange={(e) => setForm({ ...form, unitsProduced: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch Production Date</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={form.recordDate}
                      onChange={(e) => setForm({ ...form, recordDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Compute &amp; Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
