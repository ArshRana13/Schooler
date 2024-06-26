import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Services from "./components/Services";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<><HomePage/>  <Services/> </>} />
        <Route path="/services" element={<Services/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
