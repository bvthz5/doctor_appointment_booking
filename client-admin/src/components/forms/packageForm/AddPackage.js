
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import toastr from "toastr";
import "toastr/build/toastr.min.css";

import { addPackage, editPackage } from "../../../service/packageService";
import toastrOptions from "../../../utils/toastConfig";
import errorMessages from "../../../../src/utils/errorMessages.json";



export default function AddPackage({ operationType, data, onSuccess }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(
    data ? data?.hospital?.id : ""
  );
  const [packageId,setPackageId] = useState("")

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const hospital = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  useEffect(() => {
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
    if (data) {
      setValue("name", data?.packageName);
      setValue("price", data?.price);
      setValue("offer", data?.off);
      setValue("validity",data?.validity)
      setValue("hospital",data?.hospital?.id)
      setPackageId(data.id)
      
    }
  }, [data]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (operationType === "Add") {
      await addPackage(data)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Package added successfully!",
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
    }else{
      await editPackage(data, packageId)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Package updated successfully!",
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
    height: "580px",
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
              {operationType} Package
            </Typography>

            {userRole === 2 && (
              <FormControl variant="outlined">
                <InputLabel htmlFor="hospital-select">
                  Select Hospital
                </InputLabel>
                <Select
                  label="Select Hospital"
                  {...register("hospital", {
                    onChange: () => {
                      clearErrorMessage();
                    },
                    required: {
                      value: true,
                      message: "Please select hospital",
                    },
                  })}
                  inputProps={{
                    name: "hospital",
                    id: "hospital-select",
                  }}
                  value={selectedHospital}
                  onChange={handleHospitalChange}
                >
                  {hospital.map((hospital) => (
                    <MenuItem key={hospital.id} value={hospital.id}>
                      {hospital.label}
                    </MenuItem>
                  ))}
                </Select>
                {!selectedHospital && errors?.hospital && (
                  <FormHelperText className="validationError">
                    {errors.hospital.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <TextField
              placeholder="Package Name"
              fullWidth
              name="name"
              label="Package Name"
              autoComplete="current-password"
              {...register("name", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value?.trim() !== "" ? null : "Package name is required",
                required: { value: true, message: "Package name is required" },
                maxLength: {
                  value: 50,
                  message:
                    "Package name must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.name?.message}
            </FormHelperText>

            <TextField
              placeholder="Amount"
              fullWidth
              label="Amount"
              name="price"
              autoComplete="price"
              autoFocus
              {...register("price", {
                onChange: () => {
                  clearErrorMessage();
                },
                required: { value: true, message: "Amount is required" },
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: "Amount must be a number",
                },
                min: {
                  value: 1,
                  message: "Amount should be number greater than 1",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.price?.message}
            </FormHelperText>

            <TextField
              placeholder="Offer"
              fullWidth
              label="Offer"
              name="offer"
              autoComplete="offer"
              autoFocus
              {...register("offer", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value?.trim() !== "" ? null : "Offer is required",
                required: { value: true, message: "Offer is required" },
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: "Amount must be a number",
                },
                min: {
                  value: 1,
                  message: "Offer should be number greater than 1",
                },
                max: {
                  value: 100,
                  message: "Offer should be number lessthan than 100",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.offer?.message}
            </FormHelperText>

            <TextField
              type="Date"
              // onKeyDown={onKeyDown}
              autoComplete="off"
              id="exampleFormControlInput1"
              name="fromDOB"
              size="medium"
              label="Valid Upto"
              inputProps={{
                "data-testid": "search-employee-startDate",
                min: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Set the min date to tomorrow
              }}
              InputLabelProps={{
                shrink: true,
              }}
              {...register("validity", {
                onChange: () => {
                  clearErrorMessage();
                },
                required: { value: true, message: "Validity is required" }
              })}
            />
            <FormHelperText className="validationError">
              {errors.validity?.message || displayErrorMessage}
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
