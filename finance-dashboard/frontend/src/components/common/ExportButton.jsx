import React from 'react';
import { Download } from 'lucide-react';

export default function ExportButton({ data = [], filename = 'financial_export.csv' }) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName] !== null && row[fieldName] !== undefined ? String(row[fieldName]) : '';
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-secondary btn-sm" onClick={handleExport}>
      <Download size={14} /> Export CSV
    </button>
  );
}
