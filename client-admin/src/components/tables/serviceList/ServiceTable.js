import React, { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Modal, Pagination, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

import errorMessages from "../../../../src/utils/errorMessages.json";
import toastrOptions from "../../../utils/toastConfig";
import { deleteService, serviceLists } from "../../../service/servicesService";
import AddService from "../../forms/serviceForm/AddService";
import styles from "../Table.module.css";

const columns = [
  { id: "id", label: "Id" },
  { id: "serviceName", label: "Service" },
  { id: "description", label: "Description" },
  { id: "createdAt", label: "Created Date" },
  { id: "actions", label: "Actions"},
];


export default function ServiceTable(filter) {
  const [isModalOpen, setIsModalOpen] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [apiCall, setApiCall] = useState(false);
  const [loadingagentpage, setLoading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!filter.modalOpen) {
      listService();
    }
  }, [filter]);

  const dateConvertion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

  const listService = async () => {
    setApiCall(true)
    try {
      const response = await serviceLists(
        filter.searchValue,
        filter.currentPage,
        10
      );
      if (response.status === 200) {
        setServiceList(response.data.items);
        setTotalPages(response.data.totalPages);
        filter.onPageChange(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCall(false)
  };

  const handlePageChange = (event, newPage) => {
    filter.onPageChange(newPage);
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddServiceSuccess = () => {
    setIsModalOpen(false);
    listService();
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
        deleteService(id)
          .then((response) => {
            if (response.status === 200)
              toastr.success(
                "Service deleted successfully!",
                "Success",
                toastrOptions
              );
            listService();
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
                        {serviceList.length > 0 ? (
                          serviceList.map((row) => {
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
                                  {row?.serviceName?.length > 15 ? (
                                    <Tooltip title={row.serviceName}>
                                      <span>{`${row?.serviceName.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.serviceName}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.description?.length > 15 ? (
                                    <Tooltip title={row?.description}>
                                      <span>{`${row?.description.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.description}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConvertion(row.createdAt)}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => openModal(row)}
                                    >
                                      <Tooltip
                                        title="Edit Service"
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
                                          row?.serviceName
                                        );
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete Service"
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
                  <Modal open={isModalOpen}>
                    <AddService
                      operationType="Update"
                      data={selectedRowData}
                      onSuccess={handleAddServiceSuccess}
                    />
                  </Modal>
                </Paper>
              </div>
            </div>
          </div>
        </div>

        {loadingagentpage && <div className={styles.loading}>Loading…</div>}
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
}
