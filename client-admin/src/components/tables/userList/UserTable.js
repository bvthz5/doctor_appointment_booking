import React, { useState } from "react";

import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import Swal from "sweetalert2";

import { deleteUser, usersList } from "../../../service/userService";
import toastrOptions from "../../../utils/toastConfig";
import styles from "../Table.module.css";
import Loader from "../../../utils/Loader/Loader";

const columns = [
  { id: "id", label: "Id" },
  { id: "firstName", label: "Name" },
  { id: "dob", label: "DOB" },
  { id: "gender", label: "Gender" },
  { id: "mobileNo", label: "Contact Number" },
  { id: "actions", label: "Delete" },
];

const UserTable = (search) => {
  const [userList, setUserList] = useState([]);

  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiCall, setApiCall] = useState(false);
  const [loadingagentpage, setLoading] = useState(false);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  React.useEffect(() => {
    listUser();
  }, [currentPage, search]);

  const dateConvertion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

  const listUser = async () => {
    setApiCall(true);
    try {
      const response = await usersList(search.searchValue, currentPage, 10);
      if (response.status === 200) {
        setUserList(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCall(false);
  };

  const handleDeleteClick = async (id, name) => {
    Swal.fire({
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Delete!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteUser(id)
          .then((response) => {
            if (response.status === 200) {
              toastr.success(
                "User deleted successfully!",
                "Success",
                toastrOptions
              );
            }
            listUser();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <div>
        <div className={styles.boxproductlist}>
          <div className={styles.productbox}>
            <div>
              <div>
                <Paper
                  style={{
                    width: "95%",
                    overflow: "hidden",
                    margin: "auto",

                    zIndex: "0",
                  }}
                >
                  <TableContainer className={styles["TableContainer"]}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead className={styles["TableHead"]}>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              className={styles["tablecellmain"]}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody role="checkbox" tabIndex={-1}>
                        {userList.length > 0 ? (
                          userList.map((row) => {
                            const name = `${row.firstName} ${row.lastName}`;
                            return (
                              <TableRow key={row?.id} className={styles["row"]}>
                                <TableCell className={styles["TableCell"]}>
                                  {row?.id}
                                </TableCell>
                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {name?.length > 15 ? (
                                    <Tooltip title={name}>
                                      <span>{`${name.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{name}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConvertion(row.dob)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.gender?.length > 15 ? (
                                    <Tooltip title={row?.gender}>
                                      <span>{`${row?.gender.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.gender}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.mobileNo}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => {
                                        handleDeleteClick(
                                          row.id,
                                          `${row.firstName} ${row.lastName}`
                                        );
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete User"
                                        placement="top"
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </Tooltip>
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <>
                            {!apiCall && (
                              <tr className={styles["listloader"]}>
                                <td>No Match Found</td>
                              </tr>
                            )}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </div>
          </div>
        </div>

        {loadingagentpage && <div className={styles.loading}>Loading…</div>}
        {apiCall && <Loader />}

        <div>
          <Pagination
            variant="outlined"
            color="primary"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            style={{ marginTop: "20px", float: "right" }}
          />
        </div>
      </div>
    </>
  );
};

export default UserTable;
