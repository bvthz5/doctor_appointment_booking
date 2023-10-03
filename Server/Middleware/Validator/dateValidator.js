const moment = require("moment");

// Function to validate date format
function isValidDateFormat(dateString) {
  const validFormats = ["YYYY-MM-DD", "MM-DD-YYYY"];
  return validFormats.some((format) =>
    moment(dateString, format, true).isValid()
  );
}

// Function to check if the date is greater than or equal to the current date
function isDateGreaterThanOrEqualToToday(dateString) {
  return moment(dateString).isSameOrAfter(moment(), "day");
}

// Function to check if the date is lessthan than or equal to the current date
function isDateLessThanOrEqualToToday(dateString) {
  return moment(dateString).isSameOrBefore(moment(), "day");
}

// Function to check if the date is greater than or equal to the current date
function isGreaterThanToday(dateString) {
  const today = new Date(); // Get the current date
  const inputDate = new Date(dateString); // Convert the input string to a date object
  return inputDate > today;
}
module.exports = {
  isValidDateFormat,
  isDateGreaterThanOrEqualToToday,
  isDateLessThanOrEqualToToday,
  isGreaterThanToday
};
