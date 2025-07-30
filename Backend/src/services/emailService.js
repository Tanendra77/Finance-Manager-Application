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
    subject: "Your OTP Code",
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <b>${otp}</b></p>`,
  });
  console.log("Sent OTP email:", info.messageId);
}

module.exports = { sendOTPEmail };
sendOTPEmail("siddhesh.paithankar@mitaoe.ac.in", "123456"); 