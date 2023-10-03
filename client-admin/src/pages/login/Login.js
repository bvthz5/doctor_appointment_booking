import React from "react";
import AdminLogin from "../../components/forms/loginForm/AdminLogin";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./login.css";
const Login = () => {
  return (
    <div>
      <div className="loginn">
        <Container component="main" maxWidth="sm">
          <Box
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AdminLogin />
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default Login;
