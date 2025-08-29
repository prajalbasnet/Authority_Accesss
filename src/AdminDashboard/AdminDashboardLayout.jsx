import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
