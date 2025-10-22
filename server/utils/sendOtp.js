import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // This is correct for port 587
  auth: {
    user: process.env.BREVO_LOGIN,     
    pass: process.env.BREVO_PASSWORD
  },
});

// Function to send OTP via email
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Track It Back" <${process.env.MY_EMAIL}>`, // MY_EMAIL must be a "Verified Sender" in SendGrid
    to, 
    subject: 'Your OTP Code',
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 650px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #e0e0e0;">
      <div style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">🔐 Your OTP Code</h1>
        <p style="color: #7f8c8d; font-size: 14px;">Secure Verification • Trackit Back</p>
      </div>

      <p style="font-size: 16px; color: #333;">
        Hello,
      </p>

      <p style="font-size: 16px; color: #333;">
        Your one-time password (OTP) is:
      </p>

      <div style="background-color: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; color: #2980b9;">${otp}</span>
      </div>

      <p style="font-size: 16px; color: #333;">
        This OTP will expire in <strong>5 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style="color: #888; margin-top: 20px;">
        Best regards,<br/>
        <em>The Trackit Back Team</em>
      </p>
    </div>
  `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    
    if (error.response) {
      console.error(error.response.body);
    }
    
    throw new Error('Failed to send OTP email. Please try again.');
  }
};

export default sendOtpEmail;