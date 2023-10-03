import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Style from "./ChangePassword.module.css";
import { useEffect } from "react";

const ChangePassword = () => {
  let navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  useEffect(() => {
    document.title = 'Change Password';
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({ mode: "onChange" });
  //change password function//
  const onSubmitAgent = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      return;
    }
    if (data.currentPassword === data.newPassword) {
      toast.warning("New password cannot be your current password");
      return;
    }
    // changePasswordAgent(data)
    //   .then((response) => {
    //     if (response?.data.status) {
    //       Swal.fire({
    //         icon: "success",
    //         title: "Password Changed Successfully ",
    //         showConfirmButton: true,
    //         timer: 2500,
    //       });
    //       navigate("/agentdashboard/home");
    //       localStorage.setItem("isInactive", false);
    //     }
    //   })
    //   .catch((err) => {
    //     const error = err.response.data.message;
    //     const noPassword = "Password Not Set";
    //     if (error === "Password MissMatch") {
    //       Swal.fire({
    //         icon: "danger",
    //         title: " Your current password is wrong",
    //         showConfirmButton: true,
    //         timer: 2500,
    //       });
    //     } else if (error === noPassword) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Invalid Current Password",
    //         text: "If you want to set a password use Forgot Password",
    //       });
    //     }
    //   });
    reset();
  };

  const PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{8,16}$/;

  const toggleCurrentPassAgent = useCallback(() => {
    setShowCurrentPassword((prevState) => !prevState);
  }, []);

  const toggleNewPassAgent = useCallback(() => {
    setShowNewPassword((prevState) => !prevState);
  }, []);

  const toggleConfirmPassAgent = useCallback(() => {
    setShowConfirmPassword((prevState) => !prevState);
  }, []);

  return (
    <div>
      <div className={Style["card"]} style={{ height: "600px" }}>
        <div className={Style["cardStyle"]}>
          {localStorage.getItem("isInactive") === "true" && (
            <div className={Style["hintnote"]}>
              <div className={Style["notecss"]}>
                You have to change password for your first login
              </div>
            </div>
          )}
          {/* // */}
          <form onSubmit={handleSubmit(onSubmitAgent)}>
            <h2 className={Style["formTitle"]}>Change Password</h2>
            <div className={Style["inputDiv"]}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="off"
                placeholder="Current Password "
                {...register("currentPassword", {
                  required: "Current Password required ",
                  pattern: {
                    value: PASSWORD_PATTERN,
                    message:
                      "Password must contain  8 to 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                  },
                })}
              />
              <i className={Style["eyebutton"]}>
                {showCurrentPassword ? (
                  <VisibilityIcon onClick={toggleCurrentPassAgent} />
                ) : (
                  <VisibilityOffIcon onClick={toggleCurrentPassAgent} />
                )}
              </i>
              {errors.currentPassword && (
                <small className={Style["warning"]}>
                  {errors.currentPassword.message}
                </small>
              )}
            </div>
            <br />
            <div className={Style["inputDiv"]}>
              <input
                type={showNewPassword ? "text" : "password"}
                autoComplete="off"
                placeholder=" New Password "
                {...register("newPassword", {
                  required: "Password required ",
                  onChange: (value) => {
                    let password = getValues("confirmNewPassword");
                    if (password) {
                      if (value.target.value !== password) {
                        setPasswordMatch(true);
                      } else setPasswordMatch(false);
                    }
                  },
                  pattern: {
                    value: PASSWORD_PATTERN,
                    message:
                      "Password must contain  8 to 16 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                  },
                })}
              />
              <i className={Style["eyebutton"]}>
                {showNewPassword ? (
                  <VisibilityIcon onClick={toggleNewPassAgent} />
                ) : (
                  <VisibilityOffIcon onClick={toggleNewPassAgent} />
                )}
              </i>

              {errors.newPassword && (
                <small className={Style["warning"]}>
                  {errors.newPassword.message}
                </small>
              )}
            </div>{" "}
            <br />
            <div className={Style["inputDiv"]}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="off"
                placeholder=" Confirm Password "
                {...register("confirmNewPassword", {
                  required: "Password  required ",
                  onChange: (value) => {
                    let password = getValues("newPassword");
                    if (value.target.value !== password) {
                      setPasswordMatch(true);
                    } else setPasswordMatch(false);
                  },
                })}
              />
              <i className={Style["eyebutton"]}>
                {showConfirmPassword ? (
                  <VisibilityIcon onClick={toggleConfirmPassAgent} />
                ) : (
                  <VisibilityOffIcon onClick={toggleConfirmPassAgent} />
                )}
              </i>
              {errors.confirmNewPassword ? (
                <small className={Style["warning"]}>
                  {errors.confirmNewPassword.message}
                </small>
              ) : (
                <small className={Style["warning"]}>
                  {passwordMatch && "Password Mismatch"}
                </small>
              )}
            </div>
            <div className={Style["buttonWrapper"]}>
              <button
                type="submit"
                id="submitButton"
                className={Style["submitButton"]}
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
