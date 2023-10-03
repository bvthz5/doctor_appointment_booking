import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Input,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import styles from "../../../../pages/Hospitals/Hospital.module.css";
import { validateProfilePicture } from "../../../../utils/ImageValidation";
import { FaRegEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  addHospital,
  HospitalView,
  editHospital,
} from "../../../../service/hospitalService";
import Swal from "sweetalert2";
import hospital from "../../../../assets/icons/hospitallogo.jpg";
import errorMessages from "../../../../utils/errorMessages.json";
import SpecialtySelectionModal from "../SpecialtySelectionModal";
import { ListAllAdminsRole } from "../../../../service/adminService";
import { ListAllFacility } from "../../../../service/facilityService";
import { ListAllService } from "../../../../service/servicesService";

const HospitalAdd = () => {
  let { hospitalId } = useParams();
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [Facility, setFacility] = useState([]);
  const [Service, setService] = useState([]);

  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    reset,
    setValue,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    setValue("adminId", "");
  }, [setValue]);

  const patch = useCallback(
    (hospitalData) => {
      console.log(hospitalData, "hos");
      setValue("name", hospitalData?.hospital?.name);
      setValue("email", hospitalData?.hospital?.email);
      setValue("city", hospitalData?.hospital?.city);
      setValue("address", hospitalData?.hospital?.address);
      setValue("adminId", hospitalData?.hospital?.adminId);
      setValue("image", hospitalData?.hospital?.fileKey);
      setValue("contactNo", hospitalData?.hospital?.contactNo);
      setSelectedAdmin(hospitalData?.hospital?.adminId);
      setSelectedFacilities([
        ...(hospitalData?.facilities?.map((facility) => facility?.facility) ??
          []),
      ]);
      setSelectedServices([
        ...(hospitalData?.services?.map((service) => service?.service) ?? []),
      ]);
      setSelectedItems([
        ...(hospitalData?.specialties?.map((specialty) => ({
          specialityId: specialty?.specialty?.id,
          subspecialities: [
            ...(specialty?.specialty.subspecialties?.map(
              (subspeciality) => subspeciality?.id
            ) ?? []),
          ],
        })) ?? []),
      ]);
    },
    [setValue]
  );

  const getHospitalDetails = useCallback(async () => {
    setLoading(true);

    try {
      const response = await HospitalView(hospitalId);
      console.log(response, "detail");
      patch(response?.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }, [hospitalId, patch]);

  useEffect(() => {
    if (hospitalId && !(hospitalId > 0)) {
      alert("invalid hospital id");
      navigate(-1);
    }
    if (hospitalId > 0) {
      // edit page
      getHospitalDetails();
    } else {
      // add page
    }
  }, [getHospitalDetails, hospitalId, navigate]);

  const getAllAdmins = async () => {
    setLoading(true);

    try {
      const response = await ListAllAdminsRole();
      setAdmins(response?.data || []);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    document.title = "Admin";
    getAllAdmins();
  }, []);

  const getAllFacilities = async () => {
    setLoading(true);

    try {
      const response = await ListAllFacility();
      setFacility(response?.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    document.title = "Facility";
    getAllFacilities();
  }, []);

  const getAllServices = async () => {
    setLoading(true);

    try {
      const response = await ListAllService();
      setService(response?.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    document.title = "Service";
    getAllServices();
  }, []);

  const handleSpecialtyChange = (event, parentId) => {
    const itemId = parseInt(event.target.value);
    setSelectedItems((prevSelectedItems) => {
      // Check if the item is already selected
      const isAlreadySelected = prevSelectedItems.some(
        (selectedItem) => selectedItem.specialityId === itemId
      );

      if (isAlreadySelected) {
        // If the specialty is already selected, remove it and its sub-specialties
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.specialityId !== itemId
        );
      } else {
        // If the specialty is not selected, add it and its sub-specialties (if any)
        const newSelectedItems = [...prevSelectedItems];
        newSelectedItems.push({
          specialityId: itemId,
          subspecialities: [],
        });

        return newSelectedItems;
      }
    });
  };

  const handleCancel = () => {
    reset();
    setSelectedItems([]);
    navigate("/hospital");
  };

  const clearSpecialities = () => {
    setValue("speciality", []);
    setSelectedItems([]);
  };

  useEffect(() => {
    const updateSelected = () => {
      setValue("speciality", selectedItems);
    };
    updateSelected();
  }, [errors, selectedItems, setValue]);

  const handleSubSpecialtyChange = (event, specialityId) => {
    const subspecialityId = parseInt(event.target.value);

    setSelectedItems((prevSelectedItems) => {
      // Find the index of the specialty in the selectedItems array
      const specialtyIndex = prevSelectedItems.findIndex(
        (selectedItem) => selectedItem.specialityId === specialityId
      );

      if (specialtyIndex !== -1) {
        // Clone the previous selected items array
        const newSelectedItems = [...prevSelectedItems];

        // Check if the sub-specialty is already selected
        const isAlreadySelected =
          newSelectedItems[specialtyIndex].subspecialities.includes(
            subspecialityId
          );

        if (isAlreadySelected) {
          // If the sub-specialty is already selected, remove it
          newSelectedItems[specialtyIndex].subspecialities = newSelectedItems[
            specialtyIndex
          ].subspecialities.filter((id) => id !== subspecialityId);
        } else {
          // If the sub-specialty is not selected, add it
          newSelectedItems[specialtyIndex].subspecialities.push(
            subspecialityId
          );
        }

        return newSelectedItems;
      }

      return prevSelectedItems;
    });
  };

  const handleHospitalSubmit = (formData) => {
    if (hospitalId) {
      // If hospitalId exists, it's an edit operation
      handleHospitalEdit(formData);
    } else {
      // If hospitalId doesn't exist, it's an add operation
      handleHospitalAdd(formData);
    }
  };

  const handleUpload = useCallback(async () => {
    // Check if a new profile picture is selected
    if (!newProfilePic) {
      alert("Please select a new profile picture");
      return;
    }

    // Image validation: Check file size
    const fileSize = newProfilePic.size / 1024 / 1024; // in MiB
    if (fileSize > 2) {
      setNewProfilePic(null);
      toast.warning("File size exceeds 2 MB", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Image validation: Check file extension and other criteria using validateProfilePicture
    let validationResult = validateProfilePicture(newProfilePic);

    if (!validationResult) return;
  }, [newProfilePic]);

  useEffect(() => {
    if (newProfilePic) handleUpload();
  }, [handleUpload, newProfilePic]);

  const handleHospitalAdd = (e) => {
    if (!e.name.trim()) {
      toast.error("Whitespace is not allowed!", { toastId: "333" });
      return;
    }

    const selectedServiceIds = selectedServices.map((service) => service.id);
    const selectedFacilityIds = selectedFacilities.map(
      (facility) => facility.id
    );

    const formData = new FormData();

    const newData = {
      ...e,
      speciality: JSON.stringify(selectedItems),
      serviceId: JSON.stringify(selectedServiceIds),
      facilityId: JSON.stringify(selectedFacilityIds),
    };

    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        const value = newData[key];
        formData.append(key, value);
      }
    }
    formData.append("file", newProfilePic);

    console.log(formData, "final");

    setLoading(true);
    addHospital(formData)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Added new Hospital",
          text: `New Hospital, "${e.name.trim()}" added `,
        });
        navigate("/hospital");
      })
      .catch((error) => {
        setDisplayErrorMessage(
          errorMessages[error?.response?.data?.errorCode] ||
            "something went wrong"
        );
        setLoading(false);
        if (displayErrorMessage) {
          Swal.fire({
            icon: "warning",
            title: displayErrorMessage,
            backdrop: true,
            allowOutsideClick: false,
          });
        }
      });
    reset();
  };

  const handleHospitalEdit = (e) => {
    console.log(e);
    if (!e.name.trim()) {
      toast.error("Whitespace is not allowed!", { toastId: "333" });
      return;
    }

    const selectedServiceIds = selectedServices.map((service) => service.id);
    const selectedFacilityIds = selectedFacilities.map(
      (facility) => facility.id
    );

    const formData = new FormData();

    const newData = {
      ...e,
      speciality: JSON.stringify(selectedItems),
      serviceId: JSON.stringify(selectedServiceIds),
      facilityId: JSON.stringify(selectedFacilityIds),
    };

    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        const value = newData[key];
        formData.append(key, value);
      }
    }

    if (newProfilePic) {
      formData.append("file", newProfilePic);
    }

    console.log(formData, "final");

    setLoading(true);
    editHospital(hospitalId, formData)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Hospital Details Updated",
        });
        getHospitalDetails();
      })
      .catch((error) => {
        setDisplayErrorMessage(
          errorMessages[error?.response?.data?.errorCode] ||
            "something went wrong"
        );
        setLoading(false);
        if (displayErrorMessage) {
          Swal.fire({
            icon: "warning",
            title: displayErrorMessage,
            backdrop: true,
            allowOutsideClick: false,
          });
        }
      });

    reset();
  };

  const { ref: adminRef, ...adminProps } = register("adminId", {
    required: "Admin selection is required",
  });

  return (
    <div>
      <Box>
        <Card
          sx={{
            maxWidth: "100%",
            margin: "auto",
            overflow: "auto !important",
            height: "100%",
          }}
        >
          <div className={styles.profilePic}>
            <CardMedia
              component="img"
              height="194"
              alt={"img"}
              image={
                newProfilePic ? URL.createObjectURL(newProfilePic) : hospital
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <Tooltip title={"Change profile picture"}>
              <label>
                <Input
                  id="file"
                  className={styles.input}
                  type="file"
                  onChange={(event) => {
                    setNewProfilePic(event.target.files[0]);
                  }}
                />

                <FaRegEdit style={{ cursor: "pointer" }} />
              </label>
            </Tooltip>
          </div>

          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              paddingBottom: "10px",
            }}
          >
            <TextField
              variant="standard"
              type="text"
              placeholder="Hospital Name"
              {...register("name", {
                validate: (value) =>
                  value.trim() !== "" ? null : "Not a valid name",
                required: "Name is required",
                maxLength: {
                  value: 60,
                  message: "Maximum 60 characters",
                },
              })}
              error={!!errors?.name?.message}
              helperText={errors?.name?.message}
            />

            <TextField
              variant="standard"
              type="text"
              placeholder="Address"
              {...register("address", {
                validate: (value) =>
                  value.trim() !== "" ? null : "Not a valid address",
                required: "Address is required",
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters",
                },
              })}
              error={!!errors?.address?.message}
              helperText={errors?.address?.message}
            />

            <TextField
              variant="standard"
              type="text"
              placeholder="Email"
              {...(!hospitalId
                ? register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-z0-9.-]+\.[A-Z]{2,254}$/i,
                      message: "Invalid Email address",
                    },
                    maxLength: {
                      value: 254,
                      message: "Maximum length exceeded",
                    },
                  })
                : {})}
              error={!!errors?.email?.message}
              helperText={errors?.email?.message}
              disabled={!!hospitalId}
            />

            <TextField
              variant="standard"
              type="tel"
              placeholder="Contact Number"
              {...register("contactNo", {
                required: "Phone is required",
                pattern: {
                  value: /^\d{10}$/i,
                  message: "Not a valid phone number",
                },
              })}
              error={!!errors?.contactNo?.message}
              helperText={errors?.contactNo?.message}
            />

            <TextField
              type="text"
              variant="standard"
              placeholder="City"
              {...register("city", {
                validate: (value) =>
                  value.trim() !== "" ? null : "Not a valid city name",
                required: "City name is required",
                maxLength: {
                  value: 60,
                  message: "Maximum 60 characters",
                },
              })}
              error={!!errors?.city?.message}
              helperText={errors?.city?.message}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Select Admin"
              select
              {...adminProps}
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
              error={!!errors?.adminId?.message}
              helperText={errors?.adminId?.message}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {admins.map((admin) => (
                <MenuItem key={admin?.id} value={admin?.id}>
                  {admin?.name}
                </MenuItem>
              ))}
            </TextField>

            <SpecialtySelectionModal
              selectedItems={selectedItems}
              handleSpecialtyChange={handleSpecialtyChange}
              handleSubSpecialtyChange={handleSubSpecialtyChange}
              clearSpecialities={clearSpecialities}
            />

            <Autocomplete
              multiple
              limitTags={2}
              id="combo-box-services"
              options={Service}
              getOptionLabel={(option) => option.serviceName}
              getOptionValue={(option) => option.id}
              value={selectedServices}
              onChange={(event, newValue) => {
                setSelectedServices(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Services"
                  fullWidth
                  error={submitCount > 0 && selectedServices.length === 0}
                  helperText={
                    submitCount > 0 && selectedServices.length === 0
                      ? "Service selection is required"
                      : " "
                  }
                />
              )}
            />

            <Autocomplete
              multiple
              limitTags={2}
              id="combo-box-facilities"
              options={Facility}
              getOptionLabel={(option) => option.facilityName}
              getOptionValue={(option) => option.id}
              isOptionEqualToValue={(option, value) => option === value}
              value={selectedFacilities}
              onChange={(event, newValue) => {
                setSelectedFacilities(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Facilities"
                  fullWidth
                  error={submitCount > 0 && selectedFacilities.length === 0}
                  helperText={
                    submitCount > 0 && selectedFacilities.length === 0
                      ? "Facility selection is required"
                      : " "
                  }
                />
              )}
            />
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
              type="submit"
              value="submit"
              onClick={handleSubmit(handleHospitalSubmit)}
            >
              Submit
            </Button>
            <Button
              style={{
                color: "red",
                backgroundColor: "antiquewhite",
                width: "37%",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      </Box>
    </div>
  );
};

export default HospitalAdd;
