import { useEffect, useState } from "react";
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
import "toastr/build/toastr.min.css";

import "../../../../src/App.css";

export default function HospitalTimeSlot() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const options = [
    { value: 1, label: "9:00" },
    { value: 2, label: "9:30" },
    { value: 3, label: "10:00" },
    { value: 4, label: "10:30" },
    { value: 5, label: "11:00" },
    { value: 6, label: "11:30" },
    { value: 7, label: "12:00" },
    { value: 8, label: "12:30" },
    { value: 9, label: "13:00" },
    { value: 10, label: "14:00" },
    { value: 11, label: "14:30" },
    { value: 12, label: "15:00" },
    { value: 13, label: "15:30" },
  ];

  useEffect(() => {}, []);

  const onSubmit = async (data) => {
    data.timeSlots = selectedTimeSlots;
  };

  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const hospital = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

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
          <CardContent>
            <FormControl variant="outlined">
              <InputLabel htmlFor="hospital-select">Select Hospital</InputLabel>
              <Select style={{width : "200px"}}
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
              width: "100%",
              paddingBottom: "15px",
            }}
          >
            <Button
              style={{
                width: "20%",
                color: "#004fd4",
                backgroundColor: "#c9d3f0",
              }}
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </CardActions>
        </Card>
      </Box>
    </div>
  );
}
