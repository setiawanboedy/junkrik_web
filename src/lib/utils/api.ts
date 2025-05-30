import { NextApiRequest, NextApiResponse } from 'next';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
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

export function createErrorResponse(code: string, message: string, details?: string): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

export function handleApiError(
  error: unknown,
  res: NextApiResponse
): void {
  // Log error dengan informasi lebih detail
  const timestamp = new Date().toISOString();
  const errorDetails = error instanceof Error ? error.stack : String(error);
  
  console.error(`[${timestamp}] API Error:`, {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
    stack: errorDetails
  });

  if (error instanceof Error) {
    switch (error.name) {
      case 'ValidationError':
        res.status(400).json(createErrorResponse(
          'VALIDATION_ERROR',
          'Data yang dikirim tidak valid',
          error.message
        ));
        break;
      case 'NotFoundError':
        res.status(404).json(createErrorResponse(
          'NOT_FOUND',
          'Data yang dicari tidak ditemukan',
          error.message
        ));
        break;
      case 'AuthValidationError':
        res.status(400).json(createErrorResponse(
          'AUTH_VALIDATION_ERROR',
          'Data autentikasi tidak valid',
          error.message
        ));
        break;
      case 'UserExistsError':
        res.status(409).json(createErrorResponse(
          'USER_EXISTS',
          'Email sudah terdaftar. Silakan gunakan email lain atau login.',
          error.message
        ));
        break;
      case 'InvalidCredentialsError':
        res.status(401).json(createErrorResponse(
          'INVALID_CREDENTIALS',
          'Email atau password yang Anda masukkan salah',
          error.message
        ));
        break;
      default:
        res.status(500).json(createErrorResponse(
          'INTERNAL_ERROR',
          'Terjadi kesalahan pada server. Silakan coba lagi.',
          error.message
        ));
        break;
    }
  } else {
    res.status(500).json(createErrorResponse(
      'UNKNOWN_ERROR',
      'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
      String(error)
    ));
  }
}

export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.status(405).json(createErrorResponse(
      'METHOD_NOT_ALLOWED',
      `Method ${req.method} tidak diizinkan`,
      `Allowed methods: ${allowedMethods.join(', ')}`
    ));
    return false;
  }
  return true;
}
