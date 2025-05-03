import { ApiError } from "../types/errors";

export function isApiError(error: unknown): error is ApiError {
  return (
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "message" in error &&
      "originalError" in error &&
      typeof (error as ApiError).status === "number") ||
    ((error as ApiError).status === undefined &&
      typeof (error as ApiError).message === "string" &&
      (error as ApiError).originalError instanceof Error)
  );
}
