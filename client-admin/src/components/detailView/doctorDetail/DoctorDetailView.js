import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "@mui/material"; // Import Material-UI components

import styles from "./DoctorDetails.module.css";
import { doctorView } from "../../../service/doctorService";
import config from "../../../service/serverConfig";

const DoctorDetailView = () => {
  const { id } = useParams();

  const [doctorDetails, setDoctorDetails] = useState({});
  const [joiningDate, setJoiningDate] = useState("");

  const getDoctorById = async () => {
    try {
      const response = await doctorView(id);
      if (response.status === 200) {
        setDoctorDetails(response.data);
        setJoiningDate(new Date(response.data.createdAt).toLocaleDateString());
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDoctorById();
  }, [id]);

  return (
    <div style={{ width: "100%" }}>
      <div className={styles.heading}>
        <Typography variant="h4">DOCTOR DETAILS</Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Card className={styles.card}>
          <div className={styles.imgWrap}>
            <img
              src={`${config.IMAGE_URL}${doctorDetails.imageKey}`}
              alt="Image"
              className={styles.img}
            />
          </div>
          <div className={styles.detailsSection}>
            <Typography variant="h5" className={styles.details}>
              Doctor Name : {doctorDetails?.name}
            </Typography>
            <Typography variant="h6" className={styles.details}>
              Designation : {doctorDetails?.designation}
            </Typography>
            <Typography variant="h6" className={styles.details}>
              Experience : {doctorDetails?.experience}
            </Typography>
            <Typography variant="h6" className={styles.details}>
              Qualification : {doctorDetails?.qualification}
            </Typography>
            <Typography variant="h6" className={styles.details}>
              Contact : {doctorDetails?.email}
            </Typography>
            <Typography variant="h6" className={styles.details}>
              Joining Date : {joiningDate}
            </Typography>
            <div style={{ marginTop: "25px" }}>
              <Typography variant="h6" className={styles.details}>
                Hospital : {doctorDetails?.hospital?.name}
              </Typography>
              <Typography variant="h6" className={styles.details}>
                Specialty : {doctorDetails?.specialty?.specialtyName}
              </Typography>
              <Typography variant="h6" className={styles.details}>
                Sub Specialty : {doctorDetails?.subspecialty?.SubSpecialtyName}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetailView;
