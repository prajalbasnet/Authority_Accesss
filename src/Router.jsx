// src/router.js
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./LandingPage/Home";
import About from "./LandingPage/About";
import Authorities from "./LandingPage/Authorities";
import HowToUse from "./LandingPage/HowToUse";
import TermsAndPolicy from "./LandingPage/TermsAndPolicy";
import ContactUs from "./LandingPage/ContactUs";
import Signup from "./Signup";
import Otp from "./Otp";
import AuthorityVerificationMessage from "./AuthorityVerificationMessage";
import Login from "./Login";
import CitizenPage from "./CitizenPage";
import KycVerification from "./KycVerification";
import CitizenDashboardLayout from "./CitizenDashboardLayout";
import CitizenDashboardHome from "./CitizenDashboard/Home";
import MyComplaints from "./CitizenDashboard/MyComplaints";
import PublicComplaintFeed from "./CitizenDashboard/PublicComplaintFeed";
import AuthorityDashboardLayout from "./AuthorityDashboardLayout";
import AuthorityComplaints from "./AuthorityComplaints";
import AuthorityBroadcastFeed from "./AuthorityBroadcastFeed";
import AuthorityGroupChat from "./AuthorityGroupChat";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin dashboard imports
import AdminDashboardHome from "./AdminDashboard/Home";
import AllComplaints from "./AdminDashboard/AllComplaints";
import AllAuthorities from "./AdminDashboard/AllAuthorities";
import AllCitizens from "./AdminDashboard/AllCitizens";
import KycRequests from "./AdminDashboard/KycRequests";
// If you have an AdminDashboardLayout, import it here
import AdminDashboardLayout from "./AdminDashboard/AdminDashboardLayout";

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
