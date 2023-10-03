import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PropTypes from "prop-types";
import { getSlotsOfDoctor } from "@/services/doctorService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";


/**
 * Dummy Data
 */
const slots = [
  {
    value: "1",
    time: "10.30",
  },
  {
    value: "2",
    time: "11.00",
  },
  {
    value: "3",
    time: "11.30",
  },
  {
    value: "4",
    time: "12.00",
  },
  {
    value: "5",
    time: "12.30",
  },
  {
    value: "6",
    time: "2.30",
  },
  {
    value: "7",
    time: "3.00",
  },
  {
    value: "8",
    time: "3.30",
  },
  {
    value: "9",
    time: "4.00",
  },
];
/**
 * The component for selecting the slot for the appointment
 * @param {*} field variable of the react hook form
 * @returns dropdown slot
 */
export const SelectSlot = ({ field, defaultValueValue, data }) => {
  const [slot, setSlot] = useState(slots);

  /**
   * function to get the slots from the server
   */
  const getSlots = useCallback(async () => {
    try {
      const res = await getSlotsOfDoctor(data?.doctorId, data?.date);
      setSlot([...slot, ...res]);
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
  }, [slot]);

  /**
   * on the first render call the slots list
   */
  useEffect(() => {
    // getSlots();  -- api not completed
  }, []);

  return (
    <Select onValueChange={field.onChange} defaultValue={defaultValueValue}>
      <SelectTrigger>
        <SelectValue placeholder="select a slot" />
      </SelectTrigger>
      <SelectContent>
        {slot?.map((data, index) => (
          <SelectItem value={data?.value} key={index}>
            {data?.time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

SelectSlot.propTypes = {
  field: PropTypes.any,
  defaultValueValue: PropTypes.any,
  data: PropTypes.any,
};
