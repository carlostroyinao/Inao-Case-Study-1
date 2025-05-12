import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./AdminApp.css"
import logo from '../src/images/logo.png';
import { IoHomeOutline, IoPeopleOutline, IoBarChartOutline, IoAddCircleOutline, IoLogOutOutline, IoSearchOutline } from "react-icons/io5";

const API_URL = 'http://localhost:5000/residents';

function Residents() {
  const [formData, setFormData] = useState({ id: '', last_name: '', first_name: '', middle_initial: '', 
    birthday: '', age: '', sex: '', status: '', purok: '', occupation: '', annual_income: '', 
    contact_number: '', religion: '', nationality: '', housing: '' });
  const [residents, setResidents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [totalResidents, setTotalResidents] = useState(0);
  

  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const response = await axios.get(API_URL);
      setResidents(response.data);
      setTotalResidents(response.data.length);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };  

  useEffect(() => {
    fetchResidents();
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    return () => {
      document.body.style.overflow = "auto";
    };

  }, [modalOpen]);

  // Logout function
  const handleLogout = () => {
    setTimeout(() => {
      navigate("/"); // Redirect to Login Page
    } );
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredResidents = residents.filter(resident =>
    Object.entries(resident).some(([key, value]) => {
      if (!value) return false; // Ignore null or undefined values
      const lowerValue = value.toString().trim().toLowerCase();
      const lowerSearch = searchTerm.trim().toLowerCase();
  
      // Ensure exact match for categorical fields
      if (["sex", "gender"].includes(key)) {
        return lowerValue === lowerSearch; // Exact match only
      }
  
      // Partial match for other fields
      return lowerValue.includes(lowerSearch);
    })
  );

const handleEditSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.id) {
    toast.error('Error: Resident ID is missing!', { autoClose: 1500 });
    return;
  }

  try {
    const response = await axios.put(`${API_URL}/${formData.id}`, formData);
    
    if (response.status === 200) {
      toast.success('Resident updated successfully!', { autoClose: 1000 });
      await fetchResidents(); // Refresh the list after update
    } else {
      toast.error('Failed to update resident!', { autoClose: 1000 });
    }

    setFormData({ id: '', last_name: '', first_name: '', middle_initial: '', birthday: '', age: '', sex: '', status: '', purok: '', occupation: '', annual_income: '', contact_number: '', religion: '', nationality: '', housing: '' });
    setIsEditing(false);
    closeModal();
  } catch (error) {
    console.error('Update error:', error);
    toast.error('Error updating resident! Check console for details.', { autoClose: 1000 });
  }
};

  // Close modal function
  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
  };

  // Delete resident
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Resident deleted!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchResidents();
    } catch (error) {
      toast.error('Error deleting resident!', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = (resident) => {
    setFormData({ ...resident });
    setIsEditing(true);
    setModalOpen(true);
  }

  const handlePrint = () => {
    const printContent = document.getElementById("printableTable").innerHTML;
    
    // Create a new print window
    const printWindow = window.open('', '', 'width=800,height=600');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Residents Data</title>
          <style>
          :root {
            --black1: #333;
            --blue: #007bff;
            --light-blue: #e3f2fd;
            --dark-blue: #0056b3;
            --soft-gray: #f8f9fa;
            --hover-blue: #cce5ff;
            --table-border: #dee2e6;
          }

          body {
            font-family: 'Ubuntu', sans-serif;
            margin: 20px;
            background: linear-gradient(to right, #f4f4f9, #e1ecf4);
            color: var(--black1);
          }

          h2 {
            text-align: center;
            font-weight: 700;
            color: var(--dark-blue);
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            background: linear-gradient(to right, var(--blue), var(--dark-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
          }

          th, td {
            border: 1px solid var(--table-border);
            padding: 12px;
            text-align: left;
          }

          th {
            background: linear-gradient(to right, var(--blue), var(--dark-blue));
            color: white;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          td {
            font-size: 14px;
            color: var(--black1);
          }

          tr:nth-child(even) {
            background-color: var(--light-blue);
          }

          tr:nth-child(odd) {
            background-color: var(--soft-gray);
          }

          tr:hover {
            background-color: var(--hover-blue);
            transition: 0.3s ease-in-out;
          }

         @media print {
            th:last-child,
            td:last-child {
              display: none !important;
            }
          }
          @media screen and (max-width: 768px) {
            table {
              font-size: 12px;
            }
            
            th, td {
              padding: 10px;
            }
            
            h2 {
              font-size: 18px;
            }
          }
          </style>
        </head>
        <body>
          <h2>Residents Data</h2>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function () { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload!', { autoClose: 1500 });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.status === 200) {
        toast.success('Residents imported successfully!', { autoClose: 1500 });
        fetchResidents(); // Refresh residents list
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import residents!', { autoClose: 1500 });
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
                    <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
                        <span className="icon">
                        <IoHomeOutline size={24} />
                        </span>
                        <span className="title">Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                        <span className="icon">
                        <IoBarChartOutline size={24} />
                        </span>
                        <span className="title">Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to="/residents" className={location.pathname === "/residents" ? "active" : ""}>
                        <span className="icon">
                        <IoPeopleOutline size={24} />
                        </span>
                        <span className="title">Residents</span>
                    </Link>
                </li>

                <li>
                    <Link to="/addresident" className={location.pathname === "/addresident" ? "active" : ""}>
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
              <IoPeopleOutline size={30} />
              <h1>Residents</h1>
            </span>
          </div>
          <div className="data-visualization-container">
            <span className="with-icon">
              <div>
                <div>{totalResidents} Total Residents</div>
              </div>
            </span>
          </div>
          
            <div class="details">
                <div class="recentOrders">
                    <div class="cardHeader">
                        <h2>Data Information</h2>
                        <div>
                          <input type="file" onChange={handleFileChange} />
                          <button className="btn" onClick={handleFileUpload}>Import Data</button>
                          <button className="btn" onClick={handlePrint}>Print</button>
                        </div>
                    </div>
                    <div className="search-container">
                      <IoSearchOutline className="search-icon" size={20} />
                      <input type="text" placeholder="Search Resident..." value={searchTerm} onChange={handleSearchChange}/>
                    </div>
                  <div id="printableTable">
                    <table>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>Last Name</td>
                                <td>First Name</td>
                                <td>M.I.</td>
                                <td>Birthday</td>
                                <td>Age</td>
                                <td>Sex</td>
                                <td>Civil Status</td>
                                <td>Purok</td>
                                <td>Occupation</td>
                                <td>Annual Income</td>
                                <td>Contact Number</td>
                                <td>Religion</td>
                                <td>Nationality</td>
                                <td>Type of Housing</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                          {filteredResidents
                            .sort((a, b) => a.id - b.id)
                            .map((resident) => (
                              <tr key={resident.id}>
                                <td>{resident.id}</td>
                                <td>{resident.last_name}</td>
                                <td>{resident.first_name}</td>
                                <td>{resident.middle_initial}</td>
                                <td>{resident.birthday}</td>
                                <td>{resident.age}</td>
                                <td>{resident.sex.charAt(0).toUpperCase() + resident.sex.slice(1)}</td>
                                <td>{resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}</td>
                                <td>{resident.purok}</td>
                                <td>{resident.occupation}</td>
                                <td>{resident.annual_income}</td>
                                <td>{resident.contact_number}</td>
                                <td>{resident.religion}</td>
                                <td>{resident.nationality}</td>
                                <td>{resident.housing}</td>
                                <td>
                                  <button onClick={() => handleEdit(resident)} className="btn">Edit</button>
                                  <button onClick={() => handleDelete(resident.id)} className="btn">Delete</button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                </div>
            </div>
        </div>

        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h2>Edit Resident</h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="form-grid">
                    {/* Left Column */}
                    <div className="form-column">
                      <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
                      <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
                      <input type="text" name="middle_initial" placeholder="Middle Initial" value={formData.middle_initial} onChange={handleChange} required />
                      <input type="date" name="birthday" placeholder="Birthday" value={formData.birthday} onChange={handleChange} required />
                      <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
                      <div className="select">
                        <select name="sex" value={formData.sex} onChange={handleChange} required>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="select">
                        <select name="status" value={formData.status} onChange={handleChange} required>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                        </select>
                      </div>
                      <input type="number" name="purok" placeholder="Purok" value={formData.purok} onChange={handleChange} required />
                    </div>

                    {/* Right Column */}
                    <div className="form-column">
                      <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} required />
                      <input type="text" name="annual_income" placeholder="Annual Income" value={formData.annual_income} onChange={handleChange} required />
                      <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} required />
                      <div className="select">
                        <select name="religion" value={formData.religion} onChange={handleChange} required>
                          <option value="Christian">Christian</option>
                          <option value="Islam">Islam</option>
                        </select>
                      </div>
                      <div className="select">
                        <select name="nationality" value={formData.nationality} onChange={handleChange} required>
                          <option value="Filipino">Filipino</option>
                          <option value="Foreigner">Foreigner</option>
                        </select>
                      </div>
                      <div className="select">
                        <select name="housing" value={formData.housing} onChange={handleChange} required>
                          <option value="Owned">Owned</option>
                          <option value="Rented">Rented</option>
                          <option value="Government">Government Housing</option>
                          <option value="Informal Settler">Informal Settler</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="modal-buttons">
                    <button type="submit" className="btn-modal">Update</button>
                    <button type="button" onClick={closeModal} className="btn-modal cancel">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default Residents;