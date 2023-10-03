import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import styles from "./Specialty.module.css";
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
import { specialtyDelete, specialtyList } from "../../service/specialtyService";
import SpecialtyForm from "../../components/forms/SpecialtyForm/SpecialtyForm";

const columns = [
  { id: "id", label: "ID", minWidth: 1 },
  { id: "Name", label: "Specialty Name", minWidth: 5 },
  { id: "description", label: "Description", minWidth: 5 },
  { id: "createdDate", label: "Created Date", minWidth: 5 },
  { id: "UpdatedDate", label: "Updated Date", minWidth: 5 },
  { id: "Actions", label: "Actions", minWidth: 5 },
];

const Specialty = () => {
  const [specialty, setSpecialty] = useState([]);
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

  const handleEditAgentOpen = () => setEditOpen(true);

  const callApi = () => {
    getSpecialty();
  };

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
      const response = await specialtyList(params);
      setSpecialty(response?.data?.items);
      setPageCount(response.data?.totalPages);
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
        specialtyDelete(id, status)
          .then((response) => {
            if (response?.data.data)
              Swal.fire(`Deleted!`, `${name} has been Deleted `, "success");
            callApi();
          })
          .catch((err) => {
            const error = err?.response?.data?.message;
            console.log(err?.response);

            if (error) {
              Swal.fire({
                icon: "warning",
                title: error,
                backdrop: true,
                allowOutsideClick: false,
              });
            }
          });
      }
    });
  };

  const dateConversion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

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
                  <SpecialtyForm id={id} setId={setId} callApi={callApi} />
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
                        {specialty.length > 0 ? (
                          specialty.map((row) => {
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
                                  {row.specialtyName}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {row.description.length > 15 ? (
                                    <Tooltip title={row.description}>
                                      <span>{`${row.description.substring(
                                        0,
                                        15
                                      )}...`}</span>
                                    </Tooltip>
                                  ) : (
                                    <span>{row.description}</span>
                                  )}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row.createdAt)}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConversion(row.updatedAt)}
                                </TableCell>
                                <TableCell className={styles["TableCell"]}>
                                  {row.status !== 0 && (
                                    <div className={styles["button-group"]}>
                                      <button
                                        disabled={row.status !== 1}
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          setId(row);
                                          handleEditAgentOpen();
                                        }}
                                      >
                                        <Tooltip
                                          title="Edit Specialty"
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
                                              row.id,
                                              row.specialtyName,
                                              1
                                            );
                                          }}
                                        >
                                          <Tooltip
                                            title="Delete Specialty"
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
