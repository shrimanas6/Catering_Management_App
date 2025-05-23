import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container, Paper, Typography, Button, Link, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (data) => console.log("Registered Data:", data);

  return (
    <Container maxWidth="xs">
      <Paper elevation={6} sx={{ p: 4, mt: 5, borderRadius: 3, backgroundColor: "#F3E5F5", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#6A0DAD", mb: 2 }}>
          Create an Account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Full Name</InputLabel>
            <OutlinedInput {...register("fullName")} error={!!errors.fullName} label="Full Name" sx={{ borderRadius: 2 }} />
            <Typography variant="caption" color="error">{errors.fullName?.message}</Typography>
          </FormControl>

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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              label="Confirm Password"
              sx={{ borderRadius: 2 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Typography variant="caption" color="error">{errors.confirmPassword?.message}</Typography>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, bgcolor: "#6A0DAD", borderRadius: 2, '&:hover': { bgcolor: "#4A0072" } }}>
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? {" "}
          <Link component="button" sx={{ color: "#6A0DAD", fontWeight: "bold" }} onClick={() => navigate("/login")}>
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;