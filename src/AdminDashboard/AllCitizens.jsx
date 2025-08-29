import React, { useEffect, useState } from "react";
import { FaUser, FaClipboardList, FaCheckCircle } from "react-icons/fa";

// TODO: Fetch real citizens data from API
const AllCitizens = () => {
  const [citizens, setCitizens] = useState([]);

  useEffect(() => {
    // Example API call (replace with your real endpoint)
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/citizens`)
    //   .then(res => res.json())
    //   .then(data => setCitizens(data));
  }, []);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">All Citizens</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Complaints</th>
              <th className="py-2 px-4">Solved</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over real citizens data here */}
            {citizens.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">No citizens found.</td>
              </tr>
            ) : (

              citizens.map((citizen) => (
                <tr key={citizen.id}>
                  <td className="py-2 px-4">{citizen.id}</td>
                  <td className="py-2 px-4">{citizen.name}</td>
                  <td className="py-2 px-4">{citizen.email}</td>
                  <td className="py-2 px-4">{citizen.complaints}</td>
                  <td className="py-2 px-4">{citizen.solved}</td>
                </tr>


              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllCitizens;
