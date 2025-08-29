
import React, { useEffect, useState } from "react";
import { BarChartComponent, PieChartComponent, StatsCard } from "./charts";
import ThreeJSBarChart from "./charts/ThreeJSBarChart";
import { FaClipboardList, FaUserShield, FaUsers, FaCheckCircle } from "react-icons/fa";


// TODO: Fetch real stats, barData, and pieData from API
const Home = () => {
  const [stats, setStats] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    // Example API calls (replace with your real endpoints)
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`)
    //   .then(res => res.json())
    //   .then(data => setStats(data));
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/barData`)
    //   .then(res => res.json())
    //   .then(data => setBarData(data));
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/pieData`)
    //   .then(res => res.json())
    //   .then(data => setPieData(data));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.length === 0 ? (
          <div className="col-span-4 text-center text-gray-500">No stats data.</div>
        ) : (
          stats.map((stat) => <StatsCard key={stat.title} {...stat} />)
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent data={barData} xKey="month" barKey="complaints" title="Monthly Complaints" />
        <PieChartComponent data={pieData} dataKey="value" nameKey="name" title="Complaints Status" />
      </div>
      <ThreeJSBarChart />
    </div>
  );
}

export default Home;
