import { useCallback, useEffect, useState } from "react";
import { ArrowRightCircleIcon } from "lucide-react";
import { PatientTable } from "@/components/tables/PatientTable";
import { ToolTip } from "@/components/toolTip/ToolTip";
import { toast } from "@/components/ui/use-toast";
import { getPatientById } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * it is the column name list
 */
const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "hospitalName",
    header: "HOSPITAL NAME",
  },
  {
    accessorKey: "doctorName",
    header: "DOCTOR NAME",
  },
  {
    accessorKey: "reason",
    header: "REASON",
  },
  {
    accessorKey: "prescription",
    header: "PRESCRIPTION",
  },
];

/**
 * page for showing the patient diaganosis history
 * @returns patient history page
 */
export const PatientHistory = () => {
  const [data, setdata] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [pageNo, setpageNo] = useState(1);
  const [patientName, setPatientName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * functionn for getting the patient detail by patient id
   */
  const getPatientDetailByIdForDoctor = useCallback(
    async (page, id) => {
      try {
        /**
         * destructing for easy access
         */
        const { data: { items = [], hasNext: hasNextFromApi = false } = {} } =
          await getPatientById(page, id);

        const patientName = `${items[0]?.booking?.user?.firstName || ""} ${
          items[0]?.booking?.user?.lastName || ""
        }`;
        setPatientName(patientName);

        const refactorData = items.map((userData) => ({
          id: userData?.id,
          doctorName: userData?.booking?.doctor?.name,
          hospitalName: userData?.booking?.doctor?.specialty?.hospital?.name,
          reason: userData?.reason,
          prescription: userData?.prescription,
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
        navigate("/patient-list");
      }
    },
    [navigate]
  );

  /**
   * on first page render call get pateint details from the id gotton from the location state and pageNo,id change
   */
  useEffect(() => {
    if (!location?.state?.id) navigate("/patient-list");
    getPatientDetailByIdForDoctor(pageNo, location?.state?.id);
  }, [getPatientDetailByIdForDoctor, location?.state?.id, navigate, pageNo]);

  return (
    <div className="lg:flex lg:justify-center">
      <div>
        <h1 className="ms-3 p-3 h-11 font-extrabold">PATIENT HISTORY</h1>
        <h1 className="ms-3 p-3 h-11 font-semibold">
          PATIENT:{" "}
          <span className="font-normal">{patientName?.toUpperCase()}</span>
        </h1>
        <PatientTable
          columns={columns}
          data={data}
          hasNext={hasNext}
          setpageNo={setpageNo}
          pageNo={pageNo}
        >
          <ToolTip content="View More">
            <ArrowRightCircleIcon className="w-5 h-5 ms-4" />
          </ToolTip>
        </PatientTable>
      </div>
    </div>
  );
};
