const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const userController = require("../controller/userController");
const emailController = require("../controller/emailController.js");
const auth = require('../middleware/authentication.js');
const multer = require('multer');
const { storage } = require("../util/multer.js")
const { authLimit } = require("../middleware/rateLimit.js")

// router.get("/blogs", blogController.getAllBlogs);  // done , without pagination

router.get("/blogs", blogController.getAllBlogsPaginate); // done,  get all blogs with pagination

router.get("/blogs/:blog_id", blogController.getBlog)          // no need/Fetch a specific blog by its unique ID 

router.get("/blogs/slug/:slug", blogController.getBlogBySlug) // done /blogs/:slug: Fetch a specific blog by slug

router.post("/blogs/:user_id", auth.authentication, blogController.createBlog); // done , creating the blog with auth

router.put("/blogs/:blog_id", auth.authentication, blogController.updateBlog); //done,   /blogs/:user_id Edit a specific blog with auth

router.delete("/blogs/:blog_id", auth.authentication, blogController.deleteBlog);  // done , /blogs/:blog_id Delete a specific blog with auth

router.get("/userblogs", auth.authentication, blogController.getBlogsByUser);    //done /blogs/user/  all blogs by the logged-in user.

router.get("/verify", auth.authentication, userController.verifyUser)    // done , verify user



// user routes
router.post("/user", authLimit, userController.createUser);     // done , creating the user - 

router.post("/login", authLimit, userController.logIn)         // done, user login

router.delete("/user/:user_id", auth.authentication, userController.deleteUser);  //  deleting the user - 


// update user
const upload = multer({ storage });
router.put("/user/:user_id", auth.authentication, upload.single('profile_pic'), userController.updateUser);









// email verification based route

router.post("/verify/forgotpassword", authLimit, emailController.sendForgetPassMail); // email verification routes done

router.post("/verify/verifyotp", authLimit, emailController.verifyForgetPassword);             // verify otp route  done

router.post("/createtempuser", authLimit, emailController.createTempUser);        // create temporary user          done

router.post("/verify/userregistration", authLimit, emailController.verifyUserRegistration); // done

 
router.post("/verify/changepassword", authLimit, emailController.changePassword);        // for changing password
router.post("/verify/verifychangepassword", authLimit, emailController.verifyChangePassword)


module.exports = router