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
}

export interface LoginRequest {
  email: string;
  password: string;
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

export function validateRegisterInput(data: any): RegisterRequest {
  const { email, password, businessName, address, phone, wasteType, wasteVolume, role } = data;

  if (!email || !password || !businessName || !address || !phone) {
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
    wasteType: wasteType?.trim(),
    wasteVolume: wasteVolume ? parseInt(wasteVolume) : undefined,
    role: role || 'business'
  };
}

export function validateLoginInput(data: any): LoginRequest {
  const { email, password } = data;

  if (!email || !password) {
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
