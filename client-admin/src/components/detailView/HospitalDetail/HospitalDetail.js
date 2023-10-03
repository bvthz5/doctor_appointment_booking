import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "@mui/material"; // Import Material-UI components
import { HospitalDetailView } from "../../../service/hospitalService";
import { toast } from "react-toastify";
import config from "../../../service/serverConfig";
import styles from "./HospitalDetails.module.css";
import noImage from "../../../assets/icons/NoImage.png";

const HospitalDetail = () => {
  let { id } = useParams();
  const [hospitalDetails, setHospitalDetails] = useState({});

  const getHospitalById = useCallback(async () => {
    if (id) {
      try {
        const response = await HospitalDetailView(id);
        setHospitalDetails(response?.data);
        console.log(response?.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title:
            isNaN(error?.response?.data?.errorCode) &&
            "Uh oh! Something went wrong.",
          description: error?.response?.data?.message,
        });
      }
    }
  }, [id]);

  useEffect(() => {
    getHospitalById();
  }, [getHospitalById]);

  const dateConversion = (date) => {
    let currentDate = new Date(date);
    return currentDate.toLocaleDateString();
  };

  return (
    <div style={{ width: "100%" }}>
      <div className={styles.heading}>
        <Typography variant="h4">HOSPITAL DETAILS</Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Card className={styles.card}>
          <div className={styles.imgWrap}>
            {!hospitalDetails?.hospital?.fileKey ||
            hospitalDetails?.hospital?.fileKey.startsWith("https") ? (
              <img src={noImage} alt="Default" className={styles.img} />
            ) : (
              <img
                src={`${config.IMAGE_URL}${hospitalDetails?.hospital?.fileKey}`}
                alt="Hospital Profile"
                className={styles.img}
              />
            )}
          </div>

          <div className={styles.detailsSection}>
            <div style={{ marginTop: "5px" }}>
              <Typography variant="p" className={styles.details}>
                Hospital Name: {hospitalDetails?.hospital?.name}
              </Typography>
              <Typography variant="p" className={styles.details}>
                Email: {hospitalDetails?.hospital?.email}
              </Typography>
              <Typography variant="p" className={styles.details}>
                Address: {hospitalDetails?.hospital?.address}
              </Typography>
              <Typography variant="p" className={styles.details}>
                City: {hospitalDetails?.hospital?.city}
              </Typography>
              <Typography variant="p" className={styles.details}>
                Contact Number: {hospitalDetails?.hospital?.contactNo}
              </Typography>
              <Typography variant="p" className={styles.details}>
                Admin: {hospitalDetails?.hospital?.admin?.name}
              </Typography>
              <Typography variant="p" className={styles.details}>
                CreatedDate:{" "}
                {dateConversion(hospitalDetails?.hospital?.createdAt)}
              </Typography>
              <Typography variant="p" className={styles.details}>
                UpdatedDate:{" "}
                {dateConversion(hospitalDetails?.hospital?.updatedAt)}
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        {hospitalDetails?.specialties &&
        hospitalDetails.specialties.some(
          (specialty) =>
            specialty.specialty ||
            (specialty.specialty.subspecialties &&
              specialty.specialty.subspecialties.length > 0)
        ) ? (
          <Card className={styles.card}>
            <div style={{ width: "100%" }}>
              <Typography
                variant="h6"
                style={{ marginRight: "20px", textAlign: "center" }}
              >
                Specialty and Subspecialty
              </Typography>
              <div className={styles.detailsSectionContent}>
                {hospitalDetails?.specialties?.map((specialty) => (
                  <div key={specialty.id} className={styles.contentSpacing}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start", 
                        marginBottom: "10px", 
                      }}
                    >
                      <Typography
                        variant="p"
                        style={{
                          fontWeight: "bold",
                          marginRight: "5px",
                        }}
                      >
                        Specialty:
                      </Typography>
                      <div
                        style={{
                          borderRadius: "15px",
                          backgroundColor: "#ecf0f1",
                          padding: "5px 10px",
                        }}
                      >
                        {specialty.specialty.specialtyName}
                      </div>
                    </div>

                    {specialty.specialty.subspecialties?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography
                          variant="p"
                          style={{
                            fontWeight: "bold",
                            marginRight: "5px",
                          }}
                        >
                          Subspecialties:
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start", 
                            flexWrap: "wrap",
                            maxWidth: "100%",
                            borderRadius: "15px",
                            backgroundColor: "#ecf0f1",
                            padding: "5px 10px",
                          }}
                        >
                          {specialty.specialty.subspecialties
                            .map((sub) => sub.SubSpecialtyName)
                            .join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default HospitalDetail;
