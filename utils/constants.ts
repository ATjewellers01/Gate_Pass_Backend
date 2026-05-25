export const ROUTE_PREFIXES = {
  AUTH: "/api/auth",
  USERS: "/api/users",
  SYSTEM_USERS: "/api/system-users",
  VISITS: "/api/visits",
  DATA: "/api/data",
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_CREDENTIALS: "Invalid username or password. Please try again.",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  VISIT_CREATED: "Submitted successfully",
  VISIT_APPROVED: "Visit approved",
  VISIT_CLOSED: "Gate pass closed",
};

export const ENV_VARS = {
  PORT: "PORT",
  DATABASE_URL: "DATABASE_URL",
};

export const TABLE_NAMES = {
  USERS: "users",
  VISITS: "visits",
};
