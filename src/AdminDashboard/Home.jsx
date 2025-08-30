
import React, { useEffect, useState } from "react";
import { BarChartComponent, PieChartComponent, StatsCard } from "./charts";
import ThreeJSBarChart from "./charts/ThreeJSBarChart";
import { FaClipboardList, FaUserShield, FaUsers, FaCheckCircle } from "react-icons/fa";

const Home = () => {
  const [stats, setStats] = useState([
    { title: "Total Complaints", value: 1250, icon: <FaClipboardList />, color: "bg-gradient-primary", trend: "+12%" },
    { title: "Active Authorities", value: 89, icon: <FaUserShield />, color: "bg-gradient-secondary", trend: "+5%" },
    { title: "Registered Citizens", value: 2340, icon: <FaUsers />, color: "bg-gradient-success", trend: "+18%" },
    { title: "Resolved Issues", value: 950, icon: <FaCheckCircle />, color: "bg-gradient-warning", trend: "+22%" },
  ]);
  const [barData, setBarData] = useState([
    { month: "Jan", complaints: 120 },
    { month: "Feb", complaints: 150 },
    { month: "Mar", complaints: 180 },
    { month: "Apr", complaints: 200 },
    { month: "May", complaints: 250 },
    { month: "Jun", complaints: 220 },
  ]);
  const [pieData, setPieData] = useState([
    { name: "Resolved", value: 60, fill: "#10b981" },
    { name: "Pending", value: 25, fill: "#f59e0b" },
    { name: "Escalated", value: 15, fill: "#ef4444" },
  ]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-12 text-center">
          <h1 className="heading-primary text-5xl md:text-6xl font-black mb-4 gradient-text">
            Admin Dashboard
          </h1>
          <p className="text-body text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor system performance, track complaints, and manage authorities with comprehensive analytics
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.length === 0 ? (
            <div className="col-span-4 text-center text-gray-500 card-modern p-8">
              <div className="animate-pulse-gentle">No stats data available.</div>
            </div>
          ) : (
            stats.map((stat, index) => (
              <div 
                key={stat.title} 
                className="card-modern p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up relative overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`absolute inset-0 ${stat.color} opacity-10 rounded-3xl`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glass group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{stat.icon}</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800 mb-2">{stat.value}</p>
                  <p className="text-gray-600 font-medium mb-2">{stat.title}</p>
                  <p className="text-sm font-bold text-success-600">{stat.trend}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card-modern p-6 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <h3 className="heading-secondary text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <FaClipboardList className="mr-3 text-primary-600" />
              Monthly Complaints Trend
            </h3>
            <BarChartComponent 
              data={barData} 
              xKey="month" 
              barKey="complaints" 
              color="#667eea"
            />
          </div>
          
          <div className="card-modern p-6 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <h3 className="heading-secondary text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <FaCheckCircle className="mr-3 text-success-600" />
              Complaints Status Distribution
            </h3>
            <PieChartComponent 
              data={pieData} 
              dataKey="value" 
              nameKey="name" 
            />
          </div>
        </div>

        {/* 3D Chart Section */}
        <div className="card-modern p-6 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <h3 className="heading-secondary text-2xl font-bold mb-6 text-gray-800 text-center">
            Advanced Analytics <span className="gradient-text">Visualization</span>
          </h3>
          <ThreeJSBarChart />
        </div>
      </div>
    </div>
  );
}

export default Home;
