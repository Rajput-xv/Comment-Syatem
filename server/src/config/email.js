import Brevo from '@getbrevo/brevo';

// Initialize Brevo API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Send verification email using Brevo (Sendinblue)
export const sendVerificationEmail = async (email, token) => {
  console.log('📨 [Brevo] Starting email send process...');
  console.log('   To:', email);
  console.log('   Token:', token.substring(0, 10) + '...');
  
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    console.log('   Verification URL:', verificationUrl);

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: process.env.BREVO_FROM_NAME || 'CommentHub',
      email: process.env.BREVO_FROM_EMAIL
    };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = 'Verify Your Email - CommentHub';
    sendSmtpEmail.htmlContent = `
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
    `;

    console.log('   Sending email via Brevo...');
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('[Brevo] Email sent successfully!');
    console.log('   Message ID:', response.messageId);
    return response;
  } catch (error) {
    console.error('[Brevo] Email send failed!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.body);
    }
    throw error;
  } 
};

// Send password reset email using Brevo
export const sendPasswordResetEmail = async (email, username, resetUrl) => {
  console.log('📨 [Brevo] Sending password reset email...');
  console.log('   To:', email);
  
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: process.env.BREVO_FROM_NAME || 'CommentHub',
      email: process.env.BREVO_FROM_EMAIL
    };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = 'Reset Your Password - CommentHub';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hi ${username},</p>
        <p>You requested to reset your password for your CommentHub account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #4F46E5; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    console.log('   Sending reset email via Brevo...');
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('[Brevo] Password reset email sent successfully!');
    console.log('   Message ID:', response.messageId);
    return response;
  } catch (error) {
    console.error('[Brevo] Password reset email send failed!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.body);
    }
    throw error;
  }
};
