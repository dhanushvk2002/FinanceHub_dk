import React from 'react';
import SearchInput from './SearchInput';

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  actions,
}) {
  return (
    <div className="table-toolbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {onSearchChange && (
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        )}
        {filters.map((f, idx) => (
          <select
            key={idx}
            className="form-select"
            style={{ width: 'auto', padding: '7px 12px', fontSize: '0.8125rem' }}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
          >
            {f.options.map((opt, oIdx) => (
              <option key={oIdx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
