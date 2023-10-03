import PropTypes from "prop-types";

/**
 * component to display  the error message
 * @param {object} with message as string with the actual message and success is bool for identifing success or fail
 * @returns
 */
export const ErrorDisplay = ({ message, success = false }) => {
  return (
    <h1
      className={`w-full h-10 p-2  flex items-center  text-destructive-foreground rounded-md text-sm ${
        (message && success && "bg-green-400") ||
        (message && !success && "bg-destructive") ||
        "bg-transparent"
      }`}
    >
      {message}
    </h1>
  );
};

ErrorDisplay.propTypes = { message: PropTypes.string, success: PropTypes.bool };
