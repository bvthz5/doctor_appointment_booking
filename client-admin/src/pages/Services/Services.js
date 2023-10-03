import React, { useEffect, useState } from "react";

import { Button, Modal, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ServiceTable from "../../components/tables/serviceList/ServiceTable";
import AddService from "../../components/forms/serviceForm/AddService";

//component for managing services
const Services = () => {
  const [searchValue, setSearchValue] = useState(""); //Initialize search value
  const [isModalOpen, setIsModalOpen] = useState(""); //Initialize modal state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "Services";
  }, []);

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

  const handleAddServiceSuccess = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {}, []);

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
          <Tooltip title="Add Service" placement="top">
            <Button
              size="small"
              style={{
                fontSize: "1.5rem",
                backgroundColor: "#4B4453",
                color: "#FFFFFF",
                height: "40px",
                marginRight: "36px"
              }}
              onClick={openModal}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </div>

        {/* Display service table based on search value */}
        <ServiceTable searchValue={searchValue} modalOpen={isModalOpen} onPageChange={handlePageChange} currentPage={currentPage} />
      </Stack>
      <Modal open={isModalOpen}>
        {/* Component for adding a new service */}
        <AddService operationType="Add" onSuccess={handleAddServiceSuccess} />
      </Modal>
    </div>
  );
};

export default Services;
