interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
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
