import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const BarChartComponent = ({ data, xKey, barKey, color = "#8884d8", title }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    {title && <h3 className="font-semibold mb-2">{title}</h3>}
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartComponent;
