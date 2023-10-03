import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Loader2, User, X } from "lucide-react";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { doctorUpdateProfile } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";
import { toast } from "../ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PropTypes from "prop-types";

const alphaNumbericAndSpaceRegrex = /^[A-Za-z0-9\s]+$/;
const MAX_FILE_SIZE = 1048576;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const IMAGE_URL=import.meta.env.VITE_IMAGE_URL;

const FormSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, { message: "Name Required" })
    .max(50, { message: "Name can only contain at most 50 character(s)" })
    .refine(
      (value) => alphaNumbericAndSpaceRegrex.test(value),
      "Name must contain only alphabet,numbers and space"
    ),

  designation: zod
    .string()
    .trim()
    .min(1, { message: "Designation Required" })
    .max(50, {
      message: "Designation can only contain at most 50 character(s)",
    })
    .refine(
      (value) => alphaNumbericAndSpaceRegrex.test(value),
      "Designation must contain only alphabet,numbers and space"
    ),
  experience: zod
    .string()
    .min(1, { message: "Experience Required" })
    .refine(
      (value) => /^(?!.*\.$)\d+(\.\d*)?$/.test(value),
      "Experience must be a number"
    ),
  qualification: zod
    .string()
    .trim()
    .min(1, { message: "Qualification Required" })
    .max(50, {
      message: "Qualification can only contain at most 50 character(s)",
    })
    .refine(
      (value) => alphaNumbericAndSpaceRegrex.test(value),
      "Qualification must contain only alphabet,numbers and space"
    ),
});

/**
 * dialog box for updating doctor details
 * @param {*} details of the doctor 
 * @returns a dialogbox for updating the doctor details
 */
export const DialogBox = (props) => {
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState("");
  const dialogClose = useRef(null);
  const doctorImageRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      designation: "",
      experience: "",
      qualification: "",
    },
  });

  /**
   * to set the doctor values into the form
   */
  useEffect(() => {
    form.setValue("name", props?.name);
    form.setValue("designation", props?.designation);
    form.setValue("experience", String(props?.experience));
    form.setValue("qualification", props?.qualification);

    if (props?.image) setPreview(props?.image);
  }, [
    form,
    props?.designation,
    props?.experience,
    props?.image,
    props?.name,
    props?.qualification,
  ]);

  /**
   * to clear the error message displayed in error component when getting error from api ,when user change value in form 
   */
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessageDisplay("");
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  /**
   * This function used to update the doctor details
   * @param {*} data object with doctor details
   */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      setIsLoading(true);
      for (let key in data) {
        formData.append(key, data[key]);
      }
      formData.append("version", props?.version);
      if (image) formData.append("file", image);

      await doctorUpdateProfile(formData);
      setIsLoading(false);
      dialogClose?.current.click();
      props.setProfileUpdated((el) => !el);
      toast({
        variant: "success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          errorMessage[error?.response?.data?.errorMessage]
      );
      setIsLoading(false);
    }
  };
  /**
   * to select the image of the doctor and add to the state
   * @param {*} image of doctor
   */
  const handleImagePick = (event) => {
    setErrorMessageDisplay("");
    setImageUploadError("");
    const files = event.target.files[0];
    if (files.size > MAX_FILE_SIZE) {
      return setImageUploadError("Image maximum size is 1 mb");
    } else if (!ACCEPTED_IMAGE_TYPES.includes(files.type)) {
      return setImageUploadError("Image type must any of jpeg,jpg or png");
    }
    setImage(files);

    setPreview(URL.createObjectURL(files));
  };
  /**
   * to close the bialog box and reseting the form value
   */
  const handleClose = () => {
    form.reset({
      name: props?.name || "",
      designation: props?.designation || "",
      experience: String(props?.experience) || "",
      qualification: props?.qualification || "",
    });
    setPreview(props?.image || "");
    setImageUploadError("")
  };
  /**
   * to remove the image that doctor selected
   */
  const handleRemoveImage = () => {
    setImage("");
    setPreview(props?.image || "");
  };
  return (
    <Dialog>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-4 h-10 px-4 py-2 rounded-sm max-w-sm">
        Edit Profile
      </DialogTrigger>
      <DialogContent>
        <DialogPrimitive.Close
          ref={dialogClose}
          tabIndex={-1}
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-1"
              >
                <div className="relative">
                  {image && (
                    <div
                      className="absolute left-[53%] translate-x-2/4  translate-y-2/4 z-10 cursor-pointer"
                      onClick={handleRemoveImage}
                    >
                      <X className="relative p-1 rounded-full bg-black text-white" />
                    </div>
                  )}

                  <Avatar
                    className="w-32 h-32 mx-auto cursor-pointer border-2"
                    tabIndex={-1}
                    onClick={() => doctorImageRef?.current?.click()}
                  >
                    <AvatarImage src={image?preview:IMAGE_URL+preview} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden">
                  <Input
                    type="file"
                    ref={doctorImageRef}
                    onChange={handleImagePick}
                  />
                </div>
                <FormMessage className="flex justify-center">
                  {imageUploadError}
                </FormMessage>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Surgeon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="Year of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex">Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="MBBS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
                <ErrorDisplay message={errorMessageDisplay} />
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
DialogBox.propTypes = {
  image: PropTypes.string,
  designation: PropTypes.string,
  qualification: PropTypes.string,
  experience: PropTypes.any,
  name: PropTypes.string,
  version: PropTypes.number,
  setProfileUpdated: PropTypes.any,
};
