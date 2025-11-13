import User from '../models/User.js';
import { generateToken, generateVerificationToken } from '../utils/token.js';
import { sendVerificationEmail } from '../config/email.js';

// Register new user and send verification email
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpiry: tokenExpiry,
    });

    // Send email asynchronously without blocking the response
    sendVerificationEmail(email, verificationToken).catch(error => {
      console.error('Failed to send verification email:', error);
    });

    // Respond immediately without waiting for email
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user with email and password
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true 
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify user email with token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
