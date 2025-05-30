import prisma from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/jwt';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/lib/validations/auth';
import { UserExistsError, InvalidCredentialsError } from '@/lib/utils/api';

export class AuthService {
  /**
   * Register a new business user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new UserExistsError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        businessName: data.businessName,
        address: data.address,
        phone: data.phone,
        wasteType: data.wasteType,
        wasteVolume: data.wasteVolume,
        role: data.role
      }
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      businessName: user.businessName
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName
      }
    };
  }
  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new InvalidCredentialsError('Email atau password yang Anda masukkan salah');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Email atau password yang Anda masukkan salah');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      businessName: user.businessName
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName
      }
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        businessName: true,
        address: true,
        phone: true,
        wasteType: true,
        wasteVolume: true,
        role: true,
        createdAt: true
      }
    });
  }
}
