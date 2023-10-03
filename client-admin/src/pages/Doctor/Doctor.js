import React, { useEffect, useState } from "react";

import { Button, Checkbox, Divider, Modal, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";


import DoctorTable from "../../components/tables/doctorList/DoctorTable";
import AddDoctor from "../../components/forms/doctorForm/AddDoctor";

//doctor component for managing doctors
const Doctor = () => {
  const specialty = [
    { label: "Internal medicine", id: 1 },
    { label: "urology", id: 14 },
    { label: "Rheumatology", id: 16 },
    { label: "Endocrinology", id: 15 },
    { label: "Pulmonology", id: 11 },
  ];

  const hospitals = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  const subSpecialty = [
    { label: "Anesthesiology", id: 24 },
    { label: "Nephrology", id: 13 },
    { label: "Urology", id: 18 },
    { label: "Cardio", id: 1 },
    { label: "Infectious Diseases", id: 17 },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState([]);
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false); // State to manage filter panel visibility

  const [userRole, setUserRole] = useState(null);

  //function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  const clearFilters = () => {
    setSelectedHospital([]);
    setSelectedSpecialty([]);
    setSelectedSubSpecialty([]);
    setCurrentPage(1);
  };

  const handleHospitalCheckboxChange = (event, hospitalId) => {
    const updatedHospitals = selectedHospital.includes(hospitalId)
      ? selectedHospital.filter((hospital) => hospital !== hospitalId)
      : [...selectedHospital, hospitalId];
    setSelectedHospital(updatedHospitals);
    setCurrentPage(1);
  };

  const handleSpecialtyChange = (event, specialtyId) => {
    const updatedSpecialties = selectedSpecialty.includes(specialtyId)
      ? selectedSpecialty.filter((specialty) => specialty !== specialtyId)
      : [...selectedSpecialty, specialtyId];
    setSelectedSpecialty(updatedSpecialties);
    setCurrentPage(1);
  };

  const handleSubSpecialtyChange = (event, subSpecialtyId) => {
    const updatedSubSpecialties = selectedSubSpecialty.includes(subSpecialtyId)
      ? selectedSubSpecialty.filter((specialty) => specialty !== subSpecialtyId)
      : [...selectedSubSpecialty, subSpecialtyId];
    setSelectedSubSpecialty(updatedSubSpecialties);
    setCurrentPage(1);
  };

  //function to update search input
  const searchUser = (e) => {
    const searchUsers = e.target.value;
    setSearchValue(searchUsers);
    setCurrentPage(1);
  };

  // Callback function to handle page changes in AdminTable
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //function to handle successfull addition of doctor
  const handleAddDoctorSuccess = () => {
    setIsModalOpen(false); // Close the modal
  };


  useEffect(() => {
    document.title = "Doctors";
    // Retrieve the user's role from localStorage
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "8px", // Add padding for spacing
          }}
        >
          <FilterListIcon
            style={{ marginLeft: "30px" }}
            onClick={toggleFilterPanel}
          />
        </div>

        <Tooltip title="Add Doctor" placement="top">
          <Button
            size="small"
            style={{
              fontSize: "1.5rem",
              backgroundColor: "#4B4453",
              color: "#FFFFFF",
              height: "40px",
              marginRight: "36px",
              marginTop : "-10px"
            }}
            onClick={openModal}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </div>

      <div
        style={{
          display: isFilterPanelOpen ? "block" : "none",
          maxHeight: "200px", // Adjust the max height as needed
          overflowY: "scroll", // Add scroll bar to the filter panel div
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Display items in a column
            border: "1px solid #ccc",
            padding: "5px",
            marginRight: "40px",
            marginLeft: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <input
              className="searchbox"
              maxLength={255}
              type="search"
              data-testid="Search-input"
              placeholder="Search here"
              value={searchValue}
              onChange={searchUser}
            />
            <ClearIcon onClick={clearFilters} />
          </div>
          {userRole === 2 && (
            <div>
              <h4>Hospitals</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "20px",
                    }}
                  >
                    <Checkbox
                      checked={selectedHospital.includes(hospital.id)}
                      onChange={(event) =>
                        handleHospitalCheckboxChange(event, hospital.id)
                      }
                    />
                    <span>{hospital.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(selectedHospital.length > 0 || userRole===1) && (
            <div>
              <h4>Specialty</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {specialty.map((specialty) => (
                  <div
                    key={specialty.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedSpecialty.includes(specialty.id)}
                      onChange={(event) =>
                        handleSpecialtyChange(event, specialty.id)
                      }
                    />
                    <span>{specialty.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedSpecialty.length > 0 && (
            <div>
              <h4>Sub Specialty</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {subSpecialty.map((subSpecialty) => (
                  <div
                    key={subSpecialty.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedSubSpecialty.includes(subSpecialty.id)}
                      onChange={(event) =>
                        handleSubSpecialtyChange(event, subSpecialty.id)
                      }
                    />
                    <span>{subSpecialty.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Divider />
      </div>

      <Modal open={isModalOpen}>
        {/* Component for adding a new doctor */}
        <AddDoctor operationType="Add" onSuccess={handleAddDoctorSuccess} />
      </Modal>

      {/* Display doctor table based on search value */}
      <DoctorTable
        searchValue={searchValue}
        selectedHospital={selectedHospital}
        selectedSpecialty={selectedSpecialty}
        selectedSubSpecialty={selectedSubSpecialty}
        modalOpen={isModalOpen}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Doctor;
