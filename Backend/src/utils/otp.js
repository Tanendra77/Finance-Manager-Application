function generateOtpCode() {// generate 6 Digit OTP code
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function otpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
module.exports = { generateOtpCode, otpExpiry };
