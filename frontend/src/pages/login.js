import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { login, register } from "../api/auth";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return path from location state or default to home page
  const from = location.state?.from?.pathname || "/";

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(credentials);
      console.log("Logged in successfully:", data);
      setError(null);
      navigate(from); // Navigate to the page user tried to access before login
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(registerData);
      console.log("Registering user:", registerData);
      setIsRegisterDialogOpen(false);
      navigate(from); // Navigate to the page user tried to access before login
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        width: 320,
        margin: "3rem auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} className="login-form">
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1, mb: 1 }}
            align="center"
          >
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
        >
          Login
        </Button>
      </form>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => setIsRegisterDialogOpen(true)}
      >
        Register
      </Button>

      {/* Register Dialog */}
      <Dialog
        open={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
      >
        <DialogTitle>Register</DialogTitle>
        <form onSubmit={handleRegisterSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={registerData.phone}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Login;
