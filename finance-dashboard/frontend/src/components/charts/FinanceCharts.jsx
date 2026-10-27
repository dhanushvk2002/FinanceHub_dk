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

const CHART_COLORS = ['#fbbf24', '#10b981', '#38bdf8', '#c084fc', '#f43f5e', '#d97706'];

const formatCurrencyTick = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

export function RevenueExpenseTrendChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(245, 158, 11, 0.12)" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(245, 158, 11, 0.22)' }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(245, 158, 11, 0.22)' }} />
          <Tooltip
            formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
            contentStyle={{ backgroundColor: '#0d1527', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.35)', boxShadow: '0 8px 24px rgba(0,0,0,0.7)', color: '#f8fafc' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#fbbf24" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
          <Area type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(245, 158, 11, 0.12)" />
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(245, 158, 11, 0.22)' }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(245, 158, 11, 0.22)' }} />
          <Tooltip
            formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
            contentStyle={{ backgroundColor: '#0d1527', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#f8fafc' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="operating" name="Operating Inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="netCashFlow" name="Net Cash Movement" fill="#fbbf24" radius={[4, 4, 0, 0]} />
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
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ForecastComparisonChart({ data = [] }) {
  const chartData = (data || []).map((item) => ({
    ...item,
    month: item.month || item.forecastMonth || 'N/A',
    projectedRevenue: Number(item.projectedRevenue || 0),
    actualRevenue: Number(item.actualRevenue) > 0 ? Number(item.actualRevenue) : null,
    projectedCashFlow: Number(item.projectedCashFlow || 0),
    projectedOpex: Number(item.projectedOpex || 0),
  }));

  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrencyTick}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <Tooltip
            labelFormatter={(label) => `Forecast Horizon: ${label}`}
            formatter={(value, name) => [
              value !== null && value !== undefined ? `$${Number(value).toLocaleString()}` : 'Pending Actuals',
              name,
            ]}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              padding: '10px 14px',
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            type="monotone"
            dataKey="projectedRevenue"
            name="Projected Revenue"
            stroke="#2563eb"
            strokeWidth={2.5}
            strokeDasharray="4 4"
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 1, stroke: '#ffffff' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="actualRevenue"
            name="Actual Revenue (Realized)"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 7 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="projectedCashFlow"
            name="Projected Cash Flow"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1, stroke: '#ffffff' }}
            activeDot={{ r: 6 }}
          />
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="units" label={{ value: 'Units Produced & Sold', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 12 }} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis tickFormatter={formatCurrencyTick} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="revenue" name="Total Revenue Curve" stroke="#10b981" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="totalCost" name="Total Cost Curve" stroke="#ef4444" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="fixedCost" name="Fixed Costs Line" stroke="#64748b" strokeDasharray="3 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
