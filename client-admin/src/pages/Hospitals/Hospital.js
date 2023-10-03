import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import styles from "./Hospital.module.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Pagination, Tooltip } from "@mui/material";
// import { addAgentsApi, allAgentsApi, deleteAgentsApi, editAgents } from '../../core/api/apiService';
import Loader from "../../utils/Loader/Loader";
import { hospitalList, HospitalDelete } from "../../service/hospitalService";
import { statusBadge } from "../../utils/status/utils";
import useWindowDimensions from "../../utils/WindowDimensions";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const columns = [
  { id: "id", label: "ID", minWidth: 1 },
  { id: "Hospital", label: "Hospital Name", minWidth: 5 },
  { id: "email", label: "Email", minWidth: 5 },
  { id: "contact", label: "Contact Number", minWidth: 5 },
  { id: "createdDate", label: "Created Date", minWidth: 5 },
  { id: "Admin", label: "Admin", minWidth: 5 },
  { id: "Actions", label: "Actions", minWidth: 5 },
];

const Hospital = () => {
  let navigate = useNavigate();
  const { width } = useWindowDimensions();
  const [hospitals, setHospitals] = useState([]);
  const [id, setId] = useState(null);
  const [loadingagentpage, setLoading] = useState(false);
  const [apiCallHospital, setApiCallHospital] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("1");
  const [sortValue, setSortValue] = useState("CreatedDate");
  const [desc, setDesc] = useState(true);

  const handlePageChange = (event, newPage) => {
    setPageNo(newPage);
  };

  const { setValue } = useForm({ mode: "onChange" });

  const handleAddHospital = () => navigate(`/AddHospital`);

  const handleEditAgentOpen = (ids) => navigate(`/EditHospital/${ids}`);

  const getHospitals = useCallback(async () => {
    setApiCallHospital(true);
    const params = {
      PageNumber: pageNo,
      PageSize: pageLimit,
      search: searchValue.replace("+", "%2b"),
      SortBy: sortValue,
      Status: status ? status : "",
      SortByDesc: desc,
    };
    try {
      const response = await hospitalList(params);
      setHospitals(response?.data?.Items);
      setPageCount(response.data?.TotalPages);
      setPageNo(response.data?.currentPage);
      console.log(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
    setApiCallHospital(false);
  }, [pageNo, pageLimit, searchValue, sortValue, status, desc]);
  
  useEffect(() => {
    document.title = "Hospitals";
    getHospitals();
  }, [getHospitals]);
  

  const patch = (rows) => {
    setValue("name", rows.name);
    setValue("email", rows.email);
    setValue("phoneNumber", rows.contact);
    setValue("city", rows.city);
    setValue("admin", rows.adminId);
    setValue("speciality", rows.speciality);

  };

  //hospital delete//
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
        HospitalDelete(id, status)
          .then((response) => {
            if (response?.data.data)
              Swal.fire(`Deleted!`, `${name} has been Deleted `, "success");
            getHospitals();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
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
            <div className={styles["items"]}>
              <div className={styles["itemfirsttwo"]}>
                <div>
                  <input
                    className={styles["search"]}
                    maxLength={255}
                    type="search"
                    data-testid="Search-input"
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
                  <Tooltip title="Add Hospital" placement="top">
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
                        {hospitals.length > 0 ? (
                          hospitals.map((hospital) => {
                            return (
                              <TableRow
                                key={hospital?.id}
                                className={styles["row"]}
                              >
                                <TableCell className={styles["TableCell"]}>
                                  {hospital?.id}
                                </TableCell>
                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {hospital?.name}
                                </TableCell>
                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {hospital?.email}
                                </TableCell>

                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {hospital?.contactNo}
                                </TableCell>
                                <TableCell
                                  className={styles["TableCell"]}
                                  style={{
                                    overflow: "hidden",
                                    lineBreak: "anywhere",
                                  }}
                                >
                                  {dateConvertion(hospital?.createdAt)}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                {hospital?.admin?.name}
                                </TableCell>

                                <TableCell className={styles["TableCell"]}>
                                  {hospital?.status !== 0 && (
                                    <div className={styles["button-group"]}>
                                      <button
                                        disabled={hospital?.status !== 1}
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          setId(hospital?.id);
                                          patch(hospital);
                                          handleEditAgentOpen(hospital?.id);
                                        }}
                                      >
                                        <Tooltip
                                          title="Edit Hospital"
                                          placement="top"
                                        >
                                          <EditIcon
                                            style={{ color: "orange" }}
                                          />
                                        </Tooltip>
                                      </button>

                                      {hospital?.status === 1 && (
                                        <button
                                          className={styles["button-55"]}
                                          onClick={() => {
                                            deleteHospital(
                                              hospital?.id,
                                              hospital?.name,
                                              1
                                            );
                                          }}
                                        >
                                          <Tooltip
                                            title="Delete Hospital"
                                            placement="top"
                                          >
                                            <DeleteIcon
                                              style={{ color: "red" }}
                                            />
                                          </Tooltip>
                                        </button>
                                      )}

                                      <button
                                        className={styles["button-55"]}
                                        onClick={() => {
                                          navigate(
                                            `/HospitalDetail/${hospital?.id}`
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
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <>
                            {!apiCallHospital && (
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
        {apiCallHospital && <Loader />}
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

export default Hospital;
