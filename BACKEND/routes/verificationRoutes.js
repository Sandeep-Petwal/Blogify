const express = require("express");
const emailController = require("../controller/emailController")
const verificationRoutes = express.Router();
const { authLimit } = require("../middleware/rateLimit.js")

verificationRoutes.post("/forgotpassword", authLimit, emailController.sendForgetPassMail)
verificationRoutes.post("/verifyotp", authLimit, emailController.verifyForgetPassword);
verificationRoutes.post("/createtempuser", authLimit, emailController.createTempUser);
verificationRoutes.post("/userregistration", authLimit, emailController.verifyUserRegistration);
verificationRoutes.post("/changepassword", authLimit, emailController.changePassword);
verificationRoutes.post("/verifychangepassword", authLimit, emailController.verifyChangePassword)


module.exports = verificationRoutes