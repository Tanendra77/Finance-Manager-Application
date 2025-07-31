const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "Gmail",// for direct mail service 

    //for testing purpose
    // host: "smtp.ethereal.email",          
    // port: 587,
    // secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS         // Your ethereal password OR .env value
    },
});

/**
 * Send an OTP email to recipient.
 */
async function sendOTPEmail(recipientEmail, otp) {
    const info = await transporter.sendMail({
    from: `"Finance App" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: "🔐 Your OTP Code for Finance App",
    text: `Your OTP code is: ${otp}`, // fallback text
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="text-align: center; color: #2c3e50;">🔐 Finance App Verification</h2>
        <p style="font-size: 16px;">Hi there,</p>
        <p style="font-size: 16px;">Use the following OTP to verify your email address:</p>
        
        <div style="margin: 20px 0; text-align: center;">
          <div style="display: inline-block; font-size: 24px; padding: 10px 20px; background-color: #f2f2f2; border-radius: 8px; font-weight: bold; letter-spacing: 2px;" id="otp">${otp}</div>
        </div>

        <p style="font-size: 14px; color: #555;">This code is valid for the next 10 minutes. Do not share this with anyone.</p>

        <p style="font-size: 14px; color: #888;">Having trouble? Just copy and paste the code manually.</p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} Github@Tanendra77 - Finance App. All rights reserved.
        </p>
      </div>
    `
  });

  console.log("📧 OTP email sent to:", recipientEmail, "| Message ID:", info.messageId);
}

module.exports = { sendOTPEmail };
