import React from "react";

const StatsCard = ({ title, value, icon, color = "bg-gradient-primary", trend }) => (
  <div className="card-modern p-6 text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden">
    <div className={`absolute inset-0 ${color} opacity-10 rounded-3xl`}></div>
    <div className="relative z-10">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glass group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-2xl text-white">{icon}</span>
      </div>
      <p className="text-4xl font-black text-gray-800 mb-2">{value}</p>
      <p className="text-gray-600 font-medium mb-2">{title}</p>
      {trend && <p className="text-sm font-bold text-success-600">{trend}</p>}
    </div>
  </div>
);

export default StatsCard;
