import React from 'react';
import { Calendar } from 'lucide-react';

export default function DateRangePicker({ selectedPeriod, onPeriodChange, periods = [] }) {
  return (
    <div className="date-selector-wrapper">
      <Calendar size={15} color="#64748b" />
      <select
        className="date-select-input"
        value={selectedPeriod || ''}
        onChange={(e) => onPeriodChange(e.target.value)}
      >
        <option value="">All Periods (FY 2026)</option>
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.periodName} ({p.startDate} - {p.endDate})
          </option>
        ))}
      </select>
    </div>
  );
}
