import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';

export default function RefreshButton({
  onRefresh,
  className = 'btn btn-secondary btn-sm',
  size = 14,
  label = 'Refresh',
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const handleClick = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshed(false);

    try {
      if (typeof onRefresh === 'function') {
        const result = onRefresh();
        // Run refresh call and guarantee at least 600ms of spinning animation for clear visual feedback
        await Promise.all([
          Promise.resolve(result),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        window.location.reload();
      }
      setRefreshed(true);
      setTimeout(() => {
        setRefreshed(false);
      }, 1500);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={refreshing}
      title="Refresh data"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: refreshing ? 'wait' : 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {refreshed ? (
        <Check size={size} color="#16a34a" />
      ) : (
        <RefreshCw size={size} className={refreshing ? 'spin' : ''} />
      )}
      <span>{refreshing ? 'Refreshing...' : refreshed ? 'Refreshed' : label}</span>
    </button>
  );
}
