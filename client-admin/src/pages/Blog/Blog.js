import React, { useEffect, useState } from "react";

import { Checkbox, Divider } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

import BlogTable from "../../components/tables/blogList.js/BlogTable";

//component for managing blogs
const Blog = () => {
  const [userRole, setUserRole] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false); // State to manage filter panel visibility
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const hospitals = [
    { label: "medicity", id: 1 },
    { label: "Sunrise", id: 2 },
    { label: "Appolo", id: 3 },
    { label: "Amritha", id: 4 },
    { label: "St.Johns", id: 5 },
  ];

  const doctors = [
    { label: "Alen Joy", id: 2 },
    { label: "Dr Rebecca Williams", id: 4 },
    { label: "Adminwwwwww", id: 1 },
    { label: "Prince Joseph", id: 3 },
    { label: "Dr. Ava Walker", id: 5 },
  ];

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!isFilterPanelOpen);
  };

  //function to update search input
  const searchBlog = (e) => {
    const searchTitle = e.target.value;
    setSearchValue(searchTitle);
    setCurrentPage(1);
  };

  // Callback function to handle page changes in AdminTable
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setSelectedHospitals([]);
    setSelectedDoctors([]);
    setCurrentPage(1);
  };

  const handleHospitalCheckboxChange = (event, hospitalId) => {
    const updatedHospitals = selectedHospitals.includes(hospitalId)
      ? selectedHospitals.filter((hospital) => hospital !== hospitalId)
      : [...selectedHospitals, hospitalId];
    setSelectedHospitals(updatedHospitals);
    setCurrentPage(1);
  };

  const handleDoctorCheckboxChange = (event, doctorId) => {
    const updatedDoctors = selectedDoctors.includes(doctorId)
      ? selectedDoctors.filter((doctor) => doctor !== doctorId)
      : [...selectedDoctors, doctorId];
    setSelectedDoctors(updatedDoctors);
    setCurrentPage(1);
  };

  useEffect(() => {
    document.title = "Blogs";
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
              onChange={searchBlog}
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
                      checked={selectedHospitals.includes(hospital.id)}
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
          {(selectedHospitals.length > 0 || userRole===1) && (
            <div>
              <h4>Doctors</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {doctors.map((doctor) => (
                  <div
                    key={doctor.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      checked={selectedDoctors.includes(doctor.id)}
                      onChange={(event) =>
                        handleDoctorCheckboxChange(event, doctor.id)
                      }
                    />
                    <span>{doctor.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Divider />
      </div>
      <BlogTable
        selectedHospital={selectedHospitals}
        selectedDoctor={selectedDoctors}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default Blog;
