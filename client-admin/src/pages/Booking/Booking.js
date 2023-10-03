import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import styles from "./Booking.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useForm as UseForm } from "react-hook-form";
import { toast } from "react-toastify";
// import { addAgentsApi, allAgentsApi, deleteAgentsApi, editAgents } from '../../core/api/apiService';
import Loader from "../../utils/Loader/Loader";
import {
  StatusButton,
  handleBookingStatus,
  statusBadge,
} from "../../utils/status/utils";
import Box from "@mui/material/Box";
import useWindowDimensions from "../../utils/WindowDimensions";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutline } from "@mui/icons-material";
import { AppointmentList } from "../../service/bookingService";

const columns = [
  { id: "id", label: "ID", minWidth: 1 },
  { id: "UserName", label: "User Name", minWidth: 5 },
  { id: "HospitalName", label: "Hospital Name", minWidth: 5 },
  { id: "DoctorName", label: "Doctor Name", minWidth: 5 },
  { id: "BookingDate", label: "Booking Date", minWidth: 5 },
  { id: "BookingTime", label: "Booking Time", minWidth: 5 },
  { id: "updatedDate", label: "Updated Date", minWidth: 5 },
  { id: "status", label: "Status", minWidth: 5 },
  { id: "Actions", label: "Actions", minWidth: 5 },
];

function createData(
  id,
  UserName,
  HospitalName,
  DoctorName,
  BookingDate,
  BookingTime,
  updatedDate,
  status
) {
  return {
    id,
    UserName,
    HospitalName,
    DoctorName,
    BookingDate,
    BookingTime,
    updatedDate,
    status,
  };
}
const rows = [
  createData(
    "1",
    "Alen",
    "aster",
    "mia",
    "2023-09-30",
    "10:30:00",
    "2023-09-30",
    2
  ),
  createData(
    "1",
    "Ajith",
    "sunrise",
    "george",
    "2023-08-11",
    "10:30:00",
    "2023-08-11",
    2
  ),
  createData(
    "1",
    "Aji",
    "sunrise",
    "george",
    "2023-09-13",
    "10:30:00",
    "2023-08-11",
    2
  ),
  createData(
    "1",
    "Amal",
    "apollo",
    "kai",
    "2023-08-12",
    "10:30:00",
    "2023-08-12",
    3
  ),
  createData(
    "1",
    "Aami",
    "aster",
    "jennifer",
    "2023-08-13",
    "10:30:00",
    "2023-08-13",
    4
  ),
];

const Specialty = () => {
  let navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [booking, setAgents] = useState([]);
  const [id, setId] = useState(null);
  const [loadingagentpage, setLoading] = useState(false);
  const [apiCallAgent, setApiCallHospital] = useState(false);
  const [openAgent, setOpenAgent] = React.useState(false);
  const [editopenAgent, setEditOpenAgent] = React.useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit] = useState(25);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("1");
  const [sortValue, setSortValue] = useState("UpdatedAt");
  const [desc, setDesc] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = UseForm({ mode: "onChange" });

  const handleEditAgentOpen = () => setEditOpenAgent(true);

  const handleEditCloseModal = useCallback(() => {
    setEditOpenAgent(false);
  }, []);

  const editModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: "300px",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflow: "hidden",
  };
  useEffect(() => {
    document.title = "Hospitals";
    getBooking();
  }, [pageNo, searchValue, status, sortValue]);

  //   function for getting all agents
  const getBooking = async () => {
    setApiCallHospital(true);
    const params = {
      PageNumber: pageNo,
      PageSize: pageLimit,
      search: searchValue.replace("+", "%2b"),
      SortBy: sortValue,
      Status: status ? status : "",
      SortByDesc: desc,
    };
    AppointmentList(params)
      .then((response) => {
        setAgents(response?.data.data.result);
        setPageCount(response?.data.data.totalPages);
        console.log(response);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => {
        console.log(err);
      });
    setApiCallHospital(false);
  };

  //   agent update function
  const updateHospital = (e) => {
    if (e?.name?.trim() === "") {
      toast.error("WhiteSpaces are not allowed!", { toastId: "555" });
      return;
    }
    handleEditCloseModal();
    setLoading(true);
    // editAgents(id, e)
    //   .then((response) => {
    //     if (response.data.status) {
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Agent Details Updated',
    //       });
    //       getAgents();
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('err');
    //     setLoading(false);
    //   });
    // reset();
  };
  const patch = (rows) => {
    setValue("name", rows.name);
    setValue("email", rows.email);
    setValue("phoneNumber", rows.contact);
    setValue("city", rows.city);
    setValue("admin", rows.adminId);
  };
  //agent delete//
  const deleteHospital = async (id, name, status) => {
    Swal.fire({
      title: `Delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Delete!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // deleteAgentsApi(id, status)
        //   .then((response) => {
        //     if (response?.data.data) Swal.fire(`Deleted!`, `${name} has been Deleted `, 'success');
        //     getAgents();
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      }
    });
  };

  const dateConversion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

  const timeConversion = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":");
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  };

  const { ref: timeRef, ...timeProps } = register("slotId", {
    required: "TimeSlot selection is required",
  });

  const handleSort = (data) => {
    if (data === "CreatedDate") {
      setDesc(true);
    } else setDesc(false);
  };

  const availableTimes = [
    { id: 1, time: "10:00 AM" },
    { id: 2, time: "11:00 AM" },
    { id: 3, time: "2:00 PM" },
    { id: 4, time: "3:00 PM" },
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
                <div className={styles["selectdiv"]}>
                  <select
                    className={styles["select"]}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPageNo(1);
                    }}
                  >
                    <option
                      className={styles["optionSort"]}
                      defaultChecked
                      value="1"
                    >
                      Pending
                    </option>
                    <option className={styles["optionSort"]} value="2">
                      Approved
                    </option>
                    <option className={styles["optionSort"]} value="3">
                      Rejected
                    </option>
                    <option className={styles["optionSort"]} value="4">
                      Cancelled
                    </option>
                    <option className={styles["optionSort"]} value="">
                      All
                    </option>
                  </select>
                  <select
                    className={styles.select}
                    onChange={(e) => {
                      handleSort(e.target.value);
                      setSortValue(e.target.value);
                      setPageNo(1);
                    }}
                  >
                    <option
                      className={styles.optionSort}
                      value="UpdatedAt"
                      defaultChecked
                    >
                      Updated Date
                    </option>
                    <option className={styles.optionSort} value="Date">
                      Booking Date
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <Modal open={editopenAgent} onClose={handleEditCloseModal}>
                <Box sx={editModalStyle}>
                  <Card
                    sx={{
                      minWidth: 330,
                      overflow: "auto !important",
                      height: "100%",
                    }}
                  >
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        paddingBottom: "10px",
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        Change Booking Time
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Booking Date"
                        value={getValues("BookingDate")}
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Select Time Slot"
                        select
                        {...timeProps}
                        defaultValue={""}
                        error={!!errors?.slotId?.message}
                        helperText={errors?.slotId?.message}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {availableTimes.map((slot) => (
                          <MenuItem key={slot.id} value={slot.id}>
                            {slot.time}
                          </MenuItem>
                        ))}
                      </TextField>
                    </CardContent>
                    <CardActions
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                        paddingBottom: "15px",
                      }}
                    >
                      <Button
                        style={{
                          width: "37%",
                          color: "#004fd4",
                          backgroundColor: "#c9d3f0",
                        }}
                        size="small"
                        type="submit"
                        value="submit"
                        onClick={() => {
                          console.log(getValues("name"));
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        style={{
                          color: "red",
                          backgroundColor: "antiquewhite",
                          width: "37%",
                        }}
                        onClick={() => {
                          handleEditCloseModal();
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </Modal>
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
                        {rows.length > 0 ? (
                          rows.map((row) => {
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
                                  {row.UserName}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.HospitalName}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.DoctorName}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row.BookingDate)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {timeConversion(row.BookingTime)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row.updatedDate)}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <StatusButton status={row.status} row={row} />
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  {row.status !== 0 && (
                                    <div className={styles["button-group"]}>
                                      <button
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          navigate(
                                            `/HospitalDetail/${row?.id}`
                                          );
                                        }}
                                      >
                                        <Tooltip
                                          title="View Details"
                                          placement="top"
                                        >
                                          <DriveFileMoveIcon
                                            style={{ color: "#3b89f7" }}
                                          />
                                        </Tooltip>
                                      </button>

                                      {[1, 2].includes(row.status) && (
                                        <button
                                          disabled={
                                            !(
                                              row.status === 1 ||
                                              row.status === 2
                                            )
                                          }
                                          className={styles["button-55"]}
                                          onClick={() => {
                                            setId(row.id);
                                            patch(row);
                                            handleEditAgentOpen(row.id);
                                          }}
                                        >
                                          <Tooltip
                                            title="Edit Booking"
                                            placement="top"
                                          >
                                            <EditIcon
                                              style={{ color: "orange" }}
                                            />
                                          </Tooltip>
                                        </button>
                                      )}

                                      <button
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          deleteHospital(
                                            row.id,
                                            row.name,
                                            row.status
                                          );
                                        }}
                                      >
                                        <Tooltip
                                          title="Delete Booking"
                                          placement="top"
                                        >
                                          <DeleteIcon
                                            style={{ color: "red" }}
                                          />
                                        </Tooltip>
                                      </button>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <>
                            {!apiCallAgent && (
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
        {/* {apiCallAgent && <Loader />} */}
        <div>
          <Pagination
            variant="outlined"
            color="primary"
            count={pageCount}
            page={pageNo}
            // onChange={handlePageChange}
            style={{ marginTop: "20px", float: "right" }}
          />
        </div>
      </div>
    </>
  );
};
// }

export default Specialty;
