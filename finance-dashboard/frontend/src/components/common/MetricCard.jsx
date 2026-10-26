import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

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
      ? `${prefix}${value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}${suffix}`
      : `${prefix}${value || 0}${suffix}`;

  const hasChange = change !== undefined && change !== null;

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className={`metric-icon-box icon-${colorScheme}`}>
            <Icon size={19} />
          </div>
        )}
      </div>

      <div className="metric-value">{formattedValue}</div>

      <div className="metric-footer">
        {hasChange && (
          <span
            className={`metric-change ${
              isPositive === true
                ? 'change-positive'
                : isPositive === false
                ? 'change-negative'
                : 'change-neutral'
            }`}
          >
            {isPositive === true ? (
              <ArrowUpRight size={13} />
            ) : isPositive === false ? (
              <ArrowDownRight size={13} />
            ) : (
              <Minus size={13} />
            )}
            {typeof change === 'number' ? `${Math.abs(change)}%` : change}
          </span>
        )}
        {subtext && <span className="metric-subtext">{subtext}</span>}
      </div>
    </div>
  );
}
