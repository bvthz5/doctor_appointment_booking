import PropTypes from "prop-types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { UserBookingUpdate } from "../dialogBox/UserBookingUpdate";
import { CancelUserBooking } from "../dialogBox/CancelUserBooking";

/**
 * component for listing user booked details
 * @param {*} data - data of user booking
 * @param {*} column - names of the column
 * @param {boolean} hasNext - if next page exist or not
 * @param {*} setPageNo - function for updating page number
 * @param {number} pageNo - current page number
 * @returns user booked list table
 */
export const UserViewBookingTable = ({
  data,
  columns,
  hasNext,
  setpageNo,
  pageNo,
  getUserBookedListForUser,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /**
   * funciton for checking status and give value
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
  return (
    <div className="w-[95vw]">
      <div className="rounded-md border mx-5 overflow-auto h-max max-h-[calc(100vh-200px)]">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="max-w-[200px] overflow-hidden text-ellipsis"
                    >
                      {header.isPlaceholder ? null : (
                        <span className="flex w-max">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`p-3 ps-4 break-all max-w-[200px]  text-ellipsis`}
                    >
                      {cell.column.id === "action" ? (
                        cell.getValue("action").status !== 4 &&
                        cell.getValue("action").status !== 3 ? (
                          <div className="flex">
                            <UserBookingUpdate
                              userBookingId={cell.getValue("action").id}
                              specialityId={row?.original}
                            />
                            <CancelUserBooking
                              id={cell.getValue("action").id}
                              getUserBookedListForUser={
                                getUserBookedListForUser
                              }
                            />
                          </div>
                        ) : (
                          statusCheck(cell.getValue("action").status)
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 mx-5 bg-white pr-3  rounded-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setpageNo((page) => page - 1)}
          disabled={pageNo < 2}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setpageNo((page) => page + 1)}
          disabled={!hasNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
UserViewBookingTable.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  getUserBookedListForUser: PropTypes.any,
  hasNext: PropTypes.bool,
  pageNo: PropTypes.number,
  setpageNo: PropTypes.func,
};
