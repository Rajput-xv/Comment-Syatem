import { createTransport } from 'nodemailer';

// Create email transporter for sending verification emails
export const createTransporter = () => {
  return createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });
};

// Send verification email to user
export const sendVerificationEmail = async (email, token) => {
  console.log('📨 [Email Service] Starting email send process...');
  console.log('   To:', email);
  console.log('   Token:', token.substring(0, 10) + '...');
  
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    console.log('   Verification URL:', verificationUrl);
    console.log('   SMTP Config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER
    });

    const mailOptions = {
      from: `"CommentHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - CommentHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for registering! Please verify your email by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
          <p style="color: #4F46E5; font-size: 14px;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 24 hours.</p>
        </div>
      `,
    };

    console.log('   Sending email via SMTP...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [Email Service] Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return info;
  } catch (error) {
    console.error('❌ [Email Service] Email send failed!');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Stack:', error.stack);
    throw error;
  }
};
