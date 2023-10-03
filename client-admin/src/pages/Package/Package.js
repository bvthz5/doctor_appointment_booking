import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Divider,
  Modal,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

import PackageTable from "../../components/tables/packageList.js/PackageTable";
import AddPackage from "../../components/forms/packageForm/AddPackage";

//component for managing packages
const Package = () => {
  const [userRole, setUserRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedHospital, setSelectedHospital] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false); // State to manage filter panel visibility

  const hospitals = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  const clearFilters = () => {
    setSelectedHospital([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    document.title = "Packages";
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  //function to update search input
  const searchPackage = (e) => {
    const searchUsers = e.target.value;
    setSearchValue(searchUsers);
    setCurrentPage(1);
  };

  // Callback function to handle page changes in AdminTable
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleHospitalCheckboxChange = (event, hospitalId) => {
    const updatedHospitals = selectedHospital.includes(hospitalId)
      ? selectedHospital.filter((hospital) => hospital !== hospitalId)
      : [...selectedHospital, hospitalId];
    setSelectedHospital(updatedHospitals);
    setCurrentPage(1);
  };

  const handleAddPackageSuccess = () => {
    setIsModalOpen(false); // Close the modal
  };
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
          {userRole === 2 ? ( // Display when userRole is "2"
            <FilterListIcon
              style={{ marginLeft: "30px" }}
              onClick={toggleFilterPanel}
            />
          ) : (
            <input
              className="searchbox"
              maxLength={255}
              type="search"
              data-testid="Search-input"
              placeholder="Search here"
              value={searchValue}
              onChange={searchPackage}
            />
          )}
        </div>
        <Tooltip title="Add Package" placement="top">
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
              onChange={searchPackage}
            />
            <ClearIcon onClick={clearFilters} />
          </div>

          <div>
            <h4>Hospital</h4>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {hospitals.map((hospital) => (
                <div
                  key={hospital.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
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
        </div>
        <Divider />
      </div>
      <Modal open={isModalOpen}>
        {/* Component for adding a new package */}
        <AddPackage operationType="Add" onSuccess={handleAddPackageSuccess} />
      </Modal>
      {/* Display package table  */}
      <PackageTable
        searchValue={searchValue}
        modalOpen={isModalOpen}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        selectedHospital={selectedHospital}
      />
    </div>
  );
};

export default Package;
