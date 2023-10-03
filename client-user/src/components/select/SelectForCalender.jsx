import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import PropTypes from "prop-types";

/**
 * give drop down for selecting month and year in the calender component
 * @param {*} params from the calender and used for selecting month and year
 * @returns drop down for month and year
 */
export const SelectForCalender = ({ value, onChange, children }) => {
  const options = React.Children.toArray(children);
  const selected = options.find((child) => child.props.value === value);
  const handleChange = (value) => {
    const changeEvent = {
      target: { value },
    };
    onChange?.(changeEvent);
  };
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => {
        handleChange(value);
      }}
    >
      <SelectTrigger className="pr-1.5 focus:ring-0">
        <SelectValue>{selected?.props?.children}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper">
        <ScrollArea className="h-80">
          {options.map((option) => (
            <SelectItem
              key={`${option.props.value}`}
              value={option.props.value?.toString() ?? ""}
            >
              {option.props.children}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};
SelectForCalender.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.any,
  children: PropTypes.any,
};
