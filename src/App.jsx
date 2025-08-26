// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";

function App() {
  return (
    <RouterProvider router={Router} />
  );
}

export default App;
