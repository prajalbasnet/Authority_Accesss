import React from "react";

const StatsCard = ({ title, value, icon, color = "bg-blue-500" }) => (
  <div className={`flex items-center p-4 rounded-lg shadow bg-white mb-4`}>
    <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

export default StatsCard;
