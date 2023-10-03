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
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

import toastrOptions from "../../../utils/toastConfig";
import UpdateBlog from "../../forms/blogForm/UpdateBlog";
import { blogLists, deleteBlog } from "../../../service/blogService";
import errorMessages from "../../../../src/utils/errorMessages.json";
import styles from "../Table.module.css";
import Loader from "../../../utils/Loader/Loader";

const columns = [
  { id: "id", label: "Id" },
  { id: "title", label: "Title" },
  { id: "doctorId", label: "Posted By" },
  { id: "updatedAt", label: "Updated At" },
  { id: "hospitalId", label: "Hospital" },
  { id: "actions", label: "Delete" },
];


const BlogTable = (filter) => {
  const [isModalOpen, setIsModalOpen] = useState("");
  const [selectedRowData, setSelectedRowData] = useState("");

  const [blogList, setBlogList] = useState([]);
  const [apiCall, setApiCall] = useState(false);
  const [loadingagentpage, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");

  const handlePageChange = (event, newPage) => {
    filter.onPageChange(newPage);
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddBlogSuccess = () => {
    setIsModalOpen(false);
    listBlog();
  };

  useEffect(() => {
    listBlog();
  }, [filter]);

  const listBlog = async () => {
    setApiCall(true)
    try {
      const response = await blogLists(filter.searchValue, filter.currentPage,filter.selectedHospital,filter.selectedDoctor, 10);
      if (response.status === 200) {
        setBlogList(response.data.items);
        setTotalPages(response.data.totalPages);
        filter.onPageChange(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCall(false)
  };

  const dateConvertion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
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
        deleteBlog(id)
          .then((response) => {
            if (response.status === 200) {
              toastr.success(
                "Blog deleted successfully!",
                "Success",
                toastrOptions
              );
            }
            listBlog();
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
                        {blogList.length > 0 ? (
                          blogList.map((row) => {
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
                                  {row?.title?.length > 15 ? (
                                    <Tooltip title={row?.title}>
                                      <span>{`${row?.title.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.title}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.doctor.name?.length > 15 ? (
                                    <Tooltip title={row?.doctorId}>
                                      <span>{`${row?.doctor.name.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.doctor.name}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConvertion(row.updatedAt)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.doctor?.hospital?.name?.length > 15 ? (
                                    <Tooltip title={row?.doctor?.hospital?.name}>
                                      <span>{`${row?.doctor?.hospital?.name.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.doctor?.hospital?.name}</span>
                                  )}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => openModal(row)}
                                    >
                                      <Tooltip
                                        title="Edit Blog"
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
                                          row.title
                                        );
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete Blog"
                                        placement="top"
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </Tooltip>
                                    </button>

                                    <button className={styles["button-55"]}>
                                      <Tooltip
                                        title="View Blog"
                                        placement="top"
                                      >
                                        <DriveFileMoveIcon
                                          onClick={() => {
                                            navigate(`/BlogDetail/${row?.id}`);
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
                    <UpdateBlog
                      operationType="Update"
                      data={selectedRowData}
                      onSuccess={handleAddBlogSuccess}
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

export default BlogTable;
