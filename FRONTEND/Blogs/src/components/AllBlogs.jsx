/* eslint-disable react/prop-types */
import { MdPublic } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaRegUser, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function AllBlogs({ blogs, heading, author }) {
    // console.table(blogs);
    return (
        <div className="bg-gray-900 text-gray-100 p-4 mb-10">
            <h1 className="text-3xl font-bold mb-4 text-center font-serif text-orange-600 underline underline-offset-2">{heading}</h1>
            <div className="flex flex-wrap justify-center mb-8">
                {blogs.map((blog) => (
                    <div
                        // to={`/blog/${blog.slug}`}
                        key={blog.blog_id}
                        className="bg-gray-800 min-w-60 p-4 rounded shadow-md hover:shadow-lg  hover:bg-slate-700 hover:border transition duration-300 w-full sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 mx-2 mb-4" // Added mx-2 for horizontal spacing
                    >
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">
                                {
                                    blog.active
                                        ? <p className="flex gap-5 text-lg text-green-500 font-bold items-center"><MdPublic /> Public</p>
                                        : <p className="flex gap-5 text-lg text-red-500 font-bold items-center"><CiLock /> Private</p>
                                }
                                {blog.title.substring(0, 40)}{blog.title.length > 50 && "...."}</h2>
                        </div>

                        {!author && <p className="text-lg mb-2 flex flex-row gap-3 underline hover:text-orange-600 content-center p-1">
                            <FaRegUser />
                            <Link to={`profile/${blog.user_id}`}>
                                {blog.user.name}
                            </Link>
                        </p>}
                        <p className="text-gray-300 flex flex-row gap-3 content-center p-1">
                            <FaCalendarAlt />
                            {blog.createdAt.substring(0, 10)}
                        </p>
                        <div className="mt-4 ">
                            <Link
                                to={`/blog/${blog.slug}`}
                                // href={`/blog/${blog.slug}`}
                                className="bg-orange-600 flex -1 justify-center items-center gap-1 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                                Read More
                                <HiOutlineExternalLink size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllBlogs;
