const express = require("express");
const adminController = require("../controller/adminController")
const adminRoutes = express.Router();
const auth = require("../middleware/authentication");


adminRoutes.delete("/blogs/:blog_id", auth.adminAuth, adminController.deleteBlog);  // DELETE /admin/blogs/:blog_id  : delete a blog

adminRoutes.get("/users", auth.adminAuth, adminController.getAllUsers);     // GET /admin/users    : get all users

adminRoutes.delete("/users/:user_id", auth.adminAuth, adminController.deleteUser);  //DELETE /admin/users/:user_id     : delete a user






module.exports = adminRoutes