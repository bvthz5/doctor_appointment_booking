import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PropTypes from "prop-types";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { getSlotsOfDoctor } from "@/services/hospitalService";
/**
 * The component for selecting the slot for the appointment
 * @param {*} field variable of the react hook form
 * @returns dropdown slot
 */
export const SelectSlot = ({ field, doctorId, date }) => {
  const [slot, setSlot] = useState([]);

  /**
   * function to get the slots from the server
   */
  const getSlots = useCallback(async (id, dates) => {
    try {
      const res = await getSlotsOfDoctor(id, dates);
      setSlot(res?.data);
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
   * call get Slots id when doctorId or date chnges
   */
  useEffect(() => {
    date && doctorId && getSlots(doctorId, date);
  }, [date, doctorId, getSlots]);

  return (
    <Select onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder="select a slot" />
      </SelectTrigger>
      <SelectContent>
        {slot?.map((data) => (
          <SelectItem value={data?.id.toString()} key={data?.id}>
            {data?.timeSlot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

SelectSlot.propTypes = {
  field: PropTypes.any,
  doctorId: PropTypes.any,
  date: PropTypes.any,
};
