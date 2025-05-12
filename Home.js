import { useNavigate, Link, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./AdminApp.css"
import myImage from "../src/images/pryce_gardens.jpg";
import logo from '../src/images/logo.png';
import { IoHomeOutline, IoPeopleOutline, IoBarChartOutline, IoAddCircleOutline, IoLogOutOutline } from "react-icons/io5";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();


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

        <div className="main">
            <div className="image-container">
                <h1 className="system-title">Resident Profiling System Management</h1>
                <h1 className="welcome-text">Welcome to <br/> Sta. Filomena!</h1>
                <img src={myImage} alt="Dashboard" className="dashboard-photo" />
            </div>
        </div>
    </div>
  );
}

export default Home;