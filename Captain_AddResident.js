import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link, useLocation } from "react-router-dom"; // ✅ Import useNavigate
import 'react-toastify/dist/ReactToastify.css';
import "./AdminApp.css"
import logo from '../src/images/logo.png';
import { IoHomeOutline, IoBarChartOutline, IoPeopleOutline, IoAddCircleOutline, IoLogOutOutline } from "react-icons/io5";

const API_URL = 'http://localhost:5000/residents';

function AddResident() {
  const [formData, setFormData] = useState({ id: '', last_name: '', first_name: '', middle_initial: '', birthday: '', age: '', sex: '', status: '', purok: '', occupation: '', annual_income: '', contact_number: '', religion: '', nationality: '', housing: '' });
  const [setResidents] = useState([]);
  const [isEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL);
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  // Logout function
  const handleLogout = () => {
    setTimeout(() => {
      navigate("/"); // Redirect to Login Page
    } );
  };

  // Handle form change with age calculation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Automatically calculate age when birthday is changed
    if (name === "birthday") {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      // Adjust age if the birthday hasn't occurred yet this year
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      updatedFormData.age = age;
    }

    setFormData(updatedFormData);
  };

  // Add new resident
  const handleAddSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch existing residents
      const response = await axios.get(API_URL);
      const existingResidents = response.data;
  
      // Check if ID already exists
      const idExists = existingResidents.some(resident => resident.id === formData.id);
      if (idExists) {
        toast.error('Resident ID already exists! Please use a unique ID.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return; // Stop submission if ID already exists
      }
  
      // Proceed with adding the resident
      await axios.post(API_URL, formData);
      toast.success('Resident added successfully!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  
      fetchResidents(); // Refresh resident list
      setFormData({
        id: '', last_name: '', first_name: '', middle_initial: '', birthday: '',
        age: '', sex: '', status: '', purok: '', occupation: '', annual_income: '',
        contact_number: '', religion: '', nationality: '', housing: ''
      });
  
    } catch (error) {
      toast.error('Error adding resident!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error:', error);
    }
  };
  

  return (
    <div class="container">
        <div class="navigation">
            <ul>
                <li>
                    <Link>
                        <span class="icon">
                            <img src={logo} alt="Logo" className="logo-photo" />
                        </span>
                        <span class="title-logo">Sta. Filomena</span>
                    </Link>
                </li>

                <li>
                    <Link to="/captain_home" className={location.pathname === "/captain_home" ? "active" : ""}>
                        <span className="icon">
                        <IoHomeOutline size={24} />
                        </span>
                        <span className="title">Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/captain_dashboard" className={location.pathname === "/captain_dashboard" ? "active" : ""}>
                        <span className="icon">
                        <IoBarChartOutline size={24} />
                        </span>
                        <span className="title">Dashboard</span>
                    </Link>
                </li>  
                <li>
                    <Link to="/captain_residents" className={location.pathname === "/captain_residents" ? "active" : ""}>
                        <span className="icon">
                        <IoPeopleOutline size={24} />
                        </span>
                        <span className="title">Residents</span>
                    </Link>
                </li>

                <li>
                    <Link to="/captain_addresident" className={location.pathname === "/captain_addresident" ? "active" : ""}>
                        <span className="icon">
                        <IoAddCircleOutline size={24} />
                        </span>
                        <span className="title">Add Resident</span>
                    </Link>
                </li>

                <li>
                  <Link to="/logout" className="logout-link" onClick={handleLogout}>
                      <span className="icon">
                      <IoLogOutOutline size={24} />
                      </span>
                      <span className="title">Sign out</span>
                  </Link>
                </li>
            </ul>
        </div>

    <div class="main">
        <div className="data-visualization-container">
          <span className="with-icon">
            <IoAddCircleOutline size={30} />
            <h1>Add Resident</h1>
          </span>
        </div>
        <div class="details-add-resident">
            <div class="recentCustomers">
                <div class="Header">
                    <h2>Input Resident Data</h2>
                </div>
                <div className="container">
  
                  {!isEditing ? (
                    <form onSubmit={handleAddSubmit} className="resident-form">
                      <div className="form-row">
                        {/* First Column */}
                        <div className="form-column">
                          <input type="text" name="id" placeholder="ID" value={formData.id} onChange={handleChange} required />
                          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
                          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
                          <input type="text" name="middle_initial" placeholder="Middle Initial" value={formData.middle_initial} onChange={handleChange} required />
                          <input type="date" name="birthday" placeholder="Birthday" value={formData.birthday} onChange={handleChange} required />
                          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required readOnly />
                          <div className="select-container">
                            <select name="sex" value={formData.sex} onChange={handleChange} required>
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                          <div className="select-container">
                          <select name="status" value={formData.status} onChange={handleChange} required>
                            <option value="">Civil Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                          </select>
                          </div>
                        </div>
              
                        {/* Second Column */}
                        <div className="form-column">
                          <input type="number" name="purok" placeholder="Purok" value={formData.purok} onChange={handleChange} required />
                          <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} required />
                          <input type="text" name="annual_income" placeholder="Annual Income" value={formData.annual_income} onChange={handleChange} required />
                          <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} required />
                          <div className="select-container">
                            <select name="religion" value={formData.religion} onChange={handleChange} required>
                              <option value="">Religion</option>
                              <option value="Christian">Christian</option>
                              <option value="Islam">Islam</option>
                            </select>
                          </div>
                          <div className="select-container">
                            <select name="nationality" value={formData.nationality} onChange={handleChange} required>
                              <option value="">Nationality</option>
                              <option value="Filipino">Filipino</option>
                              <option value="Foreigner">Foreigner</option>
                            </select>
                          </div>
                          <div className="select-container">
                            <select name="housing" value={formData.housing} onChange={handleChange} required>
                              <option value="">Type Of Housing</option>
                              <option value="Owned">Owned</option>
                              <option value="Rented">Rented</option>
                              <option value="Government">Government Housing</option>
                              <option value="Informal Settler">Informal Settler</option>
                            </select>
                          </div>
                        </div>
                      </div>
              
                      <button type="submit" className="btn">Add Resident</button>
                    </form>
                  ) : null}                
                <ToastContainer />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AddResident;