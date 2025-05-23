import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container, TextField, Button, Typography, Paper, Link, IconButton, InputAdornment, OutlinedInput, FormControl, InputLabel
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { login } from "./authService";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const onSubmit = async(e,data) => {
     e.preventDefault();
    try {
      await login(data.email, data.password);
      alert('Login successful!');
      // Redirect or fetch protected data
    } catch (err) {
      alert('Login failed!');
    }
  };
 

  return (
    <Container maxWidth="xs">
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3, textAlign: "center", backgroundColor: "#F3E5F5" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#6A0DAD", mb: 2 }}>
          Welcome Back!
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              {...register("email")}
              error={!!errors.email}
              label="Email"
              startAdornment={
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              }
              sx={{ borderRadius: 2 }}
            />
            <Typography variant="caption" color="error">{errors.email?.message}</Typography>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register("password")}
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              label="Password"
              sx={{ borderRadius: 2 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Typography variant="caption" color="error">{errors.password?.message}</Typography>
          </FormControl>

          <Link
            component="button"
            variant="body2"
            sx={{ color: "#6A0DAD", textDecoration: "none", display: "block", mb: 2 }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1, bgcolor: "#6A0DAD", borderRadius: 2,
              '&:hover': { bgcolor: "#4A0072" }
            }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link component="button" sx={{ color: "#6A0DAD", fontWeight: "bold" }} onClick={() => navigate("/register")}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
