import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";

import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import "../../../../src/App.css";
import errorMessages from "../../../../src/utils/errorMessages.json";
import doctorcss from "./Doctor.module.css";
import toastrOptions from "../../../utils/toastConfig";
import { addDoctor, updateDoctor } from "../../../service/doctorService";
import config from "../../../service/serverConfig";
import { validateProfilePicture } from "../../../utils/ImageValidation";
import { hospitalListAddDoctor } from "../../../service/hospitalService";
import { adminHospitall, specialtyAddDoctor } from "../../../service/servicesService";
import { subSpecialtyAddDoctor } from "../../../service/subSpecialtyService";

export default function AddDoctor({
  operationType,
  data,
  doctorId,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [doctor, setDoctor] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updatedProfile, setupdatedProfile] = useState(null);
  const [fileValidation, setFileValidation] = useState(null);
  const [hospital,setHospital] = useState([])
  const [specialty,setSpecialty] = useState([])
  const [subSpecialties,setSubSpecialties] = useState([])

  const [userRole, setUserRole] = useState(null);
  const [selectedSubSpecialty, setSelectedSubSpecialty] = useState(
    data ? data?.subspecialty?.id : ""
  );
  const [selectedHospital, setSelectedHospital] = useState(
    data ? data?.hospital?.id : ""
  );

  const [selectedSpecialty, setSelectedSpecialty] = useState(
    data ? data?.specialty?.id : ""
  );



  const clearErrorMessage = () => {
    setDisplayErrorMessage("");
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
    allSubSpecialties(selectedHospital,event.target.value)
  };

  const handleSubSpecialtyChange = (event) => {
    setSelectedSubSpecialty(event.target.value);
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
    allSpecialtyList(event.target.value)
  };

  const changeProfile = (event) => {
    setupdatedProfile(event.target.files[0]);
    setNewProfilePic("");
  };

  const allHospitalList = async()=>{
    try{
      const response= await hospitalListAddDoctor()
      setHospital(response.data)
    }catch(err){
      console.log(err);
    }
  }

  const allSpecialtyList = async(hospitalId)=>{
    try{
      const response= await specialtyAddDoctor(hospitalId)
      setSpecialty(response.data)
    }catch(err){
      console.log(err);
    }
  }

  const getAdminHospital = async()=>{
    try{
      const response= await adminHospitall()
      setSelectedHospital(response.data.id)
      localStorage.setItem('hospital',response.data.id)
    }catch(err){
      console.log(err);
    }
  }

  const allSubSpecialties = async(hospitalId,specialtyId)=>{
    try{
      const response= await subSpecialtyAddDoctor(hospitalId,specialtyId)
      setSubSpecialties(response.data)
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const role = parseInt(localStorage.getItem("role"));
    setUserRole(role);
    if (role === 1 ) {
      getAdminHospital()
      const hospital=localStorage.getItem('hospital')
      allSpecialtyList(hospital)
    }else{
      allHospitalList();
    }

    if (updatedProfile) handleUpload();

    if (data) {
      setValue("email", data?.email);
      setValue("name", data?.name);
      setValue("hospital", data?.hospital?.id);
      setValue("specialty", data?.specialty?.id);
      setValue("subSpecialty", data?.subSpecialty?.id);
      setValue("qualification", data?.qualification);
      setValue("experience", data?.experience);
      setValue("designation", data?.designation);
      setNewProfilePic(`${config.IMAGE_URL}${data?.imageKey}`);
      setDoctor(data?.id);
      allSpecialtyList(data?.hospital?.id)
      allSubSpecialties(data?.hospital?.id,data?.specialty?.id)
    }
  }, [data, setValue, updatedProfile]);

  const isEmailFieldDisabled = !!data?.email;

  let validtaionResult = false;
  const handleUpload = async () => {
    // image validation size limit 2 MB
    const fileSize = updatedProfile.size / 1024 / 1024; // in MiB
    if (fileSize > 1) {
      setFileValidation("File size exceed 1 MB");
    } else {
      // call for image extension validation
      validtaionResult = validateProfilePicture(updatedProfile);
      if (!validtaionResult) {
        setFileValidation(
          "Allowed Extensions are : 'jpeg', 'jpg', 'png', 'webp'"
        );
      } else {
        setFileValidation("");
      }
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData(); // Create a FormData object

    // Append the file to the FormData object if it exists
    if (!validtaionResult) {
      formData.append("file", updatedProfile);
    }

    // Append other form data fields
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("hospitalId", data?.hospital ? data.hospital : "");
    formData.append("specialtyId", data.specialty);
    formData.append(
      "subspecialtyId",
      data.subSpecialty ? data.subSpecialty : ""
    );
    formData.append("qualification", data.qualification);
    formData.append("experience", data.experience);
    formData.append("designation", data.designation);

    if (operationType === "Add") {
      await addDoctor(formData)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Doctor added successfully!",
              "Success",
              toastrOptions
            );
          onSuccess();
        })
        .catch((error) => {
          setDisplayErrorMessage(
            errorMessages[error?.response?.data?.errorCode] ||
              "something went wrong"
          );
          setIsLoading(false);
        });
    } else if (operationType === "Update") {
      await updateDoctor(formData, doctor)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Doctor updated successfully!",
              "Success",
              toastrOptions
            );
          onSuccess();
        })
        .catch((error) => {
          setDisplayErrorMessage(
            errorMessages[error?.response?.data?.errorCode] ||
              "something went wrong"
          );
          setIsLoading(false);
        });
    }
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "680px",
    bgcolor: "background.paper",
    borderRadius: "20px",
    overflow: "hidden",
  };

  return (
    <Box component="form" sx={modalstyle}>
      <Card
        sx={{
          minWidth: 330,
          overflow: "auto !important",
          height: "100%",
        }}
      >
        <form>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingBottom: "10px",
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              {operationType} Doctor
            </Typography>
            <div className={doctorcss.profilePic}>
              {newProfilePic ? (
                <Avatar
                  className={doctorcss.avatar}
                  alt={errors.name}
                  src={newProfilePic}
                />
              ) : (
                <Avatar
                  className={doctorcss.avatar}
                  alt={errors.name}
                  src={
                    updatedProfile
                      ? URL.createObjectURL(updatedProfile)
                      : undefined
                  }
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "10px",
              }}
            >
              <Tooltip
                title={errors ? "Please wait..." : "Change profile picture"}
              >
                <label>
                  <Input
                    data-testid="image-uploader"
                    id="new-file" 
                    className={doctorcss.input}
                    type="file"
                    onChange={(event) => {
                      changeProfile(event);
                      clearErrorMessage(); // Clear the error message when a new file is selected
                    }}
                  />

                  <Input
                    data-testid="image-uploader"
                    id="file"
                    className={doctorcss.input}
                    type="file"
                    {...register("file", {
                      onChange: () => {
                        clearErrorMessage();
                      },
                    })}
                  />
                  <FaRegEdit style={{ cursor: "pointer" }} />
                </label>
              </Tooltip>
            </div>
            {fileValidation && (
              <FormHelperText className="validationErrorFile">
                {fileValidation}
              </FormHelperText>
            )}

            {userRole === 2 && (
              <FormControl variant="outlined">
                <InputLabel htmlFor="hospital-select">
                  Select Hospital
                </InputLabel>
                <Select
                  label="Select Hospital"
                  {...register("hospital", {
                    onChange: () => {
                      clearErrorMessage();
                    },
                    required: {
                      value: true,
                      message: "Please select hospital",
                    },
                  })}
                  inputProps={{
                    name: "hospital",
                    id: "hospital-select",
                  }}
                  value={selectedHospital}
                  onChange={handleHospitalChange}
                >
                  {hospital.map((hospital) => (
                    <MenuItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </MenuItem>
                  ))}
                </Select>
                {!selectedHospital && errors?.hospital && (
                  <FormHelperText className="validationError">
                    {errors.hospital.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl variant="outlined">
              <InputLabel htmlFor="specialty-select">
                Select Specialty
              </InputLabel>
              <Select
                label="Select Specialty"
                {...register("specialty", {
                  onChange: () => {
                    clearErrorMessage();
                  },
                  required: "Please select speciality",
                })}
                inputProps={{
                  name: "specialty",
                  id: "specialty-select",
                }}
                value={selectedSpecialty}
                onChange={handleSpecialtyChange}
              >
                {selectedHospital
                  ? specialty.map((specialtyItem) => (
                      <MenuItem key={specialtyItem.id} value={specialtyItem.id}>
                        {specialtyItem.specialtyName}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
              {!selectedSpecialty && errors?.specialty && (
                <FormHelperText className="validationError">
                  {errors.specialty.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl variant="outlined">
              <InputLabel htmlFor="subSpecialty-select">
                Select Sub Specialty
              </InputLabel>
              <Select
                label="Select Sub specialty"
                {...register("subSpecialty", {
                  onChange: () => {
                    clearErrorMessage();
                  },
                })}
                inputProps={{
                  name: "subSpecialty",
                  id: "subSpecialty-select",
                }}
                value={selectedSubSpecialty}
                onChange={handleSubSpecialtyChange}
              >
                {selectedSpecialty
                  ? subSpecialties.map((subSpecialty) => (
                      <MenuItem key={subSpecialty.id} value={subSpecialty.id}>
                        {subSpecialty.subSpecialtyName}
                      </MenuItem>
                    ))
                  : ""}
              </Select>
            </FormControl>

            <TextField
              placeholder="Email"
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              disabled={isEmailFieldDisabled}
              InputProps={isEmailFieldDisabled ? {} : undefined}
              autoFocus
              {...register("email", {
                onChange: () => {
                  clearErrorMessage();
                },
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.email?.message}
            </FormHelperText>
            <TextField
              placeholder="Name"
              fullWidth
              name="name"
              label="Name"
              autoComplete="current-password"
              {...register("name", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Name is required",
                required: { value: true, message: "Name is required" },
                maxLength: {
                  value: 50,
                  message: "Name must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.name?.message}
            </FormHelperText>

            <TextField
              placeholder="Designation"
              fullWidth
              label="Designation"
              name="designation"
              autoComplete="designation"
              autoFocus
              {...register("designation", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Designation is required",
                required: { value: true, message: "Designation is required" },
                maxLength: {
                  value: 50,
                  message: "Designation must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.designation?.message}
            </FormHelperText>

            <TextField
              placeholder="Qualification"
              fullWidth
              label="Qualification"
              name="qualification"
              autoComplete="qualification"
              autoFocus
              {...register("qualification", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Qualification is required",
                required: { value: true, message: "Qualification is required" },
                maxLength: {
                  value: 50,
                  message:
                    "Qualification must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.qualification?.message}
            </FormHelperText>

            <TextField
              placeholder="Experience"
              fullWidth
              label="Experience"
              name="experience"
              autoComplete="experience"
              autoFocus
              {...register("experience", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Experience is required",
                required: { value: true, message: "Experience is required" },
                pattern: {
                  value: /^\d+(\.\d+)?$/,
                  message: "Experience must be a number",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.experience?.message || displayErrorMessage}
            </FormHelperText>
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
              disabled={isLoading}
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading && <Loader />}
              {operationType}
            </Button>
            <Button
              style={{
                color: "red",
                backgroundColor: "antiquewhite",
                width: "37%",
              }}
              onClick={() => {
                onSuccess();
                reset();
              }}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
}
