const slugify = require('slugify');
const Blogs = require('../models/blogsModel');
const Users = require('../models/userModel');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.findAll(
            {
                include: [{ model: Users, as: "user", attributes: ['name', 'email'] }]
            }
        );
        if (blogs.length == 0) {
            return res.status(204).json({ error: "No todos found !" })
        }
        res.json(blogs);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error Getting the user !", error })
    }
};

// paginate blogs
exports.getAllBlogsPaginate = async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // default page =  1 ,  limit = 10
    limit = Math.min(limit, 20);             // maximum 20 


    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Blogs.findAndCountAll({
            include: [{ model: Users, as: "user", attributes: ['name', 'email'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalPages = Math.ceil(count / limit);

        if (rows.length === 0) {
            return res.status(204).json({ error: "No blogs found!" });
        }

        res.json({
            blogs: rows,
            count,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error getting blogs!", error });
    }
};



exports.getBlog = async (req, res) => {
    const { blog_id } = req.params;
    if (!blog_id) {
        res.status(400).json({ message: "blog_id required !" })
    }
    try {
        let blog = await Blogs.findAll({
            where: { blog_id },
            include: [{ model: Users, as: "user", attributes: ["name", "email", "createdAt", "updatedAt"] }]
        });
        res.json(blog)
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error Getting the Blog !", error })
    }
}
exports.getBlogBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        res.status(400).json({ message: "slug required !" })
    }
    try {
        let blog = await Blogs.findAll({
            where: { slug },
            include: [{ model: Users, as: "user", attributes: ["name", "email", "user_id", "createdAt", "updatedAt"] }]
        });

        if (!blog || blog.length === 0) {
            return res.status(404).json({ message: "Blog post not found !", blog })
        }
        return res.json(blog)
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error Getting the Blog !", error })
    }
}

exports.getBlogsByUser = async (req, res) => {
    const { user_id } = req.user;
    try {
        const blogs = await Blogs.findAll({
            where: { user_id },
            include: [{ model: Users, as: "user", attributes: ['name', 'email'] }]
        });
        if (blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found for this user!" });
        }
        console.log(`\nUser id : ${user_id}\n`);
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error fetching blogs for user: ", error);
        return res.status(500).json({ message: "Error fetching blogs for user!", error });
    }
};

exports.createBlog = async (req, res) => {
    console.log("\n::inside createBlog");
    const user_id_params = req.params.user_id;
    let user_id = req.user.user_id;
    const { title, content, } = req.body;

    if (!title || !content || !user_id || !user_id_params) {
        return res.status(400).json({ message: 'Required fields are missing .' });
    }

    if (!(user_id_params == user_id)) {
        return res.sendStatus(403);
    }

    try {
        const slug = await slugify(title, {
            lower: true,
            strict: true,
            replacement: '_',
            trim: true
        });
        const blog = await Blogs.create({ title, content, user_id, slug });
        res.status(201).json({ message: 'Blog created successfully ', blog });
    } catch (error) {
        console.log("Error Registering the user !" + error);
        return res.status(400).json({ message: "Error registering the user !", error })
    }
}

exports.updateBlog = async (req, res) => {
    const { blog_id } = req.params;
    const { user_id } = req.user;
    const { active, title, content, view } = req.body;

    if (!blog_id || !user_id) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    try {
        const blog = await Blogs.findOne({ where: { blog_id } });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        if (blog.user_id !== user_id) {
            return res.status(403).json({ message: "User is not the author!" });
        }

        const slug = await slugify(title, {
            lower: true,
            strict: true,
            replacement: '_',
            trim: true
        });

        // dynamic update
        const updatedFields = {};
        updatedFields.slug = slug
        if (title) updatedFields.title = title;
        if (content) updatedFields.content = content;
        if (active !== undefined) updatedFields.active = active;
        if (view !== undefined) updatedFields.view = view;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }

        const data = await Blogs.update(updatedFields, { where: { blog_id } });

        if (data[0] === 0) {
            return res.status(400).json({ message: "No changes made or blog not found!" });
        }

        // Fetch and return the updated blog
        const updatedBlog = await Blogs.findOne({ where: { blog_id } });
        return res.status(200).json({ message: "Blog updated successfully!", data: updatedBlog });


        // return res.status(200).json({ message: "Blog updated successfully!", data });

    } catch (error) {
        console.error("Error updating the blog: ", error);
        return res.status(500).json({ message: "Error updating the blog!", error });
    }
};


exports.deleteBlog = async (req, res) => {
    console.log("\n::inside deleteBlog");
    const { blog_id } = req.params;
    const { user_id } = req.user;
    if (!blog_id || !user_id) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    try {
        const blog = await Blogs.findOne({ where: { blog_id } });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        if (blog.user_id !== user_id) {
            console.log("Blog user id" + blog.user_id);
            console.log("user id" + user_id);
            return res.status(403).json({ message: "User is not the author!" });
        }

        const rowsDeleted = await Blogs.destroy({ where: { blog_id } });
        if (rowsDeleted === 0) {
            return res.status(400).json({ message: "No changes made or blog not found!" });
        }
        return res.status(200).json({ message: "Blog Deleted !" });
    } catch (error) {
        console.error("Error updating the blog: ", error);
        return res.status(500).json({ message: "Error updating the blog!", error });
    }

}


