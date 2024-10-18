interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T; // Optional data field for successful responses
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string; // Optional error field for more detailed errors
}

export const successResponse = <T>(
  message: string,
  data?: T
): SuccessResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
  error?: string
): ErrorResponse => ({
  success: false,
  message,
  error,
});
