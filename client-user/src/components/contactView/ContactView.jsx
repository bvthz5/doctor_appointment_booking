import PropTypes from "prop-types";

/**
 * The component for showing details of the hospitals
 * @param {*} it is a object with hospitals information
 * @returns the contact view of hospitals
 */
export const ContactView = ({ contactInfo }) => {
  return (
    <div className="flex justify-center">
      <div className="flex-col mt-5">
        <div className="flex justify-center">
          <div className="flex justify-center">
            <table className="text-lg mt-5 ">
              <tbody>
                <tr>
                  <td className="ps-5">
                    <p className="w-60 break-words max-sm:w-36 text-lg font-bold">
                      {contactInfo?.name?.toUpperCase()}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">
                    <p className="w-60 break-words max-sm:w-36">
                      {contactInfo?.address}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">{contactInfo?.city}</td>
                </tr>
                <tr>
                  <td className="ps-5">
                    <p className="w-60 break-words max-sm:w-36">
                      {contactInfo?.qualification}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">
                    <p className="w-60 truncate max-sm:w-36">
                      {contactInfo?.email}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="ps-5">
                    <p className="w-60 truncate max-sm:w-36">
                      {contactInfo?.contactNo}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
ContactView.propTypes = {
  contactInfo: PropTypes.any,
};
