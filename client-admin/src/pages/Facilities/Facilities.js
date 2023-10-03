import React, { useEffect, useState } from "react";

import { Button, Modal, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FacilityTable from "../../components/tables/facilityList/FacilityTable";
import AddFacility from "../../components/forms/facilityForm/AddFacility";

//component for managing facilities
const Facilities = () => {
  const [searchValue, setSearchValue] = useState(""); //Initialize search value
  const [isModalOpen, setIsModalOpen] = useState(""); //Initialize modal state
  const [currentPage, setCurrentPage] = useState(1);


  //function to open modal
  const openModal = () => {
    setIsModalOpen(true);
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

  const handlAddFacilitySuccess = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    document.title = "Facilities";
  }, []);

  return (
    <div>
      <Stack spacing={1}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <input
            className="searchbox2"
            maxLength={255}
            type="search"
            data-testid="Search-input"
            placeholder="Search here"
            value={searchValue}
            onChange={searchUser}
          />
          <Tooltip title="Add Facility" placement="top">
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

        {/* Display facility table based on search value */}
        <FacilityTable
          searchValue={searchValue}
          modalOpen={isModalOpen}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </Stack>
      <Modal open={isModalOpen}>
        {/* Component for adding a new facility */}
        <AddFacility operationType="Add" onSuccess={handlAddFacilitySuccess} />
      </Modal>
    </div>
  );
};

export default Facilities;
