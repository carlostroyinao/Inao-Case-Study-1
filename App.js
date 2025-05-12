import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home"; 
import Dashboard from "./Dashboard"; 
import Residents from "./Residents";
import AddResident from "./AddResident"; 
import Captain_Home from "./Captain_Home";
import Captain_Dashboard from "./Captain_Dashboard"; 
import Captain_Residents from "./Captain_Residents"; 
import Captain_AddResident from "./Captain_AddResident"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/addresident" element={<AddResident />} />
        <Route path="/captain_home" element={<Captain_Home />} />
        <Route path="/captain_dashboard" element={<Captain_Dashboard />} />
        <Route path="/captain_residents" element={<Captain_Residents />} />
        <Route path="/captain_addresident" element={<Captain_AddResident />} />
      </Routes>
    </Router>
  );
}

export default App;
