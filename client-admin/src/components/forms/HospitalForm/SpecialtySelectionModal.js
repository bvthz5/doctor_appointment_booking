import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";
import { ListSpecialtySubspecialty } from "../../../service/specialtyService";

const SpecialtySelectionModal = ({
  handleSpecialtyChange,
  handleSubSpecialtyChange,
  selectedItems,
  clearSpecialities,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const cardRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [SpecialtySub, setSpecialtySub] = useState([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const handleCancel = useCallback(() => {
    handleCloseModal();
    clearSpecialities();
  }, [clearSpecialities]);

  const isSpecialtySelected = (specialtyId) =>
    selectedItems.some(
      (selectedItem) => selectedItem.specialityId === specialtyId
    );

  const isSubSpecialtySelected = (specialtyId, subspecialityId) =>
    selectedItems
      .find((selectedItem) => selectedItem.specialityId === specialtyId)
      ?.subspecialities?.includes(subspecialityId) || false;

  const handleScroll = (e) => {
    // Check if the content has been scrolled, and hide the header accordingly
    if (e.target.scrollTop > 0 && headerVisible) {
      setHeaderVisible(false);
    } else if (e.target.scrollTop === 0 && !headerVisible) {
      setHeaderVisible(true);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 480,
    height: 500,
    bgcolor: "background.paper",
    borderRadius: "20px",
  };

  const contentStyle = {
    maxHeight: "calc(65vh - 120px)",  
    overflowY: "auto",
    marginTop: "0px",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    padding: "7px",
    position: "sticky",
    bottom: 0,
    backgroundColor: "#f5f5f5",
  };

  const getAllSpecialtySub = async () => {
    setLoading(true);

    try {
      const response = await ListSpecialtySubspecialty();
      setSpecialtySub(response?.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    document.title = "SpecialtySubspecialty";
    getAllSpecialtySub();
  }, []);

  return (
    <div>
      <div>
        <Button
          variant="outlined"
          onClick={handleOpenModal}
          style={{ width: "100%" }}
        >
          Select Specialties
        </Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Card
            sx={{
              minWidth: 330,
              overflow: "hidden",
              height: "100%",
            }}
            ref={cardRef}
            onScroll={handleScroll}
          >
            <CardContent style={{ height: "90%" }}>
              {headerVisible && (
                <div>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ marginLeft: "110px" }}
                  >
                    Select Specialty
                  </Typography>
                </div>
              )}
              <div style={contentStyle}>
                <div className="specialty-list">
                  {SpecialtySub.map((item) => (
                    <div key={item.id} className="specialty-item">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          value={item.id}
                          checked={isSpecialtySelected(item.id)}
                          onChange={(event) =>
                            handleSpecialtyChange(event, item.id)
                          }
                        />
                        {item.name}
                      </div>
                      {isSpecialtySelected(item.id) &&
                        item.subspecialities &&
                        item.subspecialities.length > 0 && (
                          <ul>
                            {item.subspecialities.map((subItem) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "20px",
                                }}
                                key={subItem.id}
                              >
                                <input
                                  type="checkbox"
                                  value={subItem.id}
                                  checked={isSubSpecialtySelected(
                                    item.id,
                                    subItem.id
                                  )}
                                  onChange={(event) =>
                                    handleSubSpecialtyChange(
                                      event,
                                      item.id,
                                      subItem.id
                                    )
                                  }
                                />
                                {subItem.name}
                              </div>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardActions sx={footerStyle}>
              <Button
                style={{
                  width: "45%",
                  color: "#004fd4",
                  backgroundColor: "#c9d3f0",
                }}
                type="submit"
                value="submit"
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Update
              </Button>
              <Button
                style={{
                  width: "45%",
                  color: "red",
                  backgroundColor: "antiquewhite",
                }}
                onClick={() => {
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </div>
  );
};

export default SpecialtySelectionModal;
