import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import styles from "./Leave.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pagination, Tooltip } from "@mui/material";
import { useForm as UseForm } from "react-hook-form";
import Loader from "../../utils/Loader/Loader";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../utils/WindowDimensions";
import { LeaveList } from "../../service/leaveService";

const columns = [
  { id: "id", label: "ID", minWidth: 1 },
  { id: "doctorName", label: "Doctor Name", minWidth: 5 },
  { id: "hospitalName", label: "Hospital Name", minWidth: 5 },
  { id: "startDate", label: "Start Date", minWidth: 5 },
  { id: "endDate", label: "End Date", minWidth: 5 },
  { id: "time", label: "Time", minWidth: 5 },
  { id: "UpdatedDate", label: "Updated Date", minWidth: 5 },
  { id: "Actions", label: "Actions", minWidth: 5 },
];

const Specialty = () => {
  let navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [Leave, setSpecialty] = useState([]);
  const [id, setId] = useState(null);
  const [loadingPage, setLoading] = useState(false);
  const [apiCallSpecialty, setApiCallSpecialty] = useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const {
    register,
    formState: { errors },
  } = UseForm({ mode: "onChange" });

  const callApi = () => {
    getSpecialty();
  };

  const handleAddHospital = () => navigate(`/LeaveForm`);

  const handleEditAgentOpen = (id) => navigate(`/EditLeave/${id}`);

  const handlePageChange = (event, newPage) => {
    setPageNo(newPage);
  };

  const getSpecialty = useCallback(async () => {
    setApiCallSpecialty(true);
    const params = {
      PageNumber: pageNo,
      PageSize: pageLimit,
      search: searchValue.replace("+", "%2b"),
    };
    try {
      const response = await LeaveList(params);
      setSpecialty(response?.data?.Items);
      setPageCount(response.data?.TotalPages);
      setPageNo(response.data?.currentPage);
      console.log(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
    setApiCallSpecialty(false);
  }, [pageNo, pageLimit, searchValue, setApiCallSpecialty]);

  useEffect(() => {
    document.title = "Specialty";
    getSpecialty();
  }, [getSpecialty]);

  //delete api
  const deleteSpecialties = async (id, name, status) => {
    Swal.fire({
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Delete!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // specialtyDelete(id, status)
        //   .then((response) => {
        //     if (response?.data.data)
        //       Swal.fire(`Deleted!`, `${name} has been Deleted `, "success");
        //     callApi();
        //   })
        //   .catch((err) => {
        //     const error = err?.response?.data?.message;
        //     console.log(err?.response);
        //     if (error) {
        //       Swal.fire({
        //         icon: "warning",
        //         title: error,
        //         backdrop: true,
        //         allowOutsideClick: false,
        //       });
        //     }
        //   });
      }
    });
  };

  const dateConversion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

  function createData(
    id,
    startDate,
    endDate,
    doctorName,
    time,
    UpdatedDate,
    status,
    hospitalName
  ) {
    return {
      id,
      startDate,
      endDate,
      doctorName,
      time,
      UpdatedDate,
      status,
      hospitalName,
    };
  }

  // const timeConversion = (timeString) => {
  //   const [hours, minutes, seconds] = timeString?.split(":");
  //   const formattedTime = `${hours}:${minutes}`;
  //   return formattedTime;
  // };

  const rows = [
    createData(
      "1",
      "2023-09-25",
      "2023-09-25",
      "Afiz",
      "10:00",
      "2023-09-25",
      1,
      "aster"
    ),
    createData(
      "1",
      "2023-09-25",
      "2023-09-25",
      "pankaj",
      "10:00",
      "2023-09-25",
      1,
      "sunrise"
    ),
    createData(
      "1",
      "2023-09-25",
      "2023-09-25",
      "Abu",
      "10:00",
      "2023-09-25",
      1,
      "medCity"
    ),
  ];

  return (
    <>
      <div>
        <div className={styles.boxproductlist}>
          <div className={styles.productbox}>
            <div className={styles["items"]}>
              <div className={styles["itemfirsttwo"]}>
                <div>
                  <input
                    className={styles["search"]}
                    maxLength={255}
                    type="search"
                    placeholder="Search here"
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setPageNo(1);
                    }}
                  />
                </div>
                <div className={styles["selectdiv"]}></div>
              </div>
              <div className={styles.itemaddagent}>
                <div className={styles.addboxalign}>
                  <Tooltip title="Add Leave" placement="top">
                    <button
                      onClick={handleAddHospital}
                      className={styles["addcategorybutton"]}
                    >
                      <AddIcon className={styles["inline-icon"]} />
                      {width > 420}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
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
                        {Leave?.length > 0 ? (
                          Leave.map((row) => {
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
                                  {row?.doctor?.name.length > 15 ? (
                                    <Tooltip title={row?.doctor?.name}>
                                      <span>{`${row?.doctor?.name.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row?.doctor?.name}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.doctor?.hospital?.name}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row?.startDate)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row?.endDate)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row?.timeslot?.timeSlot}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row?.updatedAt)}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  {row.status !== 0 && (
                                    <div className={styles["button-group"]}>
                                      <button
                                        disabled={row?.status !== 1}
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          setId(row?.id);
                                          handleEditAgentOpen(row?.id);
                                        }}
                                      >
                                        <Tooltip
                                          title="Edit Leave"
                                          placement="top"
                                        >
                                          <EditIcon
                                            style={{ color: "orange" }}
                                          />
                                        </Tooltip>
                                      </button>

                                      {row.status === 1 && (
                                        <button
                                          className={styles["button-55"]}
                                          onClick={() => {
                                            deleteSpecialties(
                                              row?.id,
                                              row?.specialtyName,
                                              1
                                            );
                                          }}
                                        >
                                          <Tooltip
                                            title="Delete Leave"
                                            placement="top"
                                          >
                                            <DeleteIcon
                                              style={{ color: "red" }}
                                            />
                                          </Tooltip>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <>
                            {!apiCallSpecialty && (
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

        {loadingPage && <div className={styles.loading}>Loading…</div>}
        {apiCallSpecialty && <Loader />}
        <div>
          <Pagination
            variant="outlined"
            color="primary"
            count={pageCount}
            page={pageNo}
            onChange={handlePageChange}
            style={{ marginTop: "20px", float: "right" }}
          />
        </div>
      </div>
    </>
  );
};
// }

export default Specialty;
