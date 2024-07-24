import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Services from "./components/Services";
import Login from "./components/Login";
import Admin from "./components/Roles/Admin";
import AdminNavbar from "./components/Role Components/AdminNavbar";
import CreateUser from "./components/Role Components/Admin/CreateUser";
import DeleteUser from "./components/Role Components/Admin/DeleteUser";
import TeacherNavbar from "./components/Role Components/TeacherNavbar";
import Teacher from "./components/Roles/Teacher";
import AddAssignment2 from "./components/Role Components/Teacher/AddAssignment2";
import Student from "./components/Roles/Student";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/home" element={<><Navbar /> <HomePage />  <Services /> </>} />
        <Route path="/services" element={<><Navbar /> <Services /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/schooler/admin/home" element={<><AdminNavbar /><Admin /></>}></Route>
        <Route path="/schooler/admin/createUser" element={<><AdminNavbar /><CreateUser /></>}></Route>
        <Route path="/schooler/admin/deleteUser" element={<><AdminNavbar /><DeleteUser /></>}></Route>
        <Route path="/schooler/teacher/home" element={<><TeacherNavbar /><Teacher /></>}></Route>
        <Route path="/schooler/teacher/addAssignment" element={<AddAssignment2 />}></Route>
        <Route path="/schooler/student/home" element={<><AdminNavbar /><Student /></>}></Route>

      </Routes>
    </Router>
  );
}

export default App;
