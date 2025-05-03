import { ApiError, ZodError } from "@/types/errors";

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

export function isZodError(error: unknown): error is ZodError {
  return (
    typeof error === "object" &&
    error !== null &&
    "success" in error &&
    (error as ZodError).success === false &&
    "error" in error &&
    typeof (error as ZodError).error === "object" &&
    (error as ZodError).error !== null &&
    "issues" in (error as ZodError).error &&
    "name" in (error as ZodError).error &&
    (error as ZodError).error.name === "ZodError"
  );
}
