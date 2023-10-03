import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { toast } from "../ui/use-toast";
import errorMessageCode from "@/utils/errorCode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  addDescription,
  getAllDoctorAppointmentList,
} from "@/services/doctorService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import { useState } from "react";

const FormSchema = zod.object({
  reason: zod
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must contain at most 50 character(s)" }),
  prescription: zod
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(200, {
      message: "Content must contain at most 200 character(s)",
    }),
});
export const AddPrescription = ({
  id,
  getAppointmentsList,
  page,
  date,
  filter,
  searchValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  /** Function that triggers when submiting create blog form. In this form createBlog function is called by passing data from form */
  const onSubmit = (data) => {
    prescriptionAdd(data);
  };
  /** Function that conation codes to executed when closing the create blog modal*/
  const onCloseModal = () => {
    form.reset();
    setErrorMessageDisplay("");
    SetIsModalOpen(false);
  };

  /** Function to create blog by passing data from form */
  const prescriptionAdd = async (data) => {
    try {
      setIsLoading(true);
      const obj = {
        reason: data?.reason,
        prescription: data?.prescription,
        bookingId: id,
      };
      await addDescription(obj);
      getAllDoctorAppointmentList(page, searchValue);
      setIsLoading(false);
      SetIsModalOpen(false);
      toast({
        variant: "success",
        description: "Prescription added successfully",
      });
      form.reset();
      setErrorMessageDisplay("");
      getAppointmentsList(page, date, filter);
    } catch (error) {
      setErrorMessageDisplay(
        errorMessageCode[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          SetIsModalOpen(true);
        }}
      >
        <Button className="ms-4 bg-red-700 border-[1px] border-white hover:bg-white hover:text-red-700  hover:border-red-700">
          Add Prescription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogPrimitive.Close className="absolute right-4 top-4  opacity-70 transition-opacity hover:opacity-100 focus:outline-none  disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" onClick={onCloseModal} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <DialogHeader>
          <DialogTitle className="text-3xl">{"Add Prescription"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-1"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prescription</FormLabel>
                    <FormControl>
                      <div className="flex justify-end">
                        <Textarea
                          multilne
                          className="resize-none h-64"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ErrorDisplay message={errorMessageDisplay} />

              <Button disabled={isLoading} type="submit" className="w-full  ">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

AddPrescription.propTypes = {
  date: PropTypes.any,
  filter: PropTypes.any,
  getAppointmentsList: PropTypes.func,
  id: PropTypes.any,
  page: PropTypes.any,
  searchValue: PropTypes.any,
};
