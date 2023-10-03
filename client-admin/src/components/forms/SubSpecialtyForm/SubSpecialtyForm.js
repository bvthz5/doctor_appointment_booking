import React, { useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useWindowDimensions from "../../../utils/WindowDimensions";
import AddIcon from "@mui/icons-material/Add";
import styles from "../../../pages/Specialty/Specialty.module.css";
import {
  addSubSpecialtyApi,
  editSubSpecialtyApi,
} from "../../../service/subSpecialtyService";

const SubSpecialtyForm = ({ id: editData, setId, callApi }) => {
  const { width } = useWindowDimensions();
  const [openModal, setOpenModal] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ mode: "onChange" });

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    if (editData) {
      setId(null);
    }
  }, [editData, setId]);

  useEffect(() => {
    if (editData) {
      const patch = () => {
        setValue("SubSpecialtyName", editData.subSpecialtyName);
        setValue("description", editData.description);
        setValue("specialty", editData.type);
      };

      handleOpenModal();
      patch();
      console.log(editData);
    }
  }, [editData, setValue]);

  //add api
  const addSubSpecialties = (e) => {
    console.log(e);
    if (!e.subSpecialtyName.trim()) {
      toast.error("Whitespace are not allowed!", { toastId: "333" });
      return;
    }

    if (editData) {
      updateSubSpecialty(e);
    } else {
      handleCloseModal();

      addSubSpecialtyApi(e)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Added new SubSpecialty",
            text: `New SubSpecialty, "${e.subSpecialtyName.trim()}" added `,
          });
          callApi();
          handleCloseModal();
        })
        .catch((err) => {
          const error = err?.response?.data?.message;
          console.log(err?.response);

          if (error) {
            Swal.fire({
              icon: "warning",
              title: error,
              backdrop: true,
              allowOutsideClick: false,
            });
          }
        });
    }
    reset();
  };

  //edit api

  const updateSubSpecialty = (e) => {
    editSubSpecialtyApi(editData?.id, e)
      .then((response) => {
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "SubSpecialty Details Updated",
          });
        }
        handleCloseModal();
        callApi();
      })
      .catch((err) => {
        const error = err?.response?.data?.message;
        console.log(err?.response);

        if (error) {
          Swal.fire({
            icon: "warning",
            title: error,
            backdrop: true,
            allowOutsideClick: false,
          });
        }
      });
    reset();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: "75vh",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflow: "hidden",
  };

  const { ref: specialtyRef, ...specialtyProps } = register("specialtyId", {
    required: "Specialty selection is required",
  });

  const rows = [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Dermatology" },
    { id: 3, name: "Gastroenterology" },
    { id: 4, name: "Neurology" },
    { id: 5, name: "Orthopedics" },
  ];

  return (
    <div>
      <div>
        <Tooltip title="Add Subspecialty" placement="top">
          <button
            onClick={handleOpenModal}
            className={styles["addcategorybutton"]}
          >
            <AddIcon className={styles["inline-icon"]} />
            {width > 420}
          </button>
        </Tooltip>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Card
            sx={{
              minWidth: 330,
              overflow: "auto !important",
              height: "100%",
            }}
          >
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                paddingBottom: "20px",
              }}
            >
              <Typography variant="h5" gutterBottom>
                {`${editData ? "Edit" : "Add"} Subspecialty`}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Subspecialty Name"
                {...register("subSpecialtyName", {
                  required: "Subspecialty Name is required",
                  maxLength: {
                    value: 50,
                    message:
                      "Subspecialty Name must only contain at most 50 characters",
                  },
                })}
                error={!!errors?.subSpecialtyName}
                helperText={errors?.subSpecialtyName?.message}
              />

              <TextField
                fullWidth
                multiline
                variant="outlined"
                label="Description"
                rows={8}
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 200,
                    message:
                      "Description must only contain at most 200 characters",
                  },
                })}
                error={!!errors?.description}
                helperText={errors?.description?.message}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Select Specialty"
                select
                {...specialtyProps}
                defaultValue={""}
                error={!!errors?.specialtyId?.message}
                helperText={errors?.specialtyId?.message}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {rows.map((specialty) => (
                  <MenuItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </MenuItem>
                ))}
              </TextField>
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
                type="submit"
                value="submit"
                onClick={handleSubmit(addSubSpecialties)}
              >
                Update
              </Button>
              <Button
                style={{
                  color: "red",
                  backgroundColor: "antiquewhite",
                  width: "37%",
                }}
                onClick={() => {
                  handleCloseModal();
                  reset();
                }}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>  
    </div>
  );
};

export default SubSpecialtyForm;
