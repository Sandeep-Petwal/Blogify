const express = require("express");
const verify = express.Router();
const emailVerification = require("../controller/emailController")



// route for forget password email send
verify.post("/forgetpassword", emailVerification.sendForgetPassMail);

verify.post("/verifyotp", emailVerification.verifyOtp);

// for changing password
verify.post("/changepassword",emailVerification.changePassword);