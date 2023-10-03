import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { leaveColumns } from "@/utils/leaveTableColumnList";
import { DeleteLeaveConfirmation } from "../alerts/DeleteLeaveConfirmation";

export const DoctorLeaveTable = ({
  appointmentList,
  currentPage,
  hasMore,
  getLeaveList,
}) => {
  const paginatePrevious = () => {
    getLeaveList(currentPage - 1);
  };
  const paginateNext = () => {
    getLeaveList(currentPage + 1);
  };
  return (
    <div>
      <div className="rounded-t-lg border mx-12 h-fit">
        <Table className="bg-white">
          <TableHeader className="hover:bg-transparent">
            <TableRow>
              {leaveColumns.map((header) => {
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
                <TableRow key={row.id} className="hover:bg-muted">
                  {leaveColumns.map((column) => {
                    const value = row[column?.accessorKey];
                    return (
                      <TableCell key={column?.accessorKey}>{value}</TableCell>
                    );
                  })}
                  <TableCell>
                    {new Date(row?.startDate).toLocaleDateString() >=
                      new Date().toLocaleDateString() && (
                      <DeleteLeaveConfirmation
                        getLeaveList={getLeaveList}
                        page={currentPage}
                        id={row?.id}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={leaveColumns?.length}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center bg-white h-14 mx-12 justify-end space-x-2 0 border rounded-b-lg">
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
    </div>
  );
};

DoctorLeaveTable.propTypes = {
  appointmentList: PropTypes.array,
  currentPage: PropTypes.number,
  getLeaveList: PropTypes.func,
  hasMore: PropTypes.any,
};
