import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Custom Error Classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthValidationError';
  }
}

export class UserExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserExistsError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error
  };
}

export function handleApiError(
  error: unknown,
  res: NextApiResponse
): void {
  console.error('API Error:', error);

  if (error instanceof Error) {
    switch (error.name) {
      case 'ValidationError':
        res.status(400).json(createErrorResponse(error.message));
        break;
      case 'NotFoundError':
        res.status(404).json(createErrorResponse(error.message));
        break;
      case 'AuthValidationError':
        res.status(400).json(createErrorResponse(error.message));
        break;
      case 'UserExistsError':
        res.status(409).json(createErrorResponse(error.message));
        break;
      case 'InvalidCredentialsError':
        res.status(401).json(createErrorResponse(error.message));
        break;
      default:
        res.status(500).json(createErrorResponse('Internal server error'));
        break;
    }
  } else {
    res.status(500).json(createErrorResponse('Internal server error'));
  }
}

export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.status(405).json(createErrorResponse(`Method ${req.method} not allowed`));
    return false;
  }
  return true;
}
