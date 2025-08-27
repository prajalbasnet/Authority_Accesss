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
import UserLayout from "./UserLayout";
import UserHome from "./UserDashboard/Home";


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
    { path: "/about", element: <Layout><About /></Layout> },
    { path: "/authorities", element: <Layout><Authorities /></Layout> },
    { path: "/how-to-use", element: <Layout><HowToUse /></Layout> },
    { path: "/terms-policy", element: <Layout><TermsAndPolicy /></Layout> },
    { path: "/contact", element: <Layout><ContactUs /></Layout> },

    //userdashboard ko routing

    {
        path: "/dashboard",
        element: (
            <UserLayout>
                <UserHome />
            </UserLayout>
        ),
    },


]);

export default Router;
