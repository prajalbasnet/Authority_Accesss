// src/router.js
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import Home from "./screen/Home";
import About from "./screen/About";
import Authorities from "./screen/Authorities";
import HowToUse from "./screen/HowToUse";
import TermsAndPolicy from "./screen/TermsAndPolicy";
import ContactUs from "./screen/ContactUs";

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
]);

export default Router;
