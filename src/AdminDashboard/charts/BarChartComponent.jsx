import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const BarChartComponent = ({ data, xKey, barKey, color = "#667eea", title }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
        <XAxis 
          dataKey={xKey} 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        />
        <Bar 
          dataKey={barKey} 
          fill="url(#barGradient)" 
          radius={[6, 6, 0, 0]}
          stroke={color}
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartComponent;
