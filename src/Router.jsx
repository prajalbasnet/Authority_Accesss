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

const Router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Home />
                <About />
                <Authorities />
                <HowToUse />
                <TermsAndPolicy />
                <ContactUs />
            </Layout>
        ),
    },
    
    { path: "/signup", element: <Signup /> },
    { path: "/otp", element: <Otp /> },
    { path: "/login", element: <Login /> },
    { path: "/authority-verification-message", element: <AuthorityVerificationMessage /> },

    // Public Complaint and Broadcast Feed (accessible to all)
    {
        path: "/public-feed",
        element: <PublicComplaintFeed />,
    },

    // Citizen Dashboard Routes
    {
        path: "/citizen",
        element: <CitizenDashboardLayout />,
        children: [
            { index: true, element: <CitizenDashboardHome /> }, // Default route for /citizen
            { path: "file-complaint", element: <CitizenPage /> }, // Complaint form
            { path: "kyc", element: <KycVerification /> },
            { path: "my-complaints", element: <MyComplaints /> },
            { path: "complaint-feed", element: <PublicComplaintFeed /> },
        ],
    },
]);

export default Router;
