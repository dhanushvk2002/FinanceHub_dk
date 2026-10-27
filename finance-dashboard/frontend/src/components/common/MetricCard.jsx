import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  subtext,
  subtitle,
  icon: Icon,
  colorScheme = 'blue',
  prefix = '$',
  suffix = '',
}) {
  let formattedValue = value;
  if (typeof value === 'number') {
    formattedValue = `${prefix}${value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}${suffix}`;
  } else if (typeof value === 'string') {
    if (value.startsWith('$')) {
      formattedValue = `${value}${suffix}`;
    } else if (prefix === '$' && (value.includes('%') || /[a-zA-Z]/.test(value))) {
      formattedValue = `${value}${suffix}`;
    } else {
      formattedValue = `${prefix}${value}${suffix}`;
    }
  } else if (value === null || value === undefined) {
    formattedValue = '—';
  }

  const displayText = subtext || subtitle;

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className={`metric-icon-box icon-${colorScheme}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="metric-value">{formattedValue}</div>
      <div className="metric-footer">
        {change !== undefined && change !== null && (
          <span className={`metric-change ${isPositive ? 'change-positive' : 'change-negative'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}%
          </span>
        )}
        {displayText && <span className="metric-subtext">{displayText}</span>}
      </div>
    </div>
  );
}
