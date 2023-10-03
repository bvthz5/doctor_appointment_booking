import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Modal,
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
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import Swal from "sweetalert2";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

import errorMessages from "../../../../src/utils/errorMessages.json";
import AddDoctor from "../../forms/doctorForm/AddDoctor";
import { deleteDoctor, doctorList } from "../../../service/doctorService";
import toastrOptions from "../../../utils/toastConfig";
import styles from "../Table.module.css";
import Loader from "../../../utils/Loader/Loader";

const columns = [
  { id: "id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email"},
  { id: "designation", label: "Designation" },
  { id: "hospital.name", label: "Hospital" },
  { id: "specialty.name", label: "Specialty" },
  { id: "subspecialty.name", label: "Subspecialty" },
  { id: "actions", label: "Actions" },
];

const DoctorTable = (filter) => {
  const [isModalOpen, setIsModalOpen] = useState("");
  const [doctorLists, setDoctorLists] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState("");
  const [apiCall, setApiCall] = useState(false);
  const [loadingagentpage, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");

  useEffect(() => {
    if (!filter.modalOpen) {
      listDoctor();
    }
  }, [filter]);

  const listDoctor = async () => {
    setApiCall(true)
    try {
      const response = await doctorList(
        filter.searchValue,
        filter.currentPage,
        filter.selectedHospital,
        filter.selectedSpecialty,
        filter.selectedSubSpecialty,
        10
      );
      if (response.status === 200) {
        setDoctorLists(response.data.items);
        setTotalPages(response.data.totalPages);
        filter.onPageChange(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCall(false)
  };

  const handlePageChange = (event, newPage) => {
    filter.onPageChange(newPage)
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddDoctorSuccess = () => {
    setIsModalOpen(false);
    listDoctor();
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
        deleteDoctor(id)
          .then((response) => {
            if (response.status === 200) {
              toastr.success(
                "Doctor deleted successfully!",
                "Success",
                toastrOptions
              );
            }
            listDoctor();
          })
          .catch((error) => {
            setDisplayErrorMessage(
              errorMessages[error?.response?.data?.errorCode] ||
                "something went wrong"
            );
            toastr.error(displayErrorMessage, "Error", toastrOptions);
          });
      }
    });
  };

  const navigate = useNavigate();
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
                        {doctorLists.length > 0 ? (
                          doctorLists.map((row) => {
                            return (
                              <TableRow key={row?.id} className={styles["row"]}>
                                <TableCell className={styles["TableCell"]}>
                                  {row?.id}
                                </TableCell>
                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.name?.length > 15 ? (
                                    <Tooltip title={row?.name}>
                                      <span>{`${row?.name.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.name}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.email?.length > 15 ? (
                                    <Tooltip title={row?.email}>
                                      <span>{`${row?.email.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.email}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.designation?.length > 15 ? (
                                    <Tooltip title={row?.designation}>
                                      <span>{`${row?.designation.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.designation}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.hospital?.name?.length > 15 ? (
                                    <Tooltip title={row?.hospital?.name}>
                                      <span>{`${row?.hospital?.name?.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.hospital?.name}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.specialty?.specialtyName.length > 15 ? (
                                    <Tooltip title={row?.specialty?.specialtyName}>
                                      <span>{`${row?.specialty?.specialtyName?.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.specialty?.specialtyName}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.subspecialty?.SubSpecialtyName.length > 15 ? (
                                    <Tooltip title={row?.subspecialty?.SubSpecialtyName}>
                                      <span>{`${row?.subspecialty?.SubSpecialtyName.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.subspecialty?.SubSpecialtyName}</span>
                                  )}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => openModal(row)}
                                    >
                                      <Tooltip
                                        title="Edit Doctor"
                                        placement="top"
                                        data-testid="editbtn"
                                      >
                                        <EditIcon style={{ color: "orange" }} />
                                      </Tooltip>
                                    </button>

                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => {
                                        handleDeleteClick(
                                          row?.id,
                                          row?.name
                                        );
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete Doctor"
                                        placement="top"
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </Tooltip>
                                    </button>

                                    <button className={styles["button-55"]}>
                                      <Tooltip
                                        title="View Details"
                                        placement="top"
                                      >
                                        <DriveFileMoveIcon
                                          onClick={() => {
                                            navigate(
                                              `/DoctorDetail/${row?.id}`
                                            );
                                          }}
                                          style={{
                                            marginLeft: "0.8rem",
                                            color: "#3b89f7",
                                          }}
                                        />
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
                  <Modal open={isModalOpen}>
                    <AddDoctor
                      operationType="Update"
                      data={selectedRowData}
                      onSuccess={handleAddDoctorSuccess}
                    />
                  </Modal>
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
            page={filter.currentPage}
            onChange={handlePageChange}
            style={{ marginTop: "20px", float: "right" }}
          />
        </div>
      </div>
    </>
  );
};

export default DoctorTable;
