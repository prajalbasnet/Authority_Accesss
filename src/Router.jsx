// src/router.js
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./features/landing/pages/Home";
import About from "./features/landing/pages/About";
import Authorities from "./features/landing/pages/Authorities";
import HowToUse from "./features/landing/pages/HowToUse";
import TermsAndPolicy from "./features/landing/pages/TermsAndPolicy";
import ContactUs from "./features/landing/pages/ContactUs";
import Signup from "./Signup";
import Otp from "./Otp";
import AuthorityVerificationMessage from "./features/authority/pages/AuthorityVerificationMessage";
import Login from "./Login";
import CitizenPage from "./features/citizen/pages/CitizenPage";
import KycVerification from "./features/citizen/pages/KycVerification";
import CitizenDashboardLayout from "./features/citizen/pages/CitizenDashboardLayout";
import MyComplaints from "./features/citizen/pages/dashboard/MyComplaints";
import PublicComplaintFeed from "./features/citizen/pages/dashboard/PublicComplaintFeed";
import AuthorityDashboardLayout from "./features/authority/pages/AuthorityDashboardLayout";
import AuthorityComplaints from "./features/authority/pages/AuthorityComplaints";
import AuthorityBroadcastFeed from "./features/authority/pages/AuthorityBroadcastFeed";
import AuthorityGroupChat from "./features/authority/pages/AuthorityGroupChat";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin dashboard imports
import AdminDashboardHome from "./features/admin/pages/Home";
import AllComplaints from "./features/admin/pages/AllComplaints";
import AllAuthorities from "./features/admin/pages/AllAuthorities";
import AllCitizens from "./features/admin/pages/AllCitizens";
import KycRequests from "./features/admin/pages/KycRequests";
import AdminDashboardLayout from "./features/admin/pages/AdminDashboardLayout";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // Layout will render Outlet
        children: [
            { index: true, element: <Home /> },
            { path: "about", element: <About /> },
            { path: "authorities", element: <Authorities /> },
            { path: "how-to-use", element: <HowToUse /> },
            { path: "terms-policy", element: <TermsAndPolicy /> },
            { path: "contact", element: <ContactUs /> },
        ],
    },
    { path: "/signup", element: <Signup /> },
    { path: "/otp", element: <Otp /> },
    { path: "/login", element: <Login /> },
    { path: "/authority-verification-message", element: <AuthorityVerificationMessage /> },
    { path: "/public-feed", element: <PublicComplaintFeed /> },
    {
        path: "/citizen",
        element: (
            <ProtectedRoute allowedRoles={["USER"]}>
                <CitizenDashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <CitizenPage /> },
            { path: "file-complaint", element: <CitizenPage /> },
            { path: "kyc", element: <KycVerification /> },
            { path: "my-complaints", element: <MyComplaints /> },
            { path: "complaint-feed", element: <PublicComplaintFeed /> },
        ],
    },
    {
        path: "/authority",
        element: (
            <ProtectedRoute allowedRoles={["AUTHORITY"]}>
                <AuthorityDashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <AuthorityComplaints /> },
            { path: "complaints", element: <AuthorityComplaints /> },
            { path: "broadcast-feed", element: <AuthorityBroadcastFeed /> },
            { path: "group-chat", element: <AuthorityGroupChat /> },
            // Add more authority routes here as you build more features
        ],
    },
    // Admin dashboard routes
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <AdminDashboardHome /> },
            { path: "complaints", element: <AllComplaints /> },
            { path: "authorities", element: <AllAuthorities /> },
            { path: "citizens", element: <AllCitizens /> },
            { path: "kyc-requests", element: <KycRequests /> },
        ],
    },
]);

export default Router;
