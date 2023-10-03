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
import { addService, updateService } from "../../../service/servicesService";

export default function AddService({ operationType, data, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [serviceId, setServiceId] = useState("");

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
      setValue("serviceName", data.serviceName);
      setValue("description", data.description);
      setServiceId(data.id);
    }
  }, [data, setValue]);

  const onSubmit = async (data) => {
    if (operationType === "Add") {
      await addService(data)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Service added successfully!",
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
      await updateService(data, serviceId)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Service updated successfully!",
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
              {operationType} Service
            </Typography>
            <Input
              placeholder="Service Name"
              margin="normal"
              fullWidth
              name="service"
              label="service"
              autoComplete="current-password"
              {...register("serviceName", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Service is required",
                required: { value: true, message: "Service is required" },
                maxLength: {
                  value: 50,
                  message: "Service must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.serviceName?.message}
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
