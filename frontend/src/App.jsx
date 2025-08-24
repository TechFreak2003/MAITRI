import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaitriLanding from "./pages/WildGuardLanding";
import Dashboard from "./pages/Dashboard"; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MaitriLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
