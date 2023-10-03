import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardActions,
  CardContent,
  FormHelperText,
  Input,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import errorMessages from "../../../../src/utils/errorMessages.json";
import "../../../../src/App.css";
import toastrOptions from "../../../utils/toastConfig";
import { updateBlog } from "../../../service/blogService";

export default function UpdateBlog({ data, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState("");
  const [blog, setBlog] = useState("");

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

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setValue("content", data.content);
      setBlog(data.id);
    }
  }, [data, setValue]);

  const onSubmit = async (data) => {
      await updateBlog(data, blog)
        .then((response) => {
          setIsLoading(false);
          if (response.status === 200)
            toastr.success(
              "Blog updated successfully!",
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
  };

  const modalstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: "450px",
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
              Update Blog
            </Typography>
            <Input
              placeholder="Title"
              margin="normal"
              fullWidth
              name="title"
              label="title"
              autoComplete="current-password"
              {...register("title", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Title is required",
                required: { value: true, message: "Title is required" },
                maxLength: {
                  value: 50,
                  message: "Title must only contain atmost 50 characters",
                },
              })}
            />
            <FormHelperText className="validationError">
              {errors.title?.message}
            </FormHelperText>

            <TextField
              placeholder="Content"
              margin="normal"
              fullWidth
              name="content"
              multiline 
              variant = "standard"
              autoComplete="current-password"
              rows={7}
              {...register("content", {
                onChange: () => {
                  clearErrorMessage();
                },
                validate: (value) =>
                  value.trim() !== "" ? null : "Content is required",
                required: { value: true, message: "Content is required" },
                maxLength: {
                  value: 1000,
                  message: "Content must only contain at most 1000 characters",
                },
              })}
              
            />
            <FormHelperText className="validationError">
              {errors.content?.message || displayErrorMessage}
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
              Update
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
