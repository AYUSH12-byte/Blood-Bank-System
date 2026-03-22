const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🩸 Blood Donation System — Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #c0392b, #e74c3c); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🩸 Blood Donation System</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #555; font-size: 16px;">Thank you for registering! Please use the OTP below to verify your email address.</p>
          <div style="background: #f8f8f8; border: 2px dashed #c0392b; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #888; margin: 0; font-size: 14px;">Your OTP Code</p>
            <h1 style="color: #c0392b; font-size: 48px; letter-spacing: 12px; margin: 10px 0;">${otp}</h1>
            <p style="color: #888; margin: 0; font-size: 12px;">Valid for 10 minutes only</p>
          </div>
          <p style="color: #555;">If you did not create an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2024 Blood Donation System. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (to, name, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: '🩸 Blood Donation System — Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #c0392b, #e74c3c); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">🩸 Blood Donation System</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to set a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #c0392b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #555; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #3498db; font-size: 12px; word-break: break-all;">${resetLink}</p>
          <p style="color: #555;">If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2024 Blood Donation System. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendPasswordResetEmail };
