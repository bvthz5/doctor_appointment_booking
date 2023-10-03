import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "toastr/build/toastr.min.css";

import "../../../../src/App.css";

export default function DoctorTimeSlotForm({ operationType, data, onSuccess }) {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    reset,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(
    data ? data?.doctor?.id : ""
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(
    data ? data?.hospital?.id : ""
  );

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleCustomTimeSlotChange = (event, selectedTimeSlot) => {
    const isChecked = event.target.checked;
    setSelectedTimeSlots((prevSelected) => {
      if (isChecked) {
        // If checkbox is checked, add it to the array
        return [...prevSelected, selectedTimeSlot];
      } else {
        // If checkbox is unchecked, remove it from the array
        return prevSelected.filter((slot) => slot !== selectedTimeSlot);
      }
    });
  };

  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const doctors = [
    { label: "Alen Joy", id: 2 },
    { label: "Dr Rebecca Williams", id: 4 },
    { label: "Adminwwwwww", id: 1 },
    { label: "Prince Joseph", id: 3 },
    { label: "Dr. Ava Walker", id: 5 },
  ];

  const hospital = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  const options = [
    { value: 1, label: "9:00" },
    { value: 2, label: "10:30" },
    { value: 3, label: "11:00" },
    { value: 4, label: "11:30" },
    { value: 5, label: "12:30" },
    { value: 6, label: "14:00" },
    { value: 7, label: "14:30" },
    { value: 8, label: "15:00" },
    { value: 9, label: "15:30" },
  ];

  useEffect(() => {
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
    if (role === 1) {
      setSelectedHospital(1);
    }
    if (data) {
      setSelectedTimeSlots(data.timeSlots.map((slot) => slot.value));
    }
  }, [data, setValue]);

  const onSubmit = async (data) => {
    data.timeSlots = selectedTimeSlots
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "550px",
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
              {operationType} Doctor Timeslot
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

            <FormControl variant="outlined">
              <InputLabel htmlFor="doctor-select">Select Doctor</InputLabel>
              <Select
                label="Select Doctor"
                {...register("doctor", {
                  onChange: () => {
                    clearErrorMessage();
                  },
                  required: {
                    value: true,
                    message: "Please select doctor",
                  },
                })}
                inputProps={{
                  name: "doctor",
                  id: "doctor-select",
                }}
                value={selectedDoctor}
                onChange={handleDoctorChange}
              >
                {selectedHospital
                  ? doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.label}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
              {!selectedDoctor && errors?.doctor && (
                <FormHelperText className="validationError">
                  {errors.doctor.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Select Time slots</FormLabel>
              <FormGroup
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {options.map((option) => {
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
                  // Create the label in the desired format
                  const label = `${option.label}-${endTime}`;

                  return (
                    <div
                      key={option.value}
                      style={{
                        width: "50%",
                        boxSizing: "border-box",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedTimeSlots.includes(option.value)}
                            onChange={(event) =>
                              handleCustomTimeSlotChange(event, option.value)
                            }
                          />
                        }
                        label={label}
                      />
                    </div>
                  );
                })}
              </FormGroup>
            </FormControl>
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
