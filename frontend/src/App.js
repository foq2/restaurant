import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Employee from "./pages/employee";
import Food from "./pages/food";
import Order from "./pages/order";
import Login from "./pages/login";
import { logout } from "./api/auth";
import { Button } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import "./App.css";

// Tạo component PrivateRoute để bảo vệ các route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  // Create a wrapper component to use useNavigate
  const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      logout(); // Call logout function from auth.js
      navigate("/login"); // Redirect to login page
    };

    return (
      <nav>
        <h1>Hệ thống quản lý nhà hàng</h1>
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/employee"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Nhân viên
          </NavLink>
          <NavLink
            to="/food"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Món ăn
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Đơn hàng
          </NavLink>
        </div>
        <Button
          variant="contained"
          color="error"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          size="small"
          sx={{ ml: 2 }}
        >
          Đăng xuất
        </Button>
      </nav>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>
                <NavBar />
                <Dashboard />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <div>
                <NavBar />
                <Employee />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/food"
          element={
            <PrivateRoute>
              <div>
                <NavBar />
                <Food />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <div>
                <NavBar />
                <Order />
              </div>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
