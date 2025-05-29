// Validation schemas untuk authentication
export interface RegisterRequest {
  email: string;
  password: string;
  businessName: string;
  address: string;
  phone: string;
  wasteType?: string;
  wasteVolume?: number;
  role?: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    businessName: string;
  };
}

export class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthValidationError';
  }
}

export function validateRegisterInput(data: unknown): RegisterRequest {
  const validData = data as Record<string, unknown>;
  const { email, password, businessName, address, phone, wasteType, wasteVolume, role } = validData;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string' || 
      !businessName || typeof businessName !== 'string' || 
      !address || typeof address !== 'string' || 
      !phone || typeof phone !== 'string') {
    throw new AuthValidationError('Email, password, business name, address, and phone are required');
  }

  if (password.length < 6) {
    throw new AuthValidationError('Password must be at least 6 characters long');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthValidationError('Invalid email format');
  }

  return {
    email: email.toLowerCase().trim(),
    password,
    businessName: businessName.trim(),
    address: address.trim(),
    phone: phone.trim(),
    wasteType: typeof wasteType === 'string' ? wasteType.trim() : undefined,
    wasteVolume: typeof wasteVolume === 'string' ? parseInt(wasteVolume) : typeof wasteVolume === 'number' ? wasteVolume : undefined,
    role: typeof role === 'string' ? role : 'business'
  };
}

export function validateLoginInput(data: unknown): LoginRequest {
  const validData = data as Record<string, unknown>;
  const { email, password } = validData;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    throw new AuthValidationError('Email and password are required');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthValidationError('Invalid email format');
  }

  return {
    email: email.toLowerCase().trim(),
    password
  };
}
