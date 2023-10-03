import { NavLink } from "react-router-dom";
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

/**
 * component for patient list and history table
 * @param {Object} patientList - data of patient and details for pagination
 * @param {*} patientList.data - data of patient
 * @param {*} patientList.column - names of the column
 * @param {boolean} patientList.hasNext - if next page exist or not
 * @param {*} patientList.setPageNo - function for updating page number
 * @param {number} patientList.pageNo - current page number
 * @returns patient table
 */
export const PatientTable = ({
  data,
  columns,
  children,
  hasNext,
  setpageNo,
  pageNo,
  type = false,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className={`${type ? "sm:w-[80vw]" : "lg:w-[95vw]"}`}>
      <div className="rounded-md border mx-5 overflow-auto h-max max-h-[calc(100vh-200px)]">
        <Table className="bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id} className={`p-3 ps-4 break-words`}>
                      {cell.column.id === "action" ? (
                        <NavLink
                          to="/patient-history"
                          state={{ id: cell.getValue("id") }}
                        >
                          {children}
                        </NavLink>
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
      <div className="flex items-center justify-end space-x-2 py-4 px-4   mx-5 bg-white">
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
PatientTable.propTypes = {
  children: PropTypes.any,
  columns: PropTypes.any,
  data: PropTypes.any,
  hasNext: PropTypes.bool,
  pageNo: PropTypes.number,
  setpageNo: PropTypes.any,
  type: PropTypes.bool,
};
