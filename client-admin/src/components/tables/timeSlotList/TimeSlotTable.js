import React, { useEffect, useState } from "react";
import styles from "../Table.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Pagination } from "@mui/material";

import "toastr/build/toastr.min.css";

import { timeSlotListt } from "../../../service/timeSlotService";

const columns = [
  { id: "id", label: "Id", minWidth: 1 },
  { id: "timeSlot", label: "Time Slot", minWidth: 5 },
  { id: "createdDate", label: "Created Date", minWidth: 5 },
];



const TimeSlotTable = () => {
  const [loadingagentpage, setLoading] = useState(false);
  const [apiCallAgent, setApiCallHospital] = useState(false);
  const [pageLimit] = useState(10);
  const [timeSlotList, setTimeSlotList] = useState([]);

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


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const dateConvertion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
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
                        {timeSlotList.length > 0 ? (
                          timeSlotList.map((row) => {
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
                                  {row.timeSlot}
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

export default TimeSlotTable;
