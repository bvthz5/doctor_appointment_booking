import React, { useEffect, useState } from "react";

import { Button, Modal, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AdminTabe from "../../components/tables/adminList/AdminTable";
import AddAdmin from "../../components/forms/adminForm/AddAdmin";

//admin component for managing admins
const Admin = () => {
  const [searchValue, setSearchValue] = useState(""); //Initialize search value
  const [isModalOpen, setIsModalOpen] = useState(false); //Initialize modal state
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    document.title = "Admins";
  }, []);

  //function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  //function to update search input
  const searchUser = (e) => {
    const searchUsers = e.target.value;
    setSearchValue(searchUsers);
    setCurrentPage(1)
  };

  // Callback function to handle page changes in AdminTable
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //function to handle successfull addition of admin
  const handleAddAdminSuccess = () => {
    setIsModalOpen(false); // Close the modal
  };
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
          <Tooltip title="Add Admin" placement="top">
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

        {/* Display admin table based on search value */}
        <AdminTabe searchValue={searchValue} modalOpen={isModalOpen} onPageChange={handlePageChange} currentPage={currentPage}/>
      </Stack>
      <Modal open={isModalOpen}>
        {/* Component for adding a new admin */}
        <AddAdmin operationType="Add" onSuccess={handleAddAdminSuccess} />
      </Modal>
    </div>
  );
};

export default Admin;
