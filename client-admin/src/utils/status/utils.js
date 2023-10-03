import React, { useState } from "react";
import style from "./util.module.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPrescription from "../../components/forms/Booking/AddPrescription";

export const StatusButton = ({ status, row }) => {
  console.log(status,row );
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState(null);
  const [isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen] = useState(false);

  const handleClick = () => {
    if (status !== 3 && status !== 4) {
      setOpenDialog(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (status !== 3 && status !== 4) {
      setAction("cancel");
      handleClose();
    }
  };

  const handleAddPrescription = () => {
    if (status === 2) {
      const currentDate = new Date().toLocaleDateString();
      if (currentDate > row?.BookingDate 
        // && (!row?.histories || row?.histories.length === 0)
        ) {
        setAction("addPrescription");
        setIsAddPrescriptionModalOpen(true);
      } else {
        handleClose();
      }
    }
  };

  const handleUpdate = () => {
    // Handle the update logic here
    // You can call an API or perform the necessary actions
    handleClose();
  };

  let buttonProps = {};

  switch (status) {
    case 1:
      buttonProps = {
        color: "grey",
        text: "Pending",
        width: "70px",
        height: "30px",
        tooltip: "Click to approve or reject",
        clickHandler: handleClick,
        dialogContent: (
          <>
            <DialogContent sx={{ textAlign: "center" }}>
              <p>Do you want to approve or reject this request?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddPrescription} color="primary">
                Approve
              </Button>
              <Button onClick={handleCancel} color="secondary">
                Reject
              </Button>
            </DialogActions>
          </>
        ),
      };
      break;
    case 2:
      buttonProps = {
        color: "green",
        text: "Approved",
        width: "70px",
        height: "30px",
        tooltip: "Click to cancel or add prescription",
        clickHandler: handleClick,
        dialogContent: (
          <>
            <DialogContent sx={{ textAlign: "center" }}>
              <p>
                Do you want to cancel or add a prescription for this request?
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={setIsAddPrescriptionModalOpen} color="primary">
                Add Prescription
              </Button>
              <Button onClick={handleCancel} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </>
        ),
      };

      break;
    case 3:
      buttonProps = {
        color: "purple",
        text: "Rejected",
        width: "70px",
        height: "30px",
        tooltip: "Rejected",
        clickHandler: null, // No action for Rejected status
        disabled: true, // Disable the button for Rejected status
      };
      break;
    case 4:
      buttonProps = {
        color: "red",
        text: "Cancelled",
        width: "70px",
        height: "30px",
        tooltip: "Cancelled",
        clickHandler: null, // No action for Cancelled status
        disabled: true, // Disable the button for Cancelled status
      };
      break;
    default:
      return null;
  }

  return (
    <div>
      <Tooltip title={buttonProps.tooltip} placement="top">
        <button
          className={style["statusCss"]}
          style={{
            color: buttonProps.color,
            backgroundColor: "rgba(7, 92, 49, 0.16)",
            cursor: buttonProps.disabled ? "not-allowed" : "pointer",
            width: buttonProps.width,
            height: buttonProps.height,
          }}
          onClick={buttonProps.clickHandler}
          disabled={buttonProps.disabled}
        >
          {buttonProps.text}
        </button>
      </Tooltip>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {buttonProps.dialogContent}
      </Dialog>

      {/* AddPrescriptionModal */}
      <Dialog open={isAddPrescriptionModalOpen} onClose={() => setIsAddPrescriptionModalOpen(false)}>
        <DialogTitle>
          Add Prescription
          <IconButton
            aria-label="close"
            onClick={() => setIsAddPrescriptionModalOpen(true)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddPrescription
            open={isAddPrescriptionModalOpen}
            handleClose={() => setIsAddPrescriptionModalOpen(false)}
            handleUpdate={handleUpdate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const statusBadge = (status) => {
  switch (status) {
    case 1:
      return (
        <div
          className={style["statusCss"]}
          style={{ color: "green", backgroundColor: "rgba(7, 92, 49, 0.16)" }}
        >
          Active
        </div>
      );
    case 0:
    default:
      return (
        <div
          className={style["statusCss"]}
          style={{ color: "#4a63ee", backgroundColor: "#0f1ef129" }}
        >
          Inactive
        </div>
      );
  }
};

export const packageStatus = (validity) => {
  const currentDate = new Date().toISOString().split("T")[0];

  if (validity < currentDate) {
    return (
      <div
        className={style["statusCss"]}
        style={{
          color: "rgb(238 74 74)",
          backgroundColor: "rgb(249 8 8 / 35%)",
        }}
      >
        Expired
      </div>
    );
  } else {
    return (
      <div
        className={style["statusCss"]}
        style={{ color: "green", backgroundColor: "rgba(7, 92, 49, 0.16)" }}
      >
        Active
      </div>
    );
  }
};
