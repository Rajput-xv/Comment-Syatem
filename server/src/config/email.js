import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send verification email using SendGrid
export const sendVerificationEmail = async (email, token) => {
  console.log('📨 [SendGrid] Starting email send process...');
  console.log('   To:', email);
  console.log('   Token:', token.substring(0, 10) + '...');
  
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    console.log('   Verification URL:', verificationUrl);

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified sender in SendGrid
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

    console.log('   Sending email via SendGrid...');
    const response = await sgMail.send(msg);
    console.log('[SendGrid] Email sent successfully!');
    console.log('   Status Code:', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('[SendGrid] Email send failed!');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.body);
    }
    throw error;
  }
};
