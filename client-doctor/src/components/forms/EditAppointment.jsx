import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as zod from "zod";
import errorMessage from "@/utils/errorCode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import { Input } from "../ui/input";
import { SelectSlot } from "../select/SelectSlot";
import { updateSlot } from "@/services/doctorService";

/**
 * The modal used to edit the time slot of the appointment by doctor
 * @param {object} data - details of  of booking that needed to edit
 * @param {any} getAllAppointment - Function used to getAllappointments after successfull edit
 * @param {number} pageNo - Current page number of db details that need to
 * @returns modal to edit appointment
 */
export const EditAppointment = ({
  data,
  getAllAppointment,
  pageNo,
  filter, 
  date,
}) => {
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dialogClose = useRef(null);
  const FormSchema = zod.object({
    newTime: zod.string().nonempty({ message: "Please select a slot" }),
  });
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: data?.date ? data?.date : "",
      newTime: 1,
    },
  });
  /**
   * function to call all the update Slot
   */
  const updateSlotTime = async (datas) => {
    try {
      setIsLoading(false);
      await updateSlot(data?.id, datas);
      getAllAppointment(pageNo, date, filter);
      handleClose();
      toast({
        variant: "success",
        description: "Slot update successfullly",
      });
    } catch (error) {
      setIsLoading(false);
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          error?.response?.data?.message
      );
    }
  };
  /**
   * function to close dialogbox and also clear the fields
   */
  const handleClose = () => {
    dialogClose.current.click();
  };
  /**
   * function to submit the updated data
   */
  const onSubmit = (data) => {
    updateSlotTime(data);
  };

  return (
    <div>
      {" "}
      <Dialog>
        <DialogTrigger className="h-10 px-4 py-2 ms-4 text-white rounded-sm bg-blue-800 border-[1px] border-white hover:bg-white hover:text-blue-800  hover:border-blue-800">
          Edit
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
            <DialogTitle className="mb-6">Change Slot</DialogTitle>
            <DialogDescription asChild>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-1"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex">Slot</FormLabel>
                        <FormControl>
                          <SelectSlot
                            field={field}
                            data={data}
                            defaultValueValue={
                              data?.timeSlotId
                                ? data?.timeSlotId.toString()
                                : ""
                            }
                          />
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
    </div>
  );
};

EditAppointment.propTypes = {
  data: PropTypes.any,
  getAllAppointment: PropTypes.any,
  pageNo: PropTypes.any,
  date: PropTypes.any,
  filter: PropTypes.any,
};
