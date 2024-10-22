const slugify = require('slugify');
const { Op } = require('sequelize');
const { Users, Blogs } = require("../models")
const validate = require('../middleware/validators');
const response = require("../util/response.js")


exports.searchBlogs = async (req, res) => {
    const { search_input } = req.params;
    const rules = {
        search_input: "required|string"
    };

    let { status, message } = await validate({ search_input }, rules);
    if (!status) {
        return response.failed(res, message)
    }

    try {
        const blogs = await Blogs.findAll({
            where: {
                title: {
                    [Op.like]: `%${search_input}%`
                },
                active: true
            },
            limit: 5,
            order: [
                ['blog_id', 'DESC'],
            ],

        });

        if (blogs && blogs.length > 0) {
            res.json(blogs);
        } else {
            return response.failed(res, "No blogs found");
        }

    } catch (error) {
        console.log(error);
        return response.serverError(res, "Error fetching blogs")
    }

}

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.findAll(
            {
                include: [{ model: Users, as: "user", attributes: ['name', 'email'] }]
            }
        );
        if (blogs.length == 0) {
            return response.noContent(res)
        }
        res.json(blogs);
    } catch (error) {
        console.error(error);
        return response.failed(res, "Error while fetching all blogs");
    }
};

// paginate blogs
exports.getPublicBlogs = async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // default page =  1 ,  limit = 10
    limit = Math.min(limit, 20);             // maximum 20 


    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await Blogs.findAndCountAll({
            where: {
                active: true
            },
            order: [
                ['blog_id', 'DESC'], //descending order
            ],

            include: [{ model: Users, as: "user", attributes: ['name', 'email'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalPages = Math.ceil(count / limit);

        if (rows.length === 0) {
            return response.noContent(res, "No blogs found !")
        }

        res.json({
            blogs: rows,
            count,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error(error);
        return response.serverError(res, "Error fetching blogs")
    }
};


exports.getBlogBySlug = async (req, res) => {
    const { slug } = req.params;
    if (!slug) {
        res.status(400).json({ message: "slug required !" })
    }
    try {
        let blog = await Blogs.findAll({
            where: { slug },
            include: [{ model: Users, as: "user", attributes: ["name", "email", "user_id", "createdAt", "updatedAt", "profile_picture"] }]
        });

        if (!blog || blog.length === 0) {
            return response.failed(res, "Blog post not found !");
        }
        return res.json(blog)
    } catch (error) {
        console.error(error);
        return response.serverError(res, "Error fetching blog")
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
            return response.notFound(res, "No blogs found for the user");
        }
        res.json(blogs);
    } catch (error) {
        console.error("Error fetching blogs for user: ", error);
        return response.serverError(res, "Error fetching blogs for user")
    }
};

// get users public profile 
exports.getPublicProfile = async (req, res) => {
    const { user_id } = req.params;

    const rules = {
        user_id: "required|numeric|exist:users,user_id",
    };
    let { status, message } = await validate({ user_id }, rules);
    if (!status) {
        return response.failed(res, "User not found  !", message)
    }
    try {
        const profile = await Users.findOne({
            where: { user_id },
            attributes: { exclude: ['password', 'otp', "role"] },
        });
        if (!profile) {
            return response.notFound(res, "User does not found !")
        }
        return response.success(res, "Success", profile);
    } catch (error) {
        console.log("Error Getting users profile: " + error);
        return response.serverError(res);
    }
}

// users public blogs
exports.getUsersPublicBlog = async (req, res) => {
    const { user_id } = req.params;
    let { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const rules = {
        user_id: "required|numeric|exist:users,user_id",
        page: "numeric|min:1",
        limit: "numeric|min:1|max:20"
    };
    let { status, message } = await validate({ user_id, page, limit }, rules);
    if (!status) {
        return response.failed(res, "Can not get the users blogs !", message)
    }

    // return users profile and blogs
    try {
        const blogs = await Blogs.findAll({
            where: { user_id },
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        if (!blogs) {
            return response.notFound(res, "No blogs found !")
        }
        return response.success(res, "Success", blogs);
    } catch (error) {
        console.log("Error Getting users profile: " + error);
        return response.serverError(res);
    }
}

















exports.createBlog = async (req, res) => {
    const user_id_params = req.params.user_id;
    let user_id = req.user.user_id;
    const { title, content, } = req.body;

    const rules = {
        title: 'required|max:100|min:5|unique:blogs,title',
        content: 'required|min:5',
        user_id: "required|numeric|exist:users,user_id",
        user_id_params: "required|numeric"
    };

    let { status, message } = await validate({ title, content, user_id, user_id_params }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        const slug = await slugify(title, {
            lower: true,
            strict: true,
            replacement: '_',
            trim: true
        });
        const blog = await Blogs.create({ title, content, user_id, slug });
        res.json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.log("Error registering the blog: " + error);
        return response.serverError(res);
    }
};

exports.updateBlog = async (req, res) => {
    const { blog_id } = req.params;
    const { user_id } = req.user;
    const { active, title, content, view } = req.body;

    console.log("\n::inside updateBlog , active : \n", active);
    const rules = {
        blog_id: "required|numeric|exist:blogs,blog_id",
        user_id: "required|numeric|exist:users,user_id",
        title: 'max:100|min:5',
        content: 'min:5',
    }

    let { status, message } = await validate({ blog_id, user_id, title, content }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }


    try {
        const blog = await Blogs.findOne({ where: { blog_id } });
        if (!blog) {
            return response.notFound(res, "Blog not found");
        }

        if (blog.user_id !== user_id) {
            return response.unauthorized(res, "User is not Author")
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
            return response.failed(res, "No fields provided for update.");
        }

        const data = await Blogs.update(updatedFields, { where: { blog_id } });

        if (data[0] === 0) {
            return response.failed(res, "No changes made or blog not found!",)
        }

        const updatedBlog = await Blogs.findOne({ where: { blog_id } });
        return response.success(res, "Blog updated successfully !", updatedBlog)
    } catch (error) {
        console.error("Error updating the blog: ", error);
        return response.serverError(res);
    }
};


exports.deleteBlog = async (req, res) => {
    console.log("\n::inside deleteBlog");
    const { blog_id } = req.params;
    const { user_id } = req.user;

    const rules = {
        blog_id: "required|numeric",
        user_id: "required",
    }

    let { status, message } = await validate({ blog_id, user_id }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        const blog = await Blogs.findOne({ where: { blog_id } });
        if (!blog) {
            return response.notFound(res, "No blog found");

        }

        if (blog.user_id !== user_id) {
            console.log("Blog user id" + blog.user_id);
            console.log("user id" + user_id);
            return response.unauthorized(res, "User is not author !")
        }

        const rowsDeleted = await Blogs.destroy({ where: { blog_id } });
        if (rowsDeleted === 0) {
            return response.notFound(res, "No blogs found");
        }
        return res.json({ message: "Blog Deleted !" });
    } catch (error) {
        console.error("Error updating the blog: ", error);
        return response.serverError(res);
    }

}
