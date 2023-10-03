import React, { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import UserTable from "../../components/tables/userList/UserTable";

const User = () => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    document.title = "Users";
  }, []);

  const searchUser = (e) => {
    const searchUsers = e.target.value;
    setSearchValue(searchUsers);
  };

  return (
    <div>
      <Stack spacing={1}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
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
        </div>

        {/* Display user table based on search value  */}
        <UserTable searchValue={searchValue} />
      </Stack>
    </div>
  );
};

export default User;
