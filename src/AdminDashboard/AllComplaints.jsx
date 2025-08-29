import React, { useState } from "react";
import { StatsCard } from "./charts";
import { FaClipboardList, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const dummyComplaints = [
  { id: 1, title: "Water leakage", status: "Solved", citizen: "Ram Bahadur", date: "2025-08-01" },
  { id: 2, title: "Street light not working", status: "Pending", citizen: "Sita Kumari", date: "2025-08-02" },
  { id: 3, title: "Garbage not collected", status: "Unsolved", citizen: "Hari Prasad", date: "2025-08-03" },
  { id: 4, title: "Road damaged", status: "Solved", citizen: "Gita Devi", date: "2025-08-04" },
  { id: 5, title: "Noise pollution", status: "Pending", citizen: "Bikash Shrestha", date: "2025-08-05" },
];

const statusOptions = ["All", "Solved", "Pending", "Unsolved"];

const AllComplaints = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? dummyComplaints : dummyComplaints.filter(c => c.status === filter);

  // Stats
  const stats = [
    { title: "Total", value: dummyComplaints.length, icon: <FaClipboardList />, color: "bg-blue-500" },
    { title: "Solved", value: dummyComplaints.filter(c => c.status === "Solved").length, icon: <FaCheckCircle />, color: "bg-green-500" },
    { title: "Pending", value: dummyComplaints.filter(c => c.status === "Pending").length, icon: <FaHourglassHalf />, color: "bg-yellow-500" },
    { title: "Unsolved", value: dummyComplaints.filter(c => c.status === "Unsolved").length, icon: <FaTimesCircle />, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">All Complaints</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="flex items-center gap-4 my-4">
        <span className="font-medium">Filter by status:</span>
        {statusOptions.map((s) => (
          <button
            key={s}
            className={`px-3 py-1 rounded ${filter === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Citizen</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{c.id}</td>
                <td className="py-2 px-4">{c.title}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.status === "Solved"
                      ? "bg-green-100 text-green-700"
                      : c.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-2 px-4">{c.citizen}</td>
                <td className="py-2 px-4">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllComplaints;
