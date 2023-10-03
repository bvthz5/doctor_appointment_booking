import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const LeaveForm = ({ callApi }) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const [showCustomTimeSlots, setShowCustomTimeSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const leaveType = watch("leaveType");

  const [selectedTimeRanges, setSelectedTimeRanges] = useState([]);

  useEffect(() => {
    console.log(id);
    if (id && !(id > 0)) {
      alert("Invalid leave id");
      navigate(-1);
    }
    if (id > 0) {
      // Edit page
      getLeaveDetails();
    } else {
      // Add page
    }
  }, []);

  const patch = (row) => {
    setValue("doctorName", row.doctorName);
    setValue("doctorName", row.startDate);
    setValue("doctorName", row.endDate);
  };

  const handleLeaveTypeChange = (value) => {
    setValue("leaveType", value);
    if (value === "custom") {
      setShowCustomTimeSlots(true);
    } else {
      setShowCustomTimeSlots(false);
    }
  };

  const handleTimeRangeClick = (timeRange) => {
    if (selectedTimeRanges.includes(timeRange)) {
      setSelectedTimeRanges(
        selectedTimeRanges.filter((range) => range !== timeRange)
      );
    } else {
      setSelectedTimeRanges([...selectedTimeRanges, timeRange]);
    }
  };

  useEffect(() => {
    console.log("Selected Time Ranges:", selectedTimeRanges);
  }, [selectedTimeRanges]);

  const { ref: docRef, ...docProps } = register("doctorId", {
    required: "Doctor selection is required",
  });

  const getLeaveDetails = async () => {
    setLoading(true);

    // HospitalView(leaveId)
    //   .then((response) => {
    //     console.log(response);
    //     patch(response?.data);
    //     window.scrollTo({ top: 0, behavior: "smooth" });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setLoading(false);
  };

  const handleCancel = () => {
    reset();
    navigate("/Leave");
  };

  const handleLeaveSubmit = () => {
    if (id) {
      updateLeave();
    } else {
      addLeave();
    }
  };

  const addLeave = (e) => {
    console.log(e);
    setLoading(true);
    // addLeaveApi(e)
    //   .then(() => {
    // setLoading(false);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Added new Unavailability",
    //       text: `New Unavailability of, "${e.doctorName.trim()}" added `,
    //     });
    //   })
    //   .catch((err) => {
    //     const error = err?.response?.data?.message;
    //     console.log(err?.response);
    // setLoading(false);
    //     if (error) {
    //       Swal.fire({
    //         icon: "warning",
    //         title: error,
    //         backdrop: true,
    //         allowOutsideClick: false,
    //       });
    //     }
    // });

    reset();
  };

  const updateLeave = (e) => {
    // editLeaveApi(leaveId, e)
    //   .then((response) => {
    //     if (response.data.status) {
    //       Swal.fire({
    //         icon: "success",
    //         title: "Unavailability Details Updated",
    //       });
    //     }
    //     getLeaveDetails();
    //   })
    //   .catch((err) => {
    //     console.log("err");
    //   });
    reset();
  };

  const options = [
    { id: 1, label: "10:30" },
    { id: 2, label: "11:00" },
    { id: 3, label: "11:30" },
    { id: 4, label: "12:00" },
    { id: 5, label: "12:30" },
    { id: 6, label: "01:00" },
    { id: 7, label: "02:00" },
    { id: 8, label: "02:30" },
    { id: 9, label: "03:00" },
    { id: 10, label: "03:30" },
    { id: 11, label: "04:00" },
  ];

  const doctors = [
    { id: 1, name: "Doctor 1" },
    { id: 2, name: "Doctor 2" },
    { id: 3, name: "Doctor 3" },
  ];

  const areDatesEqual = startDate === endDate;

  return (
    <div>
      <Box>
        <Card
          sx={{
            maxWidth: "100%",
            margin: "auto",
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
              {id ? "Edit Unavailability" : "Add Unavailability"}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Select Doctor"
              select
              {...docProps}
              defaultValue={""}
              error={!!errors?.doctorId?.message}
              helperText={errors?.doctorId?.message}
              disabled={id}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {doctors.map((row) => (
                <MenuItem key={row.id} value={row.id}>
                  {row.name}
                </MenuItem>
              ))}
            </TextField>
            <Controller
              name="startDate"
              control={control}
              defaultValue=""
              rules={{ required: "Start Date is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={startDate ? "Start Date" : ""}
                  placeholder="MM/DD/YYYY"
                  type="date"
                  InputLabelProps={{
                    shrink: !!startDate,
                  }}
                  InputProps={{
                    style: {
                      height: "56px",
                    },
                  }}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                  error={!!errors.startDate}
                  helperText={errors.startDate ? errors.startDate.message : ""}
                  required
                />
              )}
            />

            <Controller
              name="endDate"
              control={control}
              defaultValue=""
              rules={{
                required: "End Date is required",
                validate: (value) => {
                  // Add custom validation logic here
                  if (value < startDate) {
                    return "End Date cannot be less than Start Date";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={endDate ? "End Date" : ""}
                  placeholder="MM/DD/YYYY"
                  type="date"
                  InputLabelProps={{
                    shrink: !!endDate,
                  }}
                  InputProps={{
                    style: {
                      height: "56px",
                    },
                  }}
                  inputProps={{
                    min: startDate || new Date().toISOString().split("T")[0],
                  }}
                  error={!!errors.endDate}
                  helperText={errors.endDate ? errors.endDate.message : ""}
                  required
                />
              )}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">Leave Type</FormLabel>
              <Controller
                name="leaveType"
                control={control}
                defaultValue=""
                rules={{
                  required: "Leave Type is required",
                  validate: (value) =>
                    areDatesEqual || value !== "custom"
                      ? true
                      : "Leave Type 'Custom' is only allowed when Start Date and End Date are equal",
                }}
                render={({ field }) => (
                  <div>
                    <RadioGroup aria-label="leave-type" {...field} row>
                      <FormControlLabel
                        value="fullDay"
                        control={<Radio />}
                        label="Full Day"
                        onClick={() => handleLeaveTypeChange("fullDay")}
                      />
                      <div
                        style={{
                          pointerEvents: areDatesEqual ? "auto" : "none",
                        }}
                      >
                        <FormControlLabel
                          value="firstHalf"
                          control={<Radio />}
                          label="First Half"
                          onClick={() => handleLeaveTypeChange("firstHalf")}
                          disabled={!areDatesEqual}
                        />
                      </div>

                      <div
                        style={{
                          pointerEvents: areDatesEqual ? "auto" : "none",
                        }}
                      >
                        <FormControlLabel
                          value="secondHalf"
                          control={<Radio />}
                          label="Second Half"
                          onClick={() => handleLeaveTypeChange("secondHalf")}
                          disabled={!areDatesEqual}
                        />
                      </div>

                      <div
                        style={{
                          pointerEvents: areDatesEqual ? "auto" : "none",
                        }}
                      >
                        <FormControlLabel
                          value="custom"
                          control={<Radio />}
                          label="Custom"
                          onClick={() => handleLeaveTypeChange("custom")}
                          style={{
                            cursor: areDatesEqual ? "pointer" : "not-allowed",
                          }}
                          disabled={!areDatesEqual}
                        />
                      </div>
                    </RadioGroup>
                    {errors.leaveType && (
                      <FormHelperText error>
                        {errors.leaveType.message}
                      </FormHelperText>
                    )}
                  </div>
                )}
              />
            </FormControl>

            {showCustomTimeSlots && (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {options.map((option, index) => {
                  // Split the start time into hours and minutes
                  const [startHour, startMinute] = option.label.split(":");
                  // Calculate the end time by adding 30 minutes
                  let endHour = parseInt(startHour, 10);
                  let endMinute = parseInt(startMinute, 10) + 30;

                  // Handle the case where adding 30 minutes goes beyond 60 minutes
                  if (endMinute >= 60) {
                    endHour += 1;
                    endMinute -= 60;
                  }

                  // Format the end time as a string
                  const endTime = `${endHour
                    .toString()
                    .padStart(2, "0")}:${endMinute
                    .toString()
                    .padStart(2, "0")}`;

                  return (
                    <div
                      key={option.id}
                      onClick={() =>
                        handleTimeRangeClick(`${option.label} - ${endTime}`)
                      }
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        margin: "4px",
                        backgroundColor: selectedTimeRanges.includes(
                          `${option.label} - ${endTime}`
                        )
                          ? "lightblue"
                          : "white",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      {`${option.label} - ${endTime}`}
                    </div>
                  );
                })}
              </div>
            )}
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
              onClick={handleSubmit(handleLeaveSubmit)}
            >
              {id ? "Update" : "Submit"}
            </Button>
            <Button
              style={{
                color: "red",
                backgroundColor: "antiquewhite",
                width: "37%",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Box>
    </div>
  );
};

export default LeaveForm;
