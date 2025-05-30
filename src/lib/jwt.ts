import jwt, { JsonWebTokenError } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      // Return null or throw custom error for invalid token
      return null;
    }
    throw err;
  }
}

export { verifyToken as verifyJWT }; // Alias for backward compatibility
