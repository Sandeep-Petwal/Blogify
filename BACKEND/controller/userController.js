const Users = require("../models/userModel");
var jwt = require('jsonwebtoken');
const secret = process.env.PRIVATE_KEY || "sandeepprasadpetwal51";
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const Validator = require('validatorjs');
const validate = require('../middleware/validators');

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

    const rules = {
        email: "required|email|email_registered",
        password: "required|min:3"
    };
    const { status, message } = await validate({ email, password }, rules);
    if (!status) {
        return res.status(400).json({ message });
    }

    try {
        const user = await Users.findOne({ where: { email } });
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const { user_id, name } = user;
        const token = jwt.sign({ user_id, name, email: user.email }, secret, { expiresIn: "1d" });
        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.log("Error \n");
        console.log(error);
        return res.status(400).json({ message: "Error in Login!", error });
    }
};


//create a new user 
exports.createUser = async (req, res) => {
    let { name, email, bio, password } = req.body;
    const rules = {
        name: "required|string|min:3|max:50",
        password: "required|string|min:3",
        bio: "max:200|string",
        email: "required|email|email_available" 
    };

    let { status, message } = await validate({ name, email, bio, password }, rules);
    if (!status) {
        return res.status(400).json({ message });
    }

    // validation passes
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ name, email, bio, password: hashedPassword });
        return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        return res.status(400).json({ message: "Error registering the user!", error });
    }
};


exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, bio, password } = req.body;

    if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
    }

    // Validation rules
    const rules = {
        user_id: "required|numeric|user_registered",
        name: "max:50|min:3",
        email: "email",
        bio: "max:200",
        password: "min:3"
    };

    let { status, message } = await validate({ user_id, name, email, bio, password }, rules);
    if (!status) {
        return res.status(400).json({ message });
    }

    if (user_id != req.user.user_id) {
        return res.sendStatus(403);
    }

    //  if no fields are provided and no file uploaded
    const fieldsProvided = [name, email, bio, password].some(field => field);
    if (!fieldsProvided && !req.file) {
        return res.status(400).json({ message: "No field is provided to update !" });
    }

    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
        const user = await Users.findOne({ where: { user_id } });
        let fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (bio) fieldsToUpdate.bio = bio;
        if (password) fieldsToUpdate.password = hashedPassword;

        // Update user details
        await Users.update(fieldsToUpdate, { where: { user_id } });

        if (req.file) {
            const profile_picture = req.file.path;
            await Users.update({ profile_picture }, { where: { user_id } });

            // Handle old profile picture deletion
            if (user.profile_picture && user.profile_picture !== "uploads/default_profile.jpg") {
                const filePath = path.join(__dirname, '../', user.profile_picture);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                    } else {
                        console.log("✅ Successfully deleted the old profile picture");
                    }
                });
            }

            return res.status(200).json({ message: "Details and picture updated successfully.", profile_picture });
        } else {
            return res.status(200).json({ message: "Details updated successfully, but no image uploaded." });
        }
    } catch (error) {
        console.error("Error updating the User: ", error);
        return res.status(500).json({ message: "Error updating the User!", error });
    }
};



// Delete the user
exports.deleteUser = async (req, res) => {
    const { user_id } = req.user;
    let user_id_params = req.params.user_id;
    user_id_params = Number(user_id_params);
    const rules = {
        user_id: "required|numeric",
        user_id_params: "required|numeric"
    };
    const validation = new Validator({ user_id, user_id_params }, rules);
    if (validation.fails() || !Number.isInteger(user_id_params)) {
        return res.status(400).json({ errors: validation.errors.all(), message: Object.values(validation.errors.all()).flat()[0] });
    }

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
        console.error("Error deleting the user: ", error);
        return res.status(500).json({ message: "Error deleting the user!", error });
    }
};
