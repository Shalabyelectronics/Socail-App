export const formattedDate = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

/**
 * Formats error messages from the backend to be more user-friendly
 * @param {string} errorMessage - The error message from the backend
 * @returns {string} - Formatted user-friendly error message
 */
export const formatErrorMessage = (errorMessage) => {
  if (!errorMessage) return "An error occurred. Please try again.";

  // Handle password pattern validation error
  if (
    errorMessage.includes("fails to match the required pattern") &&
    errorMessage.includes("password")
  ) {
    return "Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and special character (#?!@$%^&*-)";
  }

  // Handle email pattern validation error
  if (
    errorMessage.includes("fails to match the required pattern") &&
    errorMessage.includes("email")
  ) {
    return "Please enter a valid email address";
  }

  // Return original message if no special formatting needed
  return errorMessage;
};
