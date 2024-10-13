exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, bio, password } = req.body;

    if (!user_id || !req.user.user_id) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }
    if (user_id != req.user.user_id) {
        return res.sendStatus(403);
    }
    if (password) hashedPassword = await bcrypt.hash(password, 10);




    try {

        // check if user exist
        const user = await Users.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        // dynamiic update
        let fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (bio) fieldsToUpdate.bio = bio;
        if (password) fieldsToUpdate.password = hashedPassword

        const updatedUser = Users.update(fieldsToUpdate, { where: { user_id } });
        if (!updatedUser) {
            return res.status(400).json({ message: "No changes made or User not found!" });
        }


        // send response based on weather imgage added or not
        if (!req.file) {
            console.log("\nError while file uploading ❌\n");
            return res.status(200).json({ message: "Details updated successfully but error uploading image !", updatedUser });
        } else {
            console.log("\nFile uploaded successfully ✅\n");
            // now update filepath in db
            const profile_picture = req.file.path;
            Users.update({ profile_picture }, { where: { user_id } });
            return res.status(200).json({ message: "Details and Picture updated successfully ", updatedUser });
        }


    } catch (error) {
        console.error("Error updating the User: ", error);
        return res.status(500).json({ message: "Error updating the User!", error });

    }
}





exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email, bio, password } = req.body;

    // Validate request
    if (!user_id || user_id !== req.user.user_id) {
        return res.status(400).json({ message: 'Invalid user ID or missing required fields.' });
    }

    try {
        // Find the user
        const user = await Users.findOne({ where: { user_id } });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        // Prepare updated fields
        const fieldsToUpdate = { name, email, bio };
        if (password) {
            fieldsToUpdate.password = await bcrypt.hash(password, 10);
        }

        // Update user details
        await Users.update(fieldsToUpdate, { where: { user_id } });

        // Handle file upload, if any
        if (req.file) {
            const profile_picture = req.file.path;
            await Users.update({ profile_picture }, { where: { user_id } });
            return res.status(200).json({ message: 'Profile and picture updated successfully.', profile_picture });
        }

        return res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating the user:', error);
        return res.status(500).json({ message: 'Server error while updating the user.', error });
    }
};
