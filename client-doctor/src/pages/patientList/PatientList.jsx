import { useCallback, useEffect, useState } from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { PatientTable } from "@/components/tables/PatientTable";
import { ToolTip } from "@/components/toolTip/ToolTip";
import { toast } from "@/components/ui/use-toast";
import { getPatientList } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";

/**
 * it is the column name list for table
 */
const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "patientName",
    header: "PATIENT NAME",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "action",
    header: "ACTION",
  },
];

/**
 * page for showing the patients list
 * @returns patient list page
 */
export const PatientList = () => {
  const [data, setdata] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [pageNo, setpageNo] = useState(1);

  /**
   * function for getting the patients list
   */
  const getPatientListForDoctor = useCallback(async (page) => {
    try {
      const response = await getPatientList(page);
      /**
       * destruction for easy access
       */
      const { data: { items = [], hasNext: hasNextFromApi = false } = {} } =
        response;

      const refactorData = items.map((userData) => ({
        id: userData?.userId,
        patientName: `${userData?.["user.firstName"] || ""} ${
          userData?.["user.lastName"] || ""
        }`,
        action: userData?.userId,
        email: userData?.["user.email"] || "",
        dob: new Date(userData?.["user.dob"]).toLocaleDateString() || "",
        gender: userData?.["user.gender"].toUpperCase() || "",
      }));

      setHasNext(hasNextFromApi);
      setdata(refactorData);
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong.",
      });
    }
  }, []);

  /**
   * on first page render call the get patient list api and on pagNo change
   */
  useEffect(() => {
    getPatientListForDoctor(pageNo);
  }, [getPatientListForDoctor, pageNo]);
  return (
    <div className="mt-[10vh] sm:flex sm:justify-center">
      <div>
        <h1 className="ms-3 p-3 h-11 font-extrabold">PATIENT LIST</h1>
        <PatientTable
          columns={columns}
          data={data}
          hasNext={hasNext}
          setpageNo={setpageNo}
          pageNo={pageNo}
          type={true}
        >
          <ToolTip content="View More">
            <ArrowRightCircleIcon className="w-5 h-5 ms-4" />
          </ToolTip>
        </PatientTable>
      </div>
    </div>
  );
};
