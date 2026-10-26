import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const formatCurrencyTick = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

const customTooltipStyle = {
  backgroundColor: 'var(--bg-card)',
  borderColor: 'var(--border-light)',
  borderRadius: '10px',
  boxShadow: 'var(--shadow-card-hover)',
  color: 'var(--text-main)',
  fontSize: '0.8125rem',
  padding: '10px 14px',
};

export function RevenueExpenseTrendChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={customTooltipStyle}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
          <Area type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashFlowTrendChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={customTooltipStyle}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="operating" name="Operating Inflow" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="netCashFlow" name="Net Cash Movement" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonutChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={98}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="var(--bg-card)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={customTooltipStyle}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForecastComparisonChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={customTooltipStyle}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="projectedRevenue" name="Projected Revenue" stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
          <Line type="monotone" dataKey="actualRevenue" name="Actual Revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 5 }} />
          <Line type="monotone" dataKey="projectedCashFlow" name="Projected Cash Flow" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BreakevenCurveChart({ sellingPrice = 1500, variableCost = 825, fixedCosts = 45000, maxUnits = 120 }) {
  const chartData = [];
  const step = Math.max(1, Math.floor(maxUnits / 8));
  for (let units = 0; units <= maxUnits; units += step) {
    const rev = units * sellingPrice;
    const totalCost = fixedCosts + (units * variableCost);
    chartData.push({
      units,
      revenue: rev,
      totalCost,
      fixedCost: fixedCosts,
    });
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis dataKey="units" label={{ value: 'Units Produced & Sold', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
            contentStyle={customTooltipStyle}
            itemStyle={{ color: 'var(--text-main)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="revenue" name="Total Revenue Curve" stroke="#10b981" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="totalCost" name="Total Cost Curve" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="fixedCost" name="Fixed Costs Line" stroke="#94a3b8" strokeDasharray="3 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
