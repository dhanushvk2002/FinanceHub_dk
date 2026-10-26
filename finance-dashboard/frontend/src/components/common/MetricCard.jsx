import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  subtext,
  icon: Icon,
  colorScheme = 'blue',
  prefix = '$',
  suffix = '',
}) {
  const formattedValue =
    typeof value === 'number'
      ? `${prefix}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${suffix}`
      : `${prefix}${value || 0}${suffix}`;

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
        <span className="metric-subtext">{subtext}</span>
      </div>
    </div>
  );
}
