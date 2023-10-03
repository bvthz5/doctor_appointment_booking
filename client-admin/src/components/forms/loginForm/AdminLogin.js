import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import "../../../../src/App.css";
import { login } from "../../../service/adminService";
import errorMessages from "../../../../src/utils/errorMessages.json";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await login(data);
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);

        // set the role into localstorage from response
        localStorage.setItem("role", res?.data?.userDetails?.role);

        navigate("/home");
      }

    } catch (error) {
      setDisplayErrorMessage(
        errorMessages[error?.response?.data?.errorCode] ||
          "something went wrong"
      );
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" sx={{ mt: 1 }}>
        <form>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <p className="validationError">{errors.email?.message}</p>
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              onChange: (e) => {
                // Trim the input value
                e.target.value = e.target.value.trim();
                clearErrorMessage();
              },
              required: { value: true, message: "password is required" },
            })}
          />
          <p className="validationError">
            {errors.password?.message || displayErrorMessage}
          </p>
          <br />

          <Button
            disabled={isLoading}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading && <Loader />}
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
}
