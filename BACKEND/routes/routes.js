const express = require("express");
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authentication.js');
const { authLimit } = require("../middleware/rateLimit.js")
const blogController = require("../controller/blogController");
const userController = require("../controller/userController");
const { storage, imageFileFilter } = require("../util/multer.js")


// search
router.get("/search/:search_input", blogController.searchBlogs); 


router.get("/blogs", blogController.getAllBlogsPaginate); //  get all blogs with pagination
router.get("/blogs/slug/:slug", blogController.getBlogBySlug) // blogs/:slug: Fetch a specific blog by slug
router.post("/blogs/:user_id", auth.authentication, blogController.createBlog); //  creating the blog with auth
router.put("/blogs/:blog_id", auth.authentication, blogController.updateBlog); //  /blogs/:user_id Edit a specific blog with auth
router.delete("/blogs/:blog_id", auth.authentication, blogController.deleteBlog);  //  /blogs/:blog_id Delete a specific blog with auth
router.get("/userblogs", auth.authentication, blogController.getBlogsByUser);    //blogs/user/  all blogs by the logged-in user.
router.get("/verify", auth.authentication, userController.verifyUser)    //  verify user



// user routes
router.post("/user", authLimit, userController.createUser);      // creating a new user
router.post("/login", authLimit, userController.logIn);        // login route



router.delete("/user/:user_id", auth.authentication, userController.deleteUser); // deleting user by user
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: imageFileFilter
});
router.put("/user/:user_id", auth.authentication, upload.single('profile_pic'), userController.updateUser); // update user profile


module.exports = router