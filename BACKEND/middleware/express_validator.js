const { body, param } = require('express-validator');

const createTempUserValidation = [
    body('name')
        .exists().withMessage('Name is required.')
        .isString().withMessage('Name must be a string.')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),

    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

    body('password')
        .exists().withMessage('Password is required.')

        .isLength({ min: 3 }).withMessage('Password must be 3 character long.'),
];


const emailValidation = [
    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

]

const verifyPassword = [
    body('otp')
        .exists().withMessage('OTP is required.')
        .isInt().withMessage('OTP must be an integer.'),

    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

    body('password')
        .exists().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
];

const verifyUserRegistrationValidation = [
    body('otp')
        .exists().withMessage('OTP is required.')
        .isInt().withMessage('OTP must be an integer.'),

    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),
];

const changePasswordValidation = [
    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

    body('currentPassword')
        .exists().withMessage('Current password is required.')
        .isLength({ min: 3 }).withMessage('Current password must be at least 3 characters long.'),
];

const verifyChangePasswordValidation = [
    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

    body('newPassword')
        .exists().withMessage('New password is required.')
        .isLength({ min: 3 }).withMessage('New password must be at least 6 characters long.'),

    body('otp')
        .exists().withMessage('OTP is required.')
        .isInt().withMessage('OTP must be an integer.'),
];

const updateUserValidation = [
    param('user_id')
        .exists().withMessage('User ID is required.'),
    body('name')
        .optional()
        .isString().withMessage('Name must be a string.')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),

    body('email')
        .optional()
        .isEmail().withMessage('Must be a valid email address.'),

    body('bio')
        .optional()
        .isString().withMessage('Bio must be a string.'),

    body('password')
        .optional()
        .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.'),
];

const logInValidation = [
    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Must be a valid email address.'),

    body('password')
        .exists().withMessage('Password is required.')
        .isLength({ min: 3 }).withMessage('Password must be at least 6 characters long.'),
];

const createBlogValidation = [
    param('user_id')
        .exists().withMessage('User ID is required.'),

    body('title')
        .exists().withMessage('Title is required.')
        .isString().withMessage('Title must be a string.')
        .isLength({ min: 1 }).withMessage('Title cannot be empty.'),

    body('content')
        .exists().withMessage('Content is required.')
        .isString().withMessage('Content must be a string.'),
];


const updateBlogValidation = [
    param('blog_id')
        .exists().withMessage('Blog ID is required.'),

    body('active')
        .optional()
        .isBoolean().withMessage('Active must be a boolean value.'),

    body('title')
        .optional()
        .isString().withMessage('Title must be a string.'),

    body('content')
        .optional()
        .isString().withMessage('Content must be a string.'),

    body('view')
        .optional()
        .isInt({ min: 0 }).withMessage('View must be a Positive integer.'),
];

module.exports = {
    createTempUserValidation,
    emailValidation,
    verifyPassword,
    verifyUserRegistrationValidation,
    changePasswordValidation,
    verifyChangePasswordValidation,
    updateUserValidation,
    logInValidation,
    createBlogValidation,
    updateBlogValidation
};





// const express = require("express");
// const router = express.Router();
// const blogController = require("../controller/blogController");
// const userController = require("../controller/userController");
// const emailController = require("../controller/emailController.js");
// const auth = require('../middleware/authentication.js');
// const multer = require('multer');
// const { storage, imageFileFilter } = require("../util/multer.js")
// const { authLimit } = require("../middleware/rateLimit.js")
// const { createTempUserValidation,
//     verifyChangePasswordValidation,
//     emailValidation,
//     verifyPassword,
//     verifyUserRegistrationValidation,
//     changePasswordValidation,
//     updateUserValidation,
//     logInValidation,
//     createBlogValidation,
//     updateBlogValidation
// } = require("../middleware/validator.js")

// // router.get("/blogs", blogController.getAllBlogs);  // done , without pagination

// router.get("/blogs", blogController.getAllBlogsPaginate); // done,  get all blogs with pagination

// router.get("/blogs/:blog_id", blogController.getBlog)          // no need/Fetch a specific blog by its unique ID 

// router.get("/blogs/slug/:slug", blogController.getBlogBySlug) // done /blogs/:slug: Fetch a specific blog by slug

// router.post("/blogs/:user_id", auth.authentication, createBlogValidation, blogController.createBlog); // done , creating the blog with auth

// router.put("/blogs/:blog_id", auth.authentication, updateBlogValidation, blogController.updateBlog); //done,   /blogs/:user_id Edit a specific blog with auth

// router.delete("/blogs/:blog_id", auth.authentication, blogController.deleteBlog);  // done , /blogs/:blog_id Delete a specific blog with auth

// router.get("/userblogs", auth.authentication, blogController.getBlogsByUser);    //done /blogs/user/  all blogs by the logged-in user.

// router.get("/verify", auth.authentication, userController.verifyUser)    // done , verify user



// // user routes
// router.post("/user", authLimit, userController.createUser);     // done , creating the user - 

// router.post("/login", authLimit, logInValidation, userController.logIn)         // done, user login

// router.delete("/user/:user_id", auth.authentication, userController.deleteUser);  //  deleting the user - 




// // update user
// const upload = multer({
//     storage,
//     limits: { fileSize: 1024 * 1024 }, // 1MB file size limit
//     fileFilter: imageFileFilter       // Check if file is image or not
// });
// router.put("/user/:user_id", auth.authentication, updateUserValidation, upload.single('profile_pic'), userController.updateUser);




// // email verification based route

// router.post("/verify/forgotpassword", authLimit, emailValidation, emailController.sendForgetPassMail);         // email verification routes done

// router.post("/verify/verifyotp", authLimit, verifyPassword, emailController.verifyForgetPassword);             // verify otp route  done

// router.post("/createtempuser", authLimit, createTempUserValidation, emailController.createTempUser);         // create temporary user          done

// router.post("/verify/userregistration", authLimit, verifyUserRegistrationValidation, emailController.verifyUserRegistration); // done


// router.post("/verify/changepassword", authLimit, changePasswordValidation, emailController.changePassword);        // for changing password
// router.post("/verify/verifychangepassword", authLimit, verifyChangePasswordValidation, emailController.verifyChangePassword)


// module.exports = router