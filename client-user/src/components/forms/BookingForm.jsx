import { CalendarIcon, Loader2 } from "lucide-react";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCallback, useEffect, useRef, useState } from "react";
import * as zod from "zod";
import errorMessage from "@/utils/errorCode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { HospitalComboBox } from "../comboBox/HospitalComboBox";
import { SelectSlot } from "../select/SelectSlot";
import {
  bookAnAppointment,
  getAllHospitalList,
  getDoctorsList,
  getSpecialityList,
} from "@/services/hospitalService";
import { toast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import { ROUTES_NAME } from "@/utils/routeName";
import { Input } from "../ui/input";
/**
 * validation schema
 */
const FormSchema = zod.object({
  date: zod.date({ required_error: "Date required" }),
  hospital: zod
    .string({ required_error: "Hospital Required" })
    .min(1, { message: "Hospital Required" }),
  speciality: zod
    .string({ required_error: "Speciality Required" })
    .min(1, { message: "Speciality Required" }),
  doctor: zod.string().min(1, { message: "Doctor Required" }),
  slot: zod
    .string({ required_error: "Slot Required" })
    .min(1, { message: "Slot Required" }),
});
const FormSchemaDoctorSpecific = zod.object({
  date: zod.date({ required_error: "Date required" }),
  slot: zod
    .string({ required_error: "Slot Required" })
    .min(1, { message: "Slot Required" }),
});
export const BookingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const [specialitySelect, setSpecialitySelect] = useState(true);
  const [doctorSelect, setDoctorSelect] = useState(true);
  const [specialityList, setspecialityList] = useState([]);
  const [hospitalId, setHospitalId] = useState();
  const [specialityId, setSpecialityId] = useState();
  const [doctorId, setDoctorId] = useState();
  const [doctorList, setDoctorList] = useState([]);
  const [hospitalListFull, setHospitalListFull] = useState([]);
  const [generalDisplay, setGeneralDisplay] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const amount = 500;
  const calenderPopover = useRef();
  const navigate = useNavigate();
  const doctorIdFromLocal = localStorage.getItem("id");
  const doctorNameFromLocal = localStorage.getItem("name");
  
  /**
   * useform of react hook form and its default value
   */
  const form = useForm({
    resolver: zodResolver(
      doctorIdFromLocal ? FormSchemaDoctorSpecific : FormSchema
    ),
    defaultValues: {
      hospital: "",
      speciality: "",
      doctor: "",
      slot: "",
    },
  });
  /**
   * to clear the error message displayed in error component when getting error from api ,when user change value in form
   */
  useEffect(() => {
    const subscription = form.watch((value) => {
      setErrorMessageDisplay("");
      if (value.hospital) {
        setSpecialitySelect(false);
      }
      if (value.speciality) {
        setDoctorSelect(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  /**
   * function to get the speciality list
   */
  const getSpeciality = useCallback(
    async (pageNo, searchKey) => {
      try {
        if (!hospitalId) return;
        const response = await getSpecialityList(
          hospitalId,
          pageNo,
          null,
          searchKey
        );
        setspecialityList(response?.data?.items);
      } catch (error) {
        toast({
          variant: "destructive",
          title:
            isNaN(error?.response?.data?.errorCode) &&
            "Uh oh! Something went wrong.",
          description:
            errorMessage[error?.response?.data?.errorCode] ||
            error?.response?.data?.message,
        });
      }
    },
    [hospitalId]
  );

  /**
   * function to get the doctors list
   */
  const getDoctorList = useCallback(
    async (pageNo, searchKey) => {
      try {
        if (!specialityId) return;
        const response = await getDoctorsList(
          specialityId,
          pageNo,
          2,
          5,
          searchKey
        );
        setDoctorList(response?.data?.items);
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            errorMessage[error?.response?.data?.errorCode] ||
            "Uh oh! Something went wrong.",
        });
      }
    },
    [specialityId]
  );
  const getHospitalList = useCallback(async (pageNo, searchKey) => {
    try {
      const response = await getAllHospitalList(pageNo, searchKey, null);
      const items = response?.data?.Items;
      setHospitalListFull(items);
    } catch (error) {
      toast({
        variant: "destructive",
        title:
          isNaN(error?.response?.data?.errorCode) &&
          "Uh oh! Something went wrong.",
        description:
          errorMessage[error?.response?.data?.errorCode] ||
          error?.response?.data?.message,
      });
    }
  }, []);

  /**
   * on page starting get the hospital list
   */
  useEffect(() => {
    getHospitalList(1);
  }, [getHospitalList]);

  useEffect(() => {
    form.resetField("date");
    setSelectedDate();
  }, [doctorId, form]);

  /**
   * on hospitalid and specialityId change call getdoctorslist and getspeciality list for list in their respective drop down
   */

  useEffect(() => {
    if (doctorIdFromLocal) {
      setGeneralDisplay(false);
      form.setValue("doctor", doctorNameFromLocal);
      setDoctorId(doctorIdFromLocal);
    } else {
      if (specialityId) getDoctorList(1);
      if (hospitalId) getSpeciality(1);
    }
  }, [
    doctorIdFromLocal,
    doctorNameFromLocal,
    form,
    getDoctorList,
    getSpeciality,
    hospitalId,
    specialityId,
  ]);

  /**
   *Function for creating a appointment booking in server
   * @param {object} object with slot and date of which the for the appointment
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setIsLoading(true);
      const year = data?.date.toLocaleString("default", { year: "numeric" });
      const month = data?.date.toLocaleString("default", { month: "2-digit" });
      const day = data?.date.toLocaleString("default", { day: "2-digit" });
      const formattedDate = year + "-" + month + "-" + day;
      let appointmentData = {
        doctorId: doctorId,
        slot: data.slot,
        date: formattedDate,
        amount: amount,
      };
      await bookAnAppointment(appointmentData);
      setIsLoading(false);
      navigate(ROUTES_NAME?.message, {
        state: { message: "Appointment has been added sucessfully" },
      });
    } catch (error) {
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
  };
  /**
   * This function is used to update the calender value and close calender
   * @param {*} event is the event generated by the feild
   * @param {*} field is object from the use hook form for setting value
   */
  const handleOnSelectInCalendar = (event, field) => {
    field.onChange(event);
    calenderPopover?.current?.click();
  };
  return (
    <div className="flex justify-center">
      <div className="w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[25vw]  mt-[5vh] sm:mt-[10vh]">
        <Form {...form}>
          <h1 className="md:text-xl font-semibold md:font-extrabold flex justify-center">
            Request an Appointment
          </h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <ErrorDisplay message={errorMessageDisplay} />
            {generalDisplay && (
              <>
                <FormField
                  control={form.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-col"
                      onClick={getHospitalList}
                    >
                      <FormLabel>Hospital Name</FormLabel>
                      <FormControl>
                        <HospitalComboBox
                          detailList={hospitalListFull}
                          field={field}
                          form={form}
                          type="hospital"
                          disabledOrNot={false}
                          getDetails={getHospitalList}
                          setId={setHospitalId}
                          setDoctorSelect={setDoctorSelect}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speciality"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Speciality</FormLabel>
                      <FormControl>
                        <HospitalComboBox
                          detailList={specialityList}
                          field={field}
                          form={form}
                          type="speciality"
                          disabledOrNot={specialitySelect}
                          getDetails={getSpeciality}
                          setId={setSpecialityId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Doctor Name</FormLabel>
                      <FormControl>
                        <HospitalComboBox
                          detailList={doctorList}
                          field={field}
                          form={form}
                          type="doctor"
                          disabledOrNot={doctorSelect}
                          getDetails={getDoctorList}
                          setId={setDoctorId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {!generalDisplay && (
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Doctor Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:mt-2">
                  <FormLabel>Appointment Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild ref={calenderPopover}>
                        <Button
                          disabled={!doctorId}
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(event) => {
                            handleOnSelectInCalendar(event, field);
                            const year = event.toLocaleString("default", {
                              year: "numeric",
                            });
                            const month = event.toLocaleString("default", {
                              month: "2-digit",
                            });
                            const day = event.toLocaleString("default", {
                              day: "2-digit",
                            });
                            const formattedDate =
                              year + "-" + month + "-" + day;
                            setSelectedDate(formattedDate);
                          }}
                          required
                          disabled={(date) =>
                            date < new Date().setHours(0, 0, 0, 0)
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear() + 1}
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
              name="slot"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Slot</FormLabel>
                  <FormControl>
                    <SelectSlot
                      field={field}
                      doctorId={doctorId}
                      date={selectedDate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Label>Booking Fee: {amount} /-</Label>
            <Button disabled={isLoading} type="submit" className="w-full mt-2">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
