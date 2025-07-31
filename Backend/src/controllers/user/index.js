const registerController = require('./registerController');
const loginController = require('./loginController');
const otpController = require('./otpController');
const profileController = require('./profileController');
const passwordController = require('./passwordController');

module.exports = {
  ...registerController,
  ...loginController,
  ...otpController,
  ...profileController,
  ...passwordController,
};
