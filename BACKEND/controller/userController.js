const Users = require("../models/userModel");
var jwt = require('jsonwebtoken');
const secret = process.env.PRIVATE_KEY || "sandeepprasadpetwal51";
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const { storage } = require("../util/multer")
const fs = require('fs');


// verify user
exports.verifyUser = async (req, res) => {
    console.log("Inside verify user");
    const { user_id, email } = req.user;
    if (!user_id || !email) {
        return res.status(401).json({ message: "Unauthorized: Missing user information." });
    }

    try {
        let user = await Users.findOne({ where: { user_id } });

        if (!user || user.email !== email) {
            return res.status(401).json({ message: "Unauthorized: Invalid user credentials." });
        }

        return res.status(200).json({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            createdAt: user.createdAt,
            profile_picture: user.profile_picture
        });
    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({ message: "Error verifying user.", error });
    }
};


// user login 
exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    if (!email, !password) {
        return res.status(400).json({ message: 'Required fields are missing .' });
    }

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            // console.log("User not found");
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid username or password " });
        }

        // if all details are correct
        const { user_id, name } = user;
        const token = jwt.sign({ user_id, name, email: user.email }, secret, { expiresIn: "1d" });
        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        return res.status(400).json({ message: "Error in Login !", error })
    }
}

//create a new user 
exports.createUser = async (req, res) => {
    let { name, email, bio, password } = req.body;
    if (!bio) {
        bio = "";
    }
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Required fields are missing .' });
    }

    try {
        // check if user already exists ?
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email is already exists !" })
        }
        //if user not exists
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ name, email, bio, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        return res.status(400).json({ message: "Error registering the user !", error })
    }
};

// update the user
const upload = multer({ storage });

exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, bio, password } = req.body;

    // Check for required fields
    if (!user_id || !req.user.user_id) { 
        return res.status(400).json({ message: 'Required fields are missing.' });
    }
    if (user_id != req.user.user_id) {
        return res.sendStatus(403);
    }

    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
        // Check if user exists
        const user = await Users.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Prepare fields to update
        let fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (bio) fieldsToUpdate.bio = bio;
        if (password) fieldsToUpdate.password = hashedPassword;

        // Update user details
        const updatedUser = await Users.update(fieldsToUpdate, { where: { user_id } });

        // Check for file upload
        if (req.file) {
            const profile_picture = req.file.path;

            // delete old and Update profile picture path in the database
            await Users.update({ profile_picture }, { where: { user_id } });

            // now deleting the stored image in upload folder -
            console.log("\nDeleting the file =>>> " + user.profile_picture + "\n");

            if (user.profile_picture && user.profile_picture !== "uploads/default_profile.jpg") {
                const filePath = path.join(__dirname, '../', user.profile_picture);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                    }
                    console.log("✅✅✅ Sucessfully deleted the file");
                });
            }


            return res.status(200).json({ message: "Details and picture updated successfully.", profile_picture });
        } else {
            console.log("\nNo file uploaded, but other details updated ✅\n");
            return res.status(200).json({ message: "Details updated successfully, but no image uploaded." });
        }
    } catch (error) {
        console.error("Error updating the User: ", error);
        return res.status(500).json({ message: "Error updating the User!", error });
    }
}


// Delete the user
exports.deleteUser = async (req, res) => {
    const { user_id } = req.user;
    let user_id_params = req.params.user_id;
    user_id_params = Number(user_id_params);

    if (!user_id || !user_id_params || !Number.isInteger(user_id_params)) {
        return res.status(400).json({ message: 'Required fields are missing or invalid.' });
    }

    // check if user is author 
    if (user_id !== user_id_params) {
        return res.sendStatus(403);
    }

    try {
        const affectedRows = await Users.destroy({ where: { user_id } });
        if (affectedRows === 0) {
            return res.status(400).json({ message: "No user found to delete!" });
        }
        return res.status(200).json({
            message: "User and associated blogs deleted successfully!",
        });

    } catch (error) {
        console.error("Error Deleting the user: ", error);
        return res.status(500).json({ message: "Error Deleting the user!", error });
    }
};
