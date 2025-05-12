import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, Legend, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate, Link, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./AdminApp.css"
import logo from '../src/images/logo.png';
import { IoHomeOutline, IoPeopleOutline, IoBarChartOutline, IoAddCircleOutline, IoLogOutOutline, IoFemaleOutline, IoMaleOutline, IoBriefcaseOutline, IoBookOutline, IoMoon, IoFlag, IoHome, IoBusiness, IoHomeSharp, IoConstruct } from "react-icons/io5";

const API_URL = 'http://localhost:5000/residents';

function Dashboard() {
  const [residents, setResidents] = useState([]);
  const [totalResidents, setTotalResidents] = useState(0);
  const [totalFemaleResidents, setTotalFemaleResidents] = useState(0);
  const [totalMaleResidents, setTotalMaleResidents] = useState(0);
  const [totalEmployedResidents, setTotalEmployedResidents] = useState(0);
  const [totalChristianResidents, setTotalChristianResidents] = useState(0);
  const [totalIslamResidents, setTotalIslamResidents] = useState(0);
  const [totalFilipinoResidents, setTotalFilipinoResidents] = useState(0);
  const [totalForeignerResidents, setTotalForeignerResidents] = useState(0);
  const [totalOwnedResidents, setTotalOwnedResidents] = useState(0);
  const [totalRentedResidents, setTotalRentedResidents] = useState(0);
  const [totalGovernmentHousingResidents, setTotalGovernmentHousingResidents] = useState(0);
  const [totalInformalSettlersResidents, setTotalInformalSettlersResidents] = useState(0);

  const [modalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
 const fetchResidents = async () => {
  try {
    const response = await axios.get(API_URL);
    const residents = response.data;

    setTotalResidents(residents.length);

    const femaleCount = residents.filter(resident => resident.sex === 'female' || resident.sex === 'Female').length;
    const maleCount = residents.filter(resident => resident.sex === 'male' || resident.sex === 'Male').length;
    setTotalFemaleResidents(femaleCount);
    setTotalMaleResidents(maleCount);

    // Count employed residents (excluding residents and unemployed)
    const employedCount = residents.filter(resident => 
      resident.occupation?.toLowerCase() !== 'student' && 
      resident.occupation?.toLowerCase() !== 'unemployed'
    ).length;
    setTotalEmployedResidents(employedCount);

    // Religion Counts
    const christianCount = residents.filter(resident => resident.religion?.toLowerCase() === 'christian').length;
    const islamCount = residents.filter(resident => resident.religion?.toLowerCase() === 'islam').length;
    setTotalChristianResidents(christianCount);
    setTotalIslamResidents(islamCount);
 
    // Nationality Counts
    const filipinoCount = residents.filter(resident => resident.nationality?.toLowerCase() === 'filipino').length;
    const foreignerCount = residents.filter(resident => resident.nationality?.toLowerCase() === 'foreigner').length;
    setTotalFilipinoResidents(filipinoCount);
    setTotalForeignerResidents(foreignerCount);

    // Housing Type Counts
    const ownedCount = residents.filter(resident => resident.housing?.toLowerCase() === 'owned').length;
    const rentedCount = residents.filter(resident => resident.housing?.toLowerCase() === 'rented').length;
    const governmentHousingCount = residents.filter(resident => resident.housing?.toLowerCase() === 'government').length;
    const informalSettlersCount = residents.filter(resident => resident.housing?.toLowerCase() === 'informal settler').length;

    setTotalOwnedResidents(ownedCount);
    setTotalRentedResidents(rentedCount);
    setTotalGovernmentHousingResidents(governmentHousingCount);
    setTotalInformalSettlersResidents(informalSettlersCount);

    setResidents(residents);
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

  // Process data for visualization
  const getDataForChart = (key) => {
    const counts = residents.reduce((acc, student) => {
      acc[student[key]] = (acc[student[key]] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const sexData = getDataForChart('sex');
  const purokData = getDataForChart('purok');
  const occupationData = getDataForChart('occupation');
  const ageData = getDataForChart('age');
  const religionData = getDataForChart('religion');
  const housingData = getDataForChart('housing');

  // Logout function
  const handleLogout = () => {
    setTimeout(() => {
      navigate("/"); // Redirect to Login Page
    } );
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
                <IoBarChartOutline size={30} />
                <h1>Dashboard</h1>
              </span>
            </div>

            <div class="cardBox">
                <div class="card">
                  <div>
                    <div className="numbers">{totalResidents}</div>
                    <div className="cardName">Total Residents</div>
                  </div>
                  <div className="iconBx">
                    <IoPeopleOutline size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                      <div className="numbers">{totalFemaleResidents}</div>
                      <div className="cardName">Female Residents</div>
                    </div>
                    <div className="iconBx">
                      <IoFemaleOutline size={60} />
                    </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalMaleResidents}</div>
                    <div className="cardName">Male Residents</div>
                  </div>
                  <div className="iconBx">
                    <IoMaleOutline size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalEmployedResidents}</div>
                    <div className="cardName">Employed Residents</div>
                  </div>
                  <div className="iconBx">
                    <IoBriefcaseOutline size={60} />
                  </div>
                </div>
            </div>

            <div class="cardBox">
                <div class="card">
                  <div>
                    <div className="numbers">{totalChristianResidents}</div>
                    <div className="cardName">Christian</div>
                  </div>
                  <div className="iconBx">
                    <IoBookOutline size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                      <div className="numbers">{totalIslamResidents}</div>
                      <div className="cardName">Islam</div>
                    </div>
                    <div className="iconBx">
                      <IoMoon size={60} />
                    </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalFilipinoResidents}</div>
                    <div className="cardName">Filipino</div>
                  </div>
                  <div className="iconBx">
                    <IoFlag size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalForeignerResidents}</div>
                    <div className="cardName">Foreigner</div>
                  </div>
                  <div className="iconBx">
                    <IoFlag size={60} />
                  </div>
                </div>
            </div>

            <div class="cardBox">
                <div class="card">
                  <div>
                    <div className="numbers">{totalOwnedResidents}</div>
                    <div className="cardName">Owned House</div>
                  </div>
                  <div className="iconBx">
                    <IoHome size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                      <div className="numbers">{totalRentedResidents}</div>
                      <div className="cardName">Rented House</div>
                    </div>
                    <div className="iconBx">
                      <IoBusiness size={60} />
                    </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalGovernmentHousingResidents}</div>
                    <div className="cardName">Government Housing</div>
                  </div>
                  <div className="iconBx">
                    <IoHomeSharp size={60} />
                  </div>
                </div>

                <div class="card">
                  <div>
                    <div className="numbers">{totalInformalSettlersResidents}</div>
                    <div className="cardName">Informal Settler</div>
                  </div>
                  <div className="iconBx">
                    <IoConstruct size={60} />
                  </div>
                </div>
            </div>

            <div className="dataBox">
              <div className="card">
                <div>
                  <h2>Age Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4F46E5" barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div>
                  <h2>Sex Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sexData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {sexData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#36A2EB", "#FF6384","#4BC0C0"][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="dataBox">
              <div className="card">
                <div>
                  <h2>Purok Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purokData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#FACC15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div>
                  <h2>Occupation Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={occupationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {occupationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#FF6384", "#36A2EB", "#4BC0C0", "#FF9F40"][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="dataBox">
              <div className="card">
                <div>
                  <h2>Religion Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={religionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <div>
                  <h2>Housing Type Distribution</h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={housingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {housingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#FF6384", "#36A2EB", "#4BC0C0", "#FF9F40"][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        <script src="%PUBLIC_URL%/assets/main.js"></script>
    </div>
  );
}

export default Dashboard;