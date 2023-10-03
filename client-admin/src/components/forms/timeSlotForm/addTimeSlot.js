import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardActions,
  CardContent,
  FormHelperText,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import errorMessages from "../../../../src/utils/errorMessages.json";
import "../../../../src/App.css";
import toastrOptions from "../../../utils/toastConfig";
import { addTimeSlot, updateTimeSlot } from "../../../service/timeSlotService";

export default function AddTimeSlot({ operationType, data, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [startTime, setStartTime] = useState(dayjs("2022-04-17T08:00"));
  const [endTime , setEndTime] = useState(dayjs("2022-04-17T23:00"));

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      setValue("timeSlot", data.timeSlot);
    }
  }, [data, setValue]);

  const onSubmit = async (data) => {
    if (operationType === "Add") {
      await addTimeSlot(data)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Time slot added successfully!",
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
    } else if (operationType === "Update") {
      await updateTimeSlot(data, timeSlot)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Time slot updated successfully!",
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
    height: "300px",
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
              {operationType} Timeslot
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start time"
                value={startTime}
                minutesStep={30}
                onChange={(newValue) => setStartTime(newValue)}
              />
              <TimePicker
                label="End time"
                value={endTime}
                minutesStep={30}
                onChange={(newValue) => setEndTime(newValue)}
              />

            </LocalizationProvider>
            <FormHelperText className="validationError">
              {errors.timeSlot?.message || displayErrorMessage}
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
