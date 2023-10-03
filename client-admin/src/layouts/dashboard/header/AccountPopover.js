import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from "@mui/material";
import AdminImage from "../../../assets/icons/adminimage.jpg";
import Swal from "sweetalert2";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";

function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const handleOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const logOut = useCallback(() => {
    Swal.fire({
      title: "Logout?",
      text: "You will be logged out!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }, []);

  const logOutFunctions = useCallback(() => {
    handleClose();
    logOut();
  }, []);

  const changePasswordFunction = useCallback(() => {
    navigate("/changePassword");
  }, [navigate]);
  

  return (
    <>
      <div>
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            position: "relative", // Added positioning
            zIndex: open ? 1 : "auto", // Added zIndex to layer elements
            transition: "transform 0.3s ease", // Added transition effect
            transform: open ? "translateY(-5px) scale(1.05)" : "none", // Added transform for 3D effect
          }}
        >
          <Avatar src={AdminImage} alt="photoURL" />
        </IconButton>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 0,
              mt: 1.5,
              ml: 0.75,
              width: 180,
              "& .MuiMenuItem-root": {
                typography: "body2",
                borderRadius: 0.75,
              },
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              Admin
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
              noWrap
            ></Typography>
          </Box>
          <Divider sx={{ borderStyle: "dashed" }} />
          <Divider sx={{ borderStyle: "dashed" }} />
          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem
            onClick={changePasswordFunction}
            sx={{
              m: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: open ? "blue" : "inherit",
            }}
          >
            <LockResetIcon sx={{ marginRight: 1 }} />
            Change Password
          </MenuItem>

          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem
            onClick={logOutFunctions}
            sx={{
              m: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: open ? "red" : "inherit",
            }}
          >
            <LogoutIcon sx={{ marginRight: 1 }} />
            Logout
          </MenuItem>
        </Popover>
      </div>
    </>
  );
}

export default AccountPopover;
