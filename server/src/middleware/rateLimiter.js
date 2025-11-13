import rateLimit from 'express-rate-limit';

// Rate limit for comment creation: 5 comments per minute
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many comments, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
