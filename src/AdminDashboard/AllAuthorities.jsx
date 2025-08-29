import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa";

const dummyAuthorities = [
  { id: 1, name: "Kathmandu Police", coverage: "Kathmandu", status: "Pending" },
  { id: 2, name: "Lalitpur Municipality", coverage: "Lalitpur", status: "Approved" },
  { id: 3, name: "Bhaktapur Health", coverage: "Bhaktapur", status: "Rejected" },
  { id: 4, name: "Pokhara Water", coverage: "Pokhara", status: "Pending" },
];

const AllAuthorities = () => {
  const [authorities, setAuthorities] = useState(dummyAuthorities);

  const handleApprove = (id) => {
    setAuthorities((prev) => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
  };
  const handleReject = (id) => {
    setAuthorities((prev) => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">All Authorities</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Coverage</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authorities.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{a.id}</td>
                <td className="py-2 px-4">{a.name}</td>
                <td className="py-2 px-4 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> {a.coverage}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    a.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : a.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => handleApprove(a.id)}
                    disabled={a.status === "Approved"}
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    onClick={() => handleReject(a.id)}
                    disabled={a.status === "Rejected"}
                  >
                    <FaTimesCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAuthorities;
