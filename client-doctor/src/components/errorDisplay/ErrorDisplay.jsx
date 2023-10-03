import PropTypes from "prop-types";

/**
 * The component is used to show the error message that get from api in the login,and other pages with form
 * @param {*} message to be showned in the errormessage component
 * @returns error displaying component 
 */
export const ErrorDisplay = ({ message }) => {
  return (
    <h1
      className={`w-full h-10 p-2  flex items-center  text-destructive-foreground rounded-md text-sm ${
        message ? "bg-destructive" : "bg-transparent"
      }`}
    >
      {message}
    </h1>
  );
};

ErrorDisplay.propTypes = { message: PropTypes.string }; 
