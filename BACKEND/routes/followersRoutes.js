const express = require("express");
const followersRoutes = express.Router();
const auth = require('../middleware/authentication.js');
const blogController = require("../controller/blogController");
const userController = require("../controller/userController");



// route to make a follow request 
followersRoutes.post("/follow/:user_id",)

// route to accept, remove following
followersRoutes.put("/follow/:user_id",)

// route to get all followers of a user
followersRoutes.get("/followers/:user_id",)

// route to get all following of a user
followersRoutes.get("following/:user_id",)

module.exports = followersRoutes;