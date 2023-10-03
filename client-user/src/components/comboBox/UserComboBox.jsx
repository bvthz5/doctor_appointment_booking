import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";


/**
 * This component used to get a combobox for selecting a hospital or doctors or specilaity for list
 * @param {*} field and form form the react hook form and detailList with list of hospitals or doctors or specilaity list
 * @returns combobox
 */
export const UserComboBox = ({
  field,
  detailList,
  form,
  type,
  disabledOrNot = false,
  getDetails,
   setDoctorSelect,
}) => {
  const popOverRef = useRef();
  const [searchValue, setSearchValue] = useState();
  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  
  /**
   * it is used to search only after 500second and after the keystroke end
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      getDetails(1, searchValue);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [getDetails, searchValue]);

  /**
   * get the booking details
   *
   */

  return (
    <Popover>
      <PopoverTrigger asChild ref={popOverRef}>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabledOrNot}
          className={cn(
            " justify-between w-full",
            !field.value && "text-muted-foreground"
          )}
        >
          <div className="truncate">
            {field.value
              ? detailList?.find((detail) => detail.name === field.value)?.name
              : `Select ${type}`}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80vw] sm:w-[420px]  p-0">
        <Command>
          <Input
            placeholder={`Search ${type}...`}
            className="h-9 border-none focus:outline-none "
            onChange={handleSearch}
          />
          <CommandGroup>
            {detailList?.length === 0 && (
              <p className="flex justify-center p-2">No {type} found.</p>
            )}
            {detailList?.map((detail) => (
              <CommandItem
                value={detail.name}
                key={detail?.id}
                onSelect={() => {
                  setDoctorSelect(detail.id.toString());
                  form.setValue(type, detail.name);
                  popOverRef?.current?.click();
                }}
              >
                <div className="truncate">{detail.name}</div>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    detail.id === field.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
UserComboBox.propTypes = {
  detailList: PropTypes.any,
  disabledOrNot: PropTypes.bool,
  field: PropTypes.any,
  form: PropTypes.any,
  getDetails: PropTypes.func,
  setDoctorSelect: PropTypes.any,
  setId: PropTypes.any,
  type: PropTypes.string,
  userBookingId: PropTypes.any,
};
