import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT token for authentication
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate random verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
