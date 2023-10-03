import React, { useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  addSpecialty,
  editSpecialty,
} from "../../../service/specialtyService";
import Swal from "sweetalert2";
import useWindowDimensions from "../../../utils/WindowDimensions";
import AddIcon from "@mui/icons-material/Add";
import styles from "../../../pages/Specialty/Specialty.module.css";

const SpecialtyForm = ({ id: editData, setId, callApi }) => {
  const { width } = useWindowDimensions();
  const [openAgent, setOpenAgent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({ mode: "onChange" });

  const handleOpenAgent = () => setOpenAgent(true);

  const handleCloseAddModal = useCallback(() => {
    setOpenAgent(false);
    if (editData) {
      setId(null);
    }
  }, [editData, setId]);

  useEffect(() => {
    if (editData) {
      const patch = () => {
        setValue("specialtyName", editData.specialtyName);
        setValue("description", editData.description);
      };

      handleOpenAgent();
      patch();
      console.log(editData);
    }
  }, [editData, setValue]);


  //add api
  const addSpecialties = (e) => {
    console.log(e);
    if (!e.specialtyName.trim()) {
      toast.error("Whitespace are not allowed!", { toastId: "333" });
      return;
    }

    if (editData) {
      updateSpecialty(e);
    } else {
      handleCloseAddModal();

      addSpecialty(e)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Added new Specialty",
            text: `New Specialty, "${e.specialtyName.trim()}" added `,
          });
          callApi();
          handleCloseAddModal();
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

  const updateSpecialty = (e) => {
    editSpecialty(editData?.id, e)
      .then((response) => {
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Agent Details Updated",
          });
        }
        handleCloseAddModal();
        callApi();
      })
      .catch((err) => {
        console.log("err");
      });
    reset();
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: "65vh",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflow: "hidden",
  };

  return (
    <div>
      <div>
        <Tooltip title="Add Specialty" placement="top">
          <button
            onClick={handleOpenAgent}
            className={styles["addcategorybutton"]}
          >
            <AddIcon className={styles["inline-icon"]} />
            {width > 420}
          </button>
        </Tooltip>
      </div>
      <Modal open={openAgent} onClose={handleCloseAddModal}>
        <Box sx={modalstyle}>
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
                {`${editData ? "Edit" : "Add"} Specialty`}
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                label="Specialty Name"
                {...register("specialtyName", {
                  required: "Specialty Name is required",
                  maxLength: {
                    value: 50,
                    message:
                      "Specialty Name must only contain at most 50 characters",
                  },
                })}
                error={!!errors?.specialtyName}
                helperText={errors?.specialtyName?.message}
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
                onClick={handleSubmit(addSpecialties)}
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
                  handleCloseAddModal();
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

export default SpecialtyForm;
