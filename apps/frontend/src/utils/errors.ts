export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function getErrorMessage(error: any): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export function logError(context: string, error: any): void {
  console.error(`[${context}]`, {
    message: error?.message,
    status: error?.response?.status,
    data: error?.response?.data,
    stack: error?.stack,
  });
}
