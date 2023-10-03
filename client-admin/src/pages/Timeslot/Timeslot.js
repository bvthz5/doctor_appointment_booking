import React, { useCallback, useEffect, useState } from "react";

import {
  Autocomplete,
  Button,
  Modal,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import TimeSlotTable from "../../components/tables/timeSlotList/TimeSlotTable";
import AddTimeSlot from "../../components/forms/timeSlotForm/addTimeSlot";
import DoctorTimeSlot from "../../components/tables/timeSlotList/DoctorTimeSlot";
import DoctorTimeSlotForm from "../../components/forms/timeSlotForm/DoctorTimeSlotForm";
import HospitalTimeSlot from "../../components/tables/timeSlotList/HospitalTimeSlot";

//timeslot component for managing timeslots
const Timeslot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); //Initialize modal state
  const [doctorTimeSlots, setDoctorTimeSlots] = useState(false);
  const [hospitalTimeSlots, setHospitalTimeSlots] = useState(true);
  const [allTimeSlots, setAllTimeSlots] = useState(false);
  const [userRole, setUserRole] = useState("");

  const hospitals = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  useEffect(() => {
    document.title = "TimeSlots";
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
  }, []);

  //function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleDoctorTimeSlots = useCallback(() => {
    setDoctorTimeSlots(true);
    setHospitalTimeSlots(false);
    setAllTimeSlots(false);
  }, []);

  // Function to handle "Hospital Time Slots" toggle button click
  const handleHospitalTimeSlots = useCallback(() => {
    setHospitalTimeSlots(true);
    setDoctorTimeSlots(false);
    setAllTimeSlots(false);
  }, []);

  const handleAllTimeSlots = useCallback(() => {
    setAllTimeSlots(true);
    setHospitalTimeSlots(false);
    setDoctorTimeSlots(false);
  }, []);

  //function to handle successfull addition of timeslots
  const handleAddTimeslot = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div>
      <Stack spacing={1}>
        {/* toggle button start */}
        <div>
          <ToggleButtonGroup exclusive aria-label="text alignment">
            <ToggleButton
              onClick={handleHospitalTimeSlots}
              aria-label="centered"
              style={{
                color: "black",
                backgroundColor: hospitalTimeSlots ? "#b6c3e0" : "#ffffff",
              }}
            >
              Hospital Time Slots
            </ToggleButton>
            <ToggleButton
              onClick={handleDoctorTimeSlots}
              aria-label="left aligned"
              style={{
                color: "black",
                backgroundColor: doctorTimeSlots ? "#b6c3e0" : "#ffffff",
              }}
            >
              Doctor Time Slots
            </ToggleButton>
            {userRole === 2 && (
              <ToggleButton
                onClick={handleAllTimeSlots}
                aria-label="right aligned"
                style={{
                  color: "black",
                  backgroundColor: allTimeSlots ? "#b6c3e0" : "#ffffff",
                }}
              >
                Master table{" "}
              </ToggleButton>
            )}
          </ToggleButtonGroup>{" "}
        </div>
        {/* toggle button end */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px", // Add padding for spacing
            }}
          >
            {doctorTimeSlots && (
              <>
                {userRole === 2 && ( // Display when userRole is "2"
                  <>
                    <Autocomplete
                      multiple
                      disablePortal
                      limitTags={1}
                      size="small"
                      id="combo-box-demo1"
                      options={hospitals}
                      getOptionLabel={(option) => option.label} // Set the label property
                      sx={{
                        width: 200,
                        paddingRight: "15px",
                        marginLeft: "35px",
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "black",
                          },
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select hospital" />
                      )}
                    />
                  </>
                )}
                <div>
                  <input
                    className={userRole === 1 ? "searchbox2" : "searchbox"}
                    maxLength={255}
                    type="search"
                    data-testid="Search-input"
                    placeholder="Search here"
                  />
                </div>
              </>
            )}
          </div>
          {!hospitalTimeSlots ? (
            <Tooltip title="Add Timeslot" placement="top">
              <Button
                size="small"
                style={{
                  fontSize: "1.5rem",
                  backgroundColor: "#4B4453",
                  color: "#FFFFFF",
                  height: "40px",
                  marginRight: "36px",
                }}
                onClick={openModal}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          ) : (
            ""
          )}
        </div>
        {/* Display timeslots table  */}
        {doctorTimeSlots && <DoctorTimeSlot modalOpen={isModalOpen} />}
        {allTimeSlots && <TimeSlotTable modalOpen={isModalOpen} />}
        {hospitalTimeSlots && <HospitalTimeSlot modalOpen={isModalOpen} />}
      </Stack>
      <Modal open={isModalOpen}>
        {/* Component for adding a new time slot/add new time into doctor */}
        {!doctorTimeSlots ? (
          <AddTimeSlot operationType="Add" onSuccess={handleAddTimeslot} />
        ) : (
          <DoctorTimeSlotForm
            operationType="Add"
            onSuccess={handleAddTimeslot}
          />
        )}
      </Modal>
    </div>
  );
};

export default Timeslot;
