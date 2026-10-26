import React from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search records...' }) {
  return (
    <div className="search-wrapper">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
