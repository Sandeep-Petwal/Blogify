const express = require("express");
const adminController = require("../controller/adminController")
const adminRoutes = express.Router();
const auth = require("../middleware/authentication");


adminRoutes.delete("/blogs/:blog_id", auth.adminAuth, adminController.deleteBlog);
adminRoutes.get("/users", auth.adminAuth, adminController.getAllUsers);
adminRoutes.delete("/users/:user_id", auth.adminAuth, adminController.deleteUser);


module.exports = adminRoutes