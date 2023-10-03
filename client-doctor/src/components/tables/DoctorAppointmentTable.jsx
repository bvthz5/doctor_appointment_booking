import { useEffect, useRef, useState,useCallback } from "react";
import { getAllDoctorAppointmentList } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { columns } from "@/utils/appointmentTableColumnList";
import { toast } from "../ui/use-toast";
import { ApproveRejectAppointment } from "../alerts/ApproveRejectAppointment";
import { EditAppointment } from "../forms/EditAppointment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AddPrescription } from "../forms/AddPrescription";


/**
 * Component that contains list of the appointments of currently logged in doctor.
 * @returns table
 */
export function DoctorAppointmentTable() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasmore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("5");
  const calenderPopover = useRef();

 

  /**
   * Function get the list of appointements of currently logged in user
   * @param {number} pageNo
   */
  const getAppointmentsList = useCallback(async (pageNo, date, filter) => {
    try {
      setIsLoading(true);
      const response = await getAllDoctorAppointmentList(pageNo, date, filter);
      let appointmentData = response?.data?.bookings.map((value) => {
        return {
          id: value?.id,
          name: value?.user?.firstName + " " + value?.user?.lastName,
          email: value?.user?.email,
          date: new Date(value?.date).toLocaleDateString(),
          timeSlot: value?.timeslot?.timeSlot,
          mobileNo: value?.user?.mobileNo,
          dob: new Date(value?.user?.dob).toLocaleDateString(),
          status: statusCheck(value?.status),
          timeSlotId: value?.timeslot?.id,
          doctorId: value?.doctorId,
          histories: value?.histories,
        };
      });
      setAppointmentList(appointmentData);
      setCurrentPage(response?.data?.page);
      setHasmore(response?.data?.hasNext);
      setIsLoading(false);
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
      setIsLoading(false);
    }
  },[]);

  /**
   * Function to paginate to next page.
   * Function will call getAllDoctorAppointmentList with currentPage + 1 as parameter
   */
  const paginateNext = () => {
    getAppointmentsList(currentPage + 1, selectedDate, selectedFilter);
  };
  /**
   * Function to paginate to previous page.
   * Function will call getAllDoctorAppointmentList with currentPage - 1 as parameter
   */
  const paginatePrevious = () => {
    getAppointmentsList(currentPage - 1, selectedDate, selectedFilter);
  };
  /**
   * Function used to check the status that in number and return corresponding value in user understandable format.
   * @param {number} status - current status of the booking in number format
   * @returns string that shows the status
   */
  const statusCheck = (status) => {
    let value;
    switch (status) {
      case 1:
        value = "PENDING";
        break;
      case 2:
        value = "ACCEPTED";
        break;
      case 3:
        value = "REJECTED";
        break;
      case 4:
        value = "CANCELLED";
        break;
      default:
        value = "NOT AVAILABLE";
    }
    return value;
  };


  useEffect(() => {
    getAppointmentsList(1, selectedDate, selectedFilter);
  }, [selectedFilter, selectedDate, getAppointmentsList]);
  return (
    <div className="bg-muted h-[calc(100vh-74px)] overflow-y-auto">
      <div className="flex justify-between mx-6 h-16 items-center max-md:flex-col max-md:justify-start max-md:items-start gap-y-5">
        <div className="text-xl font-semibold max-md:mt-6">APPOINTMENTS</div>
        <div className="flex justify-end ">
          <Select
            value={selectedFilter}
            onValueChange={(e) => {
              setSelectedFilter(e);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white mr-4">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">Current</SelectItem>
                <SelectItem value="1">Pending</SelectItem>
                <SelectItem value="2">Accepted</SelectItem>
                <SelectItem value="3">Rejected</SelectItem>
                <SelectItem value="4">Cancelled</SelectItem>
                <SelectItem value="6">Previous</SelectItem>
                <SelectItem value="0">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild ref={calenderPopover}>
              <Button
                variant={"outline"}
                className={cn("pl-3 text-left w-[180px] font-normal mr-3")}
              >
                {selectedDate || <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                onSelect={(event) => {
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
                  setSelectedDate(formattedDate);
                  calenderPopover.current?.click();
                }}
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear() + 1}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              setSelectedDate();
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      {!isLoading && (
        <>
          <div className="rounded-t-lg border  mx-6 overflow-y-auto overflow-x-auto  h-fit max-h-[calc(100vh-197px)] max-md:max-h-[calc(100vh-280px)] max-md:mt-16">
            <Table className="bg-white">
              <TableHeader className="hover:bg-transparent">
                <TableRow>
                  {columns.map((header) => {
                    return (
                      <TableHead key={header.accessorKey}>
                        {header?.header}
                      </TableHead>
                    );
                  })}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentList?.length ? (
                  appointmentList?.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted ">
                      {columns?.map((column) => {
                        const value = row[column?.accessorKey];
                        return (
                          <TableCell key={column?.accessorKey}>
                            {value}
                          </TableCell>
                        );
                      })}

                      <TableCell>
                        {row?.status === "PENDING" &&
                          new Date().toLocaleDateString() <= row?.date && (
                            <div className="flex">
                              <ApproveRejectAppointment
                                approve={true}
                                pageNo={currentPage}
                                bookingId={row?.id}
                                getAllAppointments={getAppointmentsList}
                                filter={selectedFilter}
                                date={selectedDate}
                              />
                              <ApproveRejectAppointment
                                filter={selectedFilter}
                                date={selectedDate}
                                pageNo={currentPage}
                                bookingId={row?.id}
                                getAllAppointments={getAppointmentsList}
                              />
                            </div>
                          )}
                        {row?.status === "ACCEPTED" &&
                          new Date().toLocaleDateString() <= row?.date && (
                            <div className="flex">
                              <EditAppointment
                                filter={selectedFilter}
                                date={selectedDate}
                                data={row}
                                getAllAppointment={getAppointmentsList}
                                pageNo={currentPage}
                              />
                            </div>
                          )}
                        {row?.status === "ACCEPTED" &&
                          new Date().toLocaleDateString() > row?.date &&
                          row?.histories?.length === 0 && (
                            <div className="flex">
                              <AddPrescription
                              filter ={selectedFilter}
                                date={selectedDate}
                                id={row?.id}
                                page={currentPage}
                                getAppointmentsList={getAppointmentsList}
                                searchValue={selectedDate}
                              />
                            </div>
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length}
                      className="h-24 text-center"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center bg-white h-14 mx-6 justify-end space-x-2 0 border rounded-b-lg">
            <div className="space-x-2 mx-3  ">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={currentPage === 1}
                onClick={paginatePrevious}
              >
                Previous
              </Button>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={paginateNext}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
