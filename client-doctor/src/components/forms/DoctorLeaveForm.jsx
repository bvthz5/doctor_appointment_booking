import PropTypes from "prop-types"
import {  useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import errorMessage from "@/utils/errorCode";
import { applyLeave } from "@/services/doctorService";
import { toast } from "../ui/use-toast";
/**
 * Dummy data
 */
const options = [
  { value: 1, label: "10:30" },
  { value: 2, label: "11:00" },
  { value: 3, label: "11:30" },
  { value: 4, label: "12:00" },
  { value: 5, label: "12:30" },
  { value: 6, label: "02:30" },
  { value: 7, label: "03:00" },
  { value: 8, label: "03:30" },
  { value: 9, label: "04:00" },
];
export const DoctorLeaveForm = ({ getLeavelist, page }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const [isDisablesRadio, setIsRadio] = useState(false);
  const [isSelectSlot, setSelectSlot] = useState(false);

  const form = useForm({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      type: 0,
      timeSlotIds: [],
    },
  });

  /**
   * Function that triggeres when clicking submit button from add leave form.This function will call addLeave
   * @param {*} data - datas obtained from form
   */
  const onSubmit = (data) => {
    addLeave(data);
  };

  /**
   * Function to call the api of addleave feature for doctor
   * @param {object} data - contains the values obtained from apply leave form
   */
  const addLeave = async (data) => {
    try {
      setErrorMessageDisplay("");
      setIsLoading(true);
      const startDate = changDateFormat(data?.startDate);
      const endDate = changDateFormat(data?.endDate);
      const timeSlots = [];
      data?.timeSlotIds.map((datas) => {
        timeSlots.push(datas?.value);
      });
      const value = {
        startDate: startDate,
        endDate: endDate,
        type: data?.type,
        timeSlotIds: timeSlots,
      };

      await applyLeave(value);
      form.reset();
      getLeavelist(page);
      toast({
        variant: "success",
        title: "",
        description: "Leave added succefully",
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          "Something went wrong!"
      );
    }
  };
  /**
   * Function to disable radio button is leave period is more than day
   * @param {*} startDate Currently selected start date in the form
   * @param {*} endDate Currently selected end date in the form
   */
  const setRadioButtonInactive = (startDate, endDate) => {
    if (
      new Date(startDate).toLocaleDateString() <
      new Date(endDate).toLocaleDateString()
    ) {
      setIsRadio(true);
      setSelectSlot(false);
      form.setValue("type", 0);
    } else {
      setIsRadio(false);
    }
  };

  /**
   * Function to change the format of the date based on
   * @param {*} date date that format need to changed
   */
  const changDateFormat = (event) => {
    const year = event.toLocaleString("default", {
      year: "numeric",
    });
    const month = event.toLocaleString("default", {
      month: "2-digit",
    });
    const day = event.toLocaleString("default", {
      day: "2-digit",
    });
    const formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  return (
    <div className="flex justify-center w-full mt-16 max-md:mt-8">
      <div className={"grid gap-6"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
            <div className="flex justify-between w-[750px] max-md:flex-col max-md:w-screen  max-md:px-4">
              <FormField
                control={form.control}
                name="startDate"
                className="space-y-1"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-3">Leave Period</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[350px] pl-3 text-left font-normal max-md:w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            required
                            mode="single"
                            selected={field.value}
                            disabled={(date) =>
                              date < new Date().setHours(0, 0, 0, 0)
                            }
                            onSelect={(event) => {
                              field.onChange(event);
                              new Date(
                                form.getValues("endDate")
                              ).toLocaleDateString() <
                                new Date(event).toLocaleDateString() &&
                                form.setValue("endDate", event);
                              field.onChange(event);

                              setRadioButtonInactive(
                                event,
                                form.getValues("endDate")
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-3 max-md:hidden">&nbsp;</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[350px] pl-3 text-left font-normal max-md:w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>End date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            disabled={(date) =>
                              date < new Date().setHours(0, 0, 0, 0)
                            }
                            required
                            mode="single"
                            selected={field.value}
                            onSelect={(event) => {
                              field.onChange(event);
                              new Date(
                                form.getValues("startDate")
                              ).toLocaleDateString() >
                                new Date(event).toLocaleDateString() &&
                                form.setValue("startDate", event);
                              setRadioButtonInactive(
                                form.getValues("startDate"),
                                event
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(e) => {
                        e === 3 ? setSelectSlot(true) : setSelectSlot(false);
                        field.onChange(e);
                      }}
                      value={field.value}
                      className="flex  space-x-1 max-md:px-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={0} />
                        <FormLabel className="font-normal">Full day</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={1} disabled={isDisablesRadio} />
                        <FormLabel className="font-normal">
                          First Half
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={2} disabled={isDisablesRadio} />
                        <FormLabel className="font-normal">
                          Second Half{" "}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={3} disabled={isDisablesRadio} />
                        <FormLabel className="font-normal">Custom </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSelectSlot && (
              <FormField
                className="space-y-2"
                control={form.control}
                name="timeSlotIds"
                render={({ field }) => (
                  <FormItem className="max-md:px-4">
                    <FormLabel className="mt-3">Select time slots</FormLabel>
                    <FormControl>
                      <Select
                        isMultiple={true}
                        value={field.value}
                        onChange={(e) => {
                              const timeSlots = e?.map((data) => {
                            return {
                              timeSlotIds: data?.value,
                            };
                          });
                          field.onChange(timeSlots);
                        }}
                        options={options}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <div className="w-full mt-4 max-md:px-4 mb-3">
              <Button disabled={isLoading} type="submit" className="w-full ">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Unavailability
              </Button>
            </div>
            <ErrorDisplay message={errorMessageDisplay} />
          </form>
        </Form>
      </div>
    </div>
  );
};

DoctorLeaveForm.propTypes = {
  getLeavelist: PropTypes.func,
  page: PropTypes.any
}
