import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "../Table.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, Pagination, Tooltip } from "@mui/material";

import "toastr/build/toastr.min.css";
import toastr from "toastr";

import errorMessages from "../../../../src/utils/errorMessages.json";
import toastrOptions from "../../../utils/toastConfig";
import { deleteTimeSlot, timeSlotListt } from "../../../service/timeSlotService";
import DoctorTimeSlotForm from "../../forms/timeSlotForm/DoctorTimeSlotForm";

const columns = [
  { id: "id", label: "Doctor ID" },
  { id: "doctor", label: "Doctor" },
  { id: "timeSlots", label: "Time Slots" },
  { id: "hospitalName", label: "Hospital Name" },
  { id: "Actions", label: "Actions" },
];

function createData(id,doctorName, timeSlot, hospitalName) {
  return { id,doctorName, timeSlot, hospitalName };
}
const rows = [
  createData(1,"Prince Jospeh", "10:00,11:00,12:00","Appolo"),
  createData(2,"Dr. Liam Parker", "10:30,10:00,11:00,12:00","Sunrise"),
  createData(3,"Dr. Noah Rivera", "11:00,10:00,12:00","Aster"),
  createData(4,"Dr. Lily Adams", "11:30,10:00,11:00,12:00","Sunrise"),
  createData(5,"Dr. Ava Walker", "12:00,10:00,11:00","Aster"),
  createData(6,"Dr Rebecca Williamss", "12:30,10:00,11:00,12:00","Appolo"),
];

const data={
  doctor:{
    id:1,
    name:"Adminwwwwww"
  },
  hospital:{
    id:1,
    name:""
  },
  timeSlots:[{ value: 1, label: "9:00" },
  { value: 2, label: "10:30" },
  { value: 3, label: "11:00" },
  { value: 8, label: "15:00" },
  { value: 9, label: "15:30" }]
}
const DoctorTimeSlot = () => {
  const [loadingagentpage, setLoading] = useState(false);
  const [apiCallAgent, setApiCallHospital] = useState(false);
  const [pageLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState("");
  const [timeSlotList, setTimeSlotList] = useState([]);
  

  const [selectedRowData, setSelectedRowData] = useState("");
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    listTimeslots();
  }, [currentPage]);

  //   function for getting all agents
  const listTimeslots = async () => {
    setApiCallHospital(true);
    try {
      const response = await timeSlotListt(
        currentPage,
        pageLimit
      );
      if (response?.status === 200) {
        setTimeSlotList(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      console.log(err);
    }
    setApiCallHospital(false);
  };

  
  const deleteTimeSlots = async (id, name) => {
    Swal.fire({
      title: `Delete all time slots of ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Delete!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteTimeSlot(id)
          .then((response) => {
            if (response.status === 200)
              toastr.success(
                "Time slot deleted successfully!",
                "Success",
                toastrOptions
              );
            listTimeslots();
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleAddTimeSlotSuccess = () => {
    setIsModalOpen(false);
    listTimeslots();
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
                                  {row.doctorName}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.timeSlot}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.hospitalName}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  <div className={styles["button-group"]}>
                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => openModal(data)}
                                    >
                                      <Tooltip
                                        title="Edit Timeslot"
                                        placement="top"
                                        data-testid="editbtn"
                                      >
                                        <EditIcon style={{ color: "orange" }} />
                                      </Tooltip>
                                    </button>

                                    <button
                                      className={styles["button-55"]}
                                      onClick={() => {
                                        deleteTimeSlots(row.id, row.doctor,);
                                      }}
                                    >
                                      <Tooltip
                                        title="Delete Timeslot"
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
                  <Modal open={isModalOpen}>
                    <DoctorTimeSlotForm
                      operationType="Update"
                      data={selectedRowData}
                      onSuccess={handleAddTimeSlotSuccess}
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
            page={currentPage}
            onChange={handlePageChange}
            style={{ marginTop: "20px", float: "right" }}
          />
        </div>
      </div>
    </>
  );
};
// }

export default DoctorTimeSlot;
