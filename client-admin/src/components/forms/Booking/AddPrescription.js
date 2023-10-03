import React from 'react';
import { Modal, Box, Card, CardContent, Typography, TextField, Button, MenuItem, CardActions } from "@mui/material";
import { useForm } from 'react-hook-form';

const editModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "450px",
  bgcolor: "background.paper",
  borderRadius: "20px",
  overflow: "hidden",
};

const AddPrescription = ({ open, handleClose, handleUpdate }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors: formErrors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    // Handle form submission here
    handleUpdate(data);
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={editModalStyle}>
          <Card
            sx={{
              minWidth: 330,
              overflow: "auto !important",
              height: "100%",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  paddingBottom: "10px",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Add Prescription
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Title"
                  {...register("title", {
                    validate: (value) =>
                      value.trim() !== "" ? null : "Title is required",
                    required: { value: true, message: "Title is required" },
                    maxLength: {
                      value: 50,
                      message: "Title must only contain at most 50 characters",
                    },
                  })}
                  error={!!formErrors?.title}
                  helperText={formErrors?.title?.message}
                  InputLabelProps={{
                    shrink: !!getValues("title"),
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  label="Description"
                  rows={8}
                  {...register("content", {
                    validate: (value) =>
                      value.trim() !== "" ? null : "Content is required",
                    required: { value: true, message: "Content is required" },
                    maxLength: {
                      value: 1000,
                      message: "Content must only contain at most 1000 characters",
                    },
                  })}
                  error={!!formErrors?.content}
                  helperText={formErrors?.content?.message}
                  InputLabelProps={{
                    shrink: !!getValues("content"),
                  }}
                />
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                  paddingBottom: "15px",
                }}
              >
                <Button
                  style={{
                    width: "37%",
                    color: "#004fd4",
                    backgroundColor: "#c9d3f0",
                  }}
                  size="small"
                  type="submit"
                  value="submit"
                >
                  Update
                </Button>
                <Button
                  style={{
                    color: "red",
                    backgroundColor: "antiquewhite",
                    width: "37%",
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </CardActions>
            </form>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}

export default AddPrescription;
