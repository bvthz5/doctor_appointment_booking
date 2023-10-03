import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import PropTypes from "prop-types";
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
export const HospitalComboBox = ({
  field,
  detailList,
  form,
  type,
  disabledOrNot = false,
  getDetails,
  setId,
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

  return (
    <Popover>
      <PopoverTrigger asChild ref={popOverRef}>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabledOrNot}
          className={cn(
            " justify-between",
            !field.value && "text-muted-foreground"
          )}
        >
          <div className="truncate">
            {field.value
              ? detailList?.find((detail) => detail.name === field.value)
                  ?.name ||
                detailList?.find(
                  (detail) => detail.specialtyName === field.value
                )?.specialtyName
              : `Select ${type}`}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[25vw] p-0">
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
                value={detail.name || detail.specialtyName}
                key={detail?.id}
                onSelect={() => {
                  form.setValue(type, detail.name || detail.specialtyName);
                  form.clearErrors(type);
                  if (type === "hospital") {
                    form.setValue("speciality", "");
                    form.setValue("doctor", "");
                    setDoctorSelect(true);
                  } else if (type === "specaility") {
                    form.setValue("doctor", "");
                  }
                  popOverRef?.current?.click();
                  setId(detail?.id);
                }}
              >
                <div className="truncate">
                  {detail.name || detail.specialtyName}
                </div>
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
HospitalComboBox.propTypes = {
  field: PropTypes.any,
  detailList: PropTypes.any,
  form: PropTypes.any,
  type: PropTypes.string,
  disabledOrNot: PropTypes.bool,
  setDoctorSelect: PropTypes.any,
  getDetails: PropTypes.any,
  setId: PropTypes.any,
};
