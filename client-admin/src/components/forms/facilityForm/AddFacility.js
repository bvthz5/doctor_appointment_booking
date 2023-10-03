import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardActions,
  CardContent,
  FormHelperText,
  Input,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import errorMessages from "../../../../src/utils/errorMessages.json";
import "../../../../src/App.css";
import toastrOptions from "../../../utils/toastConfig";
import { addFacility, updateFacility } from "../../../service/facilityService";

export default function AddFacility({ operationType, data, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [facilityId, setFacilityId] = useState("");

  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      setValue("facilityName", data.facilityName);
      setValue("description", data.description);
      setFacilityId(data.id);
    }
  }, [data, setValue]);

  const onSubmit = async (data) => {
    if (operationType === "Add") {
      await addFacility(data)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Facility added successfully!",
              "Success",
              toastrOptions
            );
          onSuccess();
        })
        .catch((error) => {
          setDisplayErrorMessage(
            errorMessages[error?.response?.data?.errorCode] ||
              "something went wrong"
          );
          setIsLoading(false);
        });
    } else {
      await updateFacility(data, facilityId)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Facility updated successfully!",
              "Success",
              toastrOptions
            );
          onSuccess();
        })
        .catch((error) => {
          setDisplayErrorMessage(
            errorMessages[error?.response?.data?.errorCode] ||
              "something went wrong"
          );
          setIsLoading(false);
        });
    }
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "400px",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflow: "hidden",
  };

  return (
    <Box component="form" sx={modalstyle}>
      <Card
        sx={{
          minWidth: 330,
          overflow: "auto !important",
          height: "100%",
        }}
      >
        <form>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingBottom: "10px",
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              {operationType} Facility
            </Typography>
            <Input
              placeholder="Facility Name"
              margin="normal"
              fullWidth
              name="facility"
              label="facility"
              autoComplete="current-password"
              {...register("facilityName", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Facility is required",
                required: { value: true, message: "Facility is required" },
                maxLength: {
                  value: 50,
                  message: "Facility must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.facilityName?.message}
            </FormHelperText>

            <TextField
              placeholder="Description"
              margin="normal"
              fullWidth
              name="description"
              multiline
              variant="standard"
              autoComplete="current-password"
              rows={4}
              {...register("description", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Description is required",
                required: { value: true, message: "Description is required" },
                maxLength: {
                  value: 200,
                  message:
                    "Description must only contain at most 200 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.description?.message || displayErrorMessage}
            </FormHelperText>
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
              disabled={isLoading}
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading && <Loader />}
              {operationType}
            </Button>
            <Button
              style={{
                color: "red",
                backgroundColor: "antiquewhite",
                width: "37%",
              }}
              onClick={() => {
                onSuccess();
                reset();
              }}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}
