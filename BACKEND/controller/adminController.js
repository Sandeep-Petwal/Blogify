const User = require("../models/userModel");
const Blog = require("../models/blogsModel");

exports.getAllBlogs = async (req, res) => {
    const { user_id } = req.user;
    if (!user_id) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }
    try {
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (user.role !== "admin") {
            return res.sendStatus(403);
        }

        const { count, rows } = await Blog.findAndCountAll();

        if (rows.length === 0) {
            return res.status(200).json({ message: "No Blogs found!", blogs: rows, count });
        }
        return res.status(200).json({ blogs: rows, count });

    } catch (error) {
        console.error("Error getting the blogs:", error);
        return res.status(500).json({ message: "Error getting the blogs!", error });
    }
};


exports.deleteBlog = async (req, res) => {
    const { blog_id } = req.params;

    try {
        const blog = await Blog.findOne({ where: { blog_id } });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        await blog.destroy();
        return res.status(200).json({ message: "Blog deleted successfully!" });
    } catch (error) {
        console.error("Error deleting the blog:", error);
        return res.status(500).json({ message: "Error deleting the blog!", error });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const { count, rows } = await User.findAndCountAll();

        if (rows.length === 0) {
            return res.status(200).json({ message: "No users found!", users: [] });
        }

        return res.status(200).json({ user: rows, count });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Error fetching users!", error });
    }
};


exports.deleteUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        // if exists
        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // admin can not delete other admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: "You cannot delete another admin!" });
        }

        // delete user and blogs
        await user.destroy();

        return res.status(200).json({ message: "User and associated blogs deleted successfully!" });
    } catch (error) {
        console.error("Error deleting the user:", error);
        return res.status(500).json({ message: "Error deleting the user!", error });
    }
};
