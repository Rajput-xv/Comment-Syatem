import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send verification email using Resend
export const sendVerificationEmail = async (email, token) => {
  console.log('📨 [Resend] Starting email send process...');
  console.log('   To:', email);
  
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    const { data, error } = await resend.emails.send({
      from: 'CommentHub <onboarding@resend.dev>',
      to: [email],
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
    });

    if (error) {
      throw error;
    }

    console.log('[Resend] Email sent successfully!');
    console.log('   Email ID:', data.id);
    return data;
  } catch (error) {
    console.error('[Resend] Email send failed!');
    console.error('   Error:', error.message);
    throw error;
  }
};
