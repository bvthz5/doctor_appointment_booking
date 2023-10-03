import React, { useEffect, useState } from "react";

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
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";

import toastrOptions from "../../../utils/toastConfig";
import { packageStatus } from "../../../utils/status/utils";
import AddPackage from "../../forms/packageForm/AddPackage";
import { deletePackage, packageLists } from "../../../service/packageService";
import styles from "../Table.module.css";
import errorMessages from "../../../../src/utils/errorMessages.json";


const columns = [
  { id: "id", label: "Id" },
  { id: "packageName", label: "Package Name" },
  { id: "price", label: "Amount"},
  { id: "off", label: "Off"  },
  { id: "validity", label: "Validity" },
  { id: "hospitalId", label: "Hospital"  },
  { id: "status", label: "Status"  },
  { id: "actions", label: "Delete" },
];
const PackageTable = (filter) => {
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedRowData, setSelectedRowData] = useState("");

  const [packageList, setPackageList] = useState([]);
  const [apiCall, setApiCall] = useState(false);
  const [loadingagentpage, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");


  const handlePageChange = (event, newPage) => {
    filter.onPageChange(newPage);
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddPackageSuccess = () => {
    setIsModalOpen(false);
    listPackage();
  };

  useEffect(() => {
    if(!filter.modalOpen){
      listPackage();
    }
  }, [filter,]);

  const listPackage = async () => {
    setApiCall(true)
    try {
      const response = await packageLists(filter.searchValue,filter.selectedHospital, filter.currentPage, 10);
      if (response.status === 200) {
        setPackageList(response.data.items);
        setTotalPages(response.data.totalPages);
        filter.onPageChange(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCall(false)
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
        deletePackage(id)
          .then((response) => {
            if (response.status === 200) {
              toastr.success(
                "Package deleted successfully!",
                "Success",
                toastrOptions
              );
            }
            listPackage();
          })
          .catch((error) => {
            toastr.error(errorMessages[error?.response?.data?.errorCode] ||
              "something went wrong", "Error", toastrOptions);
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
                        {packageList.length > 0 ? (
                          packageList.map((row) => {
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
                                  {row?.packageName?.length > 15 ? (
                                    <Tooltip title={row?.packageName}>
                                      <span>{`${row?.packageName.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.packageName}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.price}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.off}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.validity}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                  }}
                                >
                                  {row?.hospitalId?.length > 15 ? (
                                    <Tooltip title={row?.hospitalId}>
                                      <span>{`${row?.hospitalId.substring(
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
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {packageStatus(row.validity)}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => openModal(row)}
                                    >
                                      <Tooltip
                                        title="Edit Package"
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
                                          row.id,
                                          row.packageName
                                        );
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete Package"
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
                    <AddPackage
                      operationType="Update"
                      data={selectedRowData}
                      onSuccess={handleAddPackageSuccess}
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
};

export default PackageTable;
