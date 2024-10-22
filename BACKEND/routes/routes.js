const express = require("express");
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authentication.js');
const { authLimit } = require("../middleware/rateLimit.js")
const blogController = require("../controller/blogController");
const userController = require("../controller/userController");
const { storage, imageFileFilter } = require("../util/multer.js")


router.get("/search/:search_input", blogController.searchBlogs); // search
router.get("/blogs", blogController.getPublicBlogs); //  get all blogs with pagination
router.get("/blogs/slug/:slug", blogController.getBlogBySlug) // blogs/:slug: Fetch a specific blog by slug
router.post("/blogs/:user_id", auth.authentication, blogController.createBlog); //  creating the blog with auth
router.put("/blogs/:blog_id", auth.authentication, blogController.updateBlog); //  /blogs/:user_id Edit a specific blog with auth       
router.delete("/blogs/:blog_id", auth.authentication, blogController.deleteBlog);  //  /blogs/:blog_id Delete a specific blog with auth



router.get("/user/profile/:user_id", blogController.getPublicProfile);            // public profile of user visible to everyone
router.get("/user/publicblogs/:user_id", blogController.getUsersPublicBlog)      //  public blogs of user    visible to everyone

// user routes
router.get("/userblogs", auth.authentication, blogController.getBlogsByUser);    //blogs/user/  all blogs by the logged-in user.
router.get("/verify", auth.authentication, userController.verifyUser)    //  verify user
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



// for testing perpose
router.get("/", (req, res) => {
    const response = require("../util/response.js")
    return response.success(res, "This the api route")
})