import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#667eea", "#8b5cf6", "#f97316"];

const PieChartComponent = ({ data, dataKey, nameKey, title }) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.7}/>
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={40}
          paddingAngle={3}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#gradient-${index % COLORS.length})`}
            />
          ))}
        </Pie>
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
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#6b7280'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChartComponent;
