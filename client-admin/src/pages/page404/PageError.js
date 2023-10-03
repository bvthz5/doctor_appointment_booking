import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";

import { styled } from "@mui/material/styles";
import { Button, Typography, Container, Box } from "@mui/material";

// ----------------------------------------------------------------------

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  perspective: "1000px",
  fontSize: "3rem",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  transformStyle: "preserve-3d",
}));

const AnimatedTitle = styled("span")(({ theme }) => ({
  display: "inline-block",
  fontSize: "2rem", // Adjust the font size here
  position: "relative",
  overflow: "hidden",
  transform: "scale(1, 0)",
  animation: "centerIn 1s forwards",
  "@keyframes centerIn": {
    "0%": {
      transform: "scale(1, 0)",
    },
    "100%": {
      transform: "scale(1, 1)",
    },
  },
}));

const AnimatedImage = styled("img")(({ theme }) => ({
  height: 260,
  mx: "auto",
  my: { xs: 5, sm: 10 },
  transition: "transform 5s infinite alternate",
  animation: "shakeImage 5s infinite alternate",
  "@keyframes shakeImage": {
    "0%": {
      transform: "translateZ(0) rotate(0deg)",
    },
    "100%": {
      transform: "translateZ(-10px) rotate(5deg)",
    },
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const text = "Sorry, Page Not Found!";
    const delay = 100; // milliseconds
    const letterArray = text.split("");
    let timeout = 0;

    setLetters([]);

    letterArray.forEach((letter, index) => {
      timeout += delay;
      setTimeout(() => {
        setLetters(prevLetters => [...prevLetters, letter]);
      }, timeout);
    });
  }, []);

  const formattedText = letters.join("");

  return (
    <div>
      <Helmet>
        <title>404 Page Not Found | Minimal UI</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: "center", alignItems: "center" }}>
          <AnimatedTypography variant="h3" paragraph>
            <AnimatedTitle>
              {formattedText}
            </AnimatedTitle>
          </AnimatedTypography>

          <Box my={5}>
            <Typography sx={{ color: "text.secondary" }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
              mistyped the URL? Be sure to check your spelling.
            </Typography>
          </Box>

          <AnimatedImage src="/assets/svg/illustration_404.svg" />

          <Box my={5}>
            <AnimatedButton
              to="/"
              size="large"
              variant="contained"
              component={RouterLink}
            >
              Go to Home
            </AnimatedButton>
          </Box>
        </StyledContent>
      </Container>
    </div>
  );
}
