import toast, { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../context/BlogContext';
import AllBlogs from './AllBlogs';
import { FaPlus, FaPaperPlane } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

function UsersBlogs() {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(true);

    const navigate = useNavigate();  // Use navigate to redirect

    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, logout } = useContext(BlogContext);
    const [userBlogs, setUserBlogs] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const showToast = (slug) => {
        return toast((t) => (
            <span className='font-bold'>
                ✅  Blog post added successfully !
                <br />
                <span className='flex justify-center items-center gap-4 mt-4'>
                    <button
                        className="w-20 flex justify-center items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition"
                        onClick={() => {
                            navigate(`/blog/${slug}`)
                        }}>
                        View
                    </button>
                    <button
                        className="w-20 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                        onClick={() => toast.dismiss(t.id)}>
                        Dismiss
                    </button>
                </span>
            </span>
        ), {
            duration: 2000,
        });
    }

    const onSubmit = async (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        console.log({ title: data.title, content: data.content, isPublic });

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to add post!");
                return navigate("/login");
            }

            const response = await fetch(`${apiUrl}/blogs/${user.user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify({
                    title: data.title,
                    content: data.content,
                    isPublic
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return toast.error(`Error while adding the post: ${errorData.message || "Unknown error"}`);
            }
            const result = await response.json();
            console.table(result);

            reset();
            
            // to refresh the blogs
            user.temp = Date.now();
            showToast(result.blog.slug);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getUsersBlogs = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return logout();
            }

            let response = await fetch(`${apiUrl}/userblogs`, {
                headers: {
                    token
                }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    console.log("Error while fetching the user's post!");
                }
            }
            const data = await response.json();
            setUserBlogs(data);
        } catch (error) {
            console.log("Error while fetching user's blog posts." + error);
        }
    };

    // get user's blogs
    useEffect(() => {
        if (user.isLoggedIn) {
            getUsersBlogs();
        }
    }, [user.isLoggedIn, user.temp]);

    return (
        <div className='text-white'>
            {/* create post section  */}
            <div className="max-w-2xl min-w-96 mx-auto p-6">
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`flex items-center justify-center w-28 h-28 ${!isOpen ? "bg-blue-600 hover:bg-blue-500" : " bg-orange-500 hover:bg-orange-600"} text-white rounded-full shadow-lg transition-all duration-300  focus:outline-none`}
                    >
                        {!isOpen && <FaPlus size={32} />}
                        {isOpen && <IoCloseSharp size={32} />}
                    </button>
                    <span className="mt-2 text-white">Create Post</span>
                </div>

                <div className={`mt-4 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 lg:w-[600px] p-6 rounded-lg shadow-md mt-2 max-w-4xl">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-white mb-1" htmlFor="title">Post Title</label>
                            <input
                                type="text"
                                id="title"
                                {...register("title", { required: "Title is required", minLength: { value: 5, message: "Title must be at least 5 characters long !" } })}
                                className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500`}
                            />
                            {errors.title && <p className="text-red-500 mt-3 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-white mb-1" htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                {...register("content", { required: "Content is required", minLength: { value: 25, message: "Content must be at least 25 characters long !" } })}
                                className={`w-full p-2 border ${errors.content ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500`}
                            ></textarea>
                            {errors.content && <p className="text-red-500 text-sm mt-3">{errors.content.message}</p>}
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2 text-sm font-semibold text-white">Visibility:</label>
                            <button
                                type="button"
                                onClick={() => setIsPublic((prev) => !prev)}
                                className={`py-1 px-4 rounded-lg text-white transition duration-300 ${isPublic ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {isPublic ? 'Public' : 'Private'}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-orange-600 text-white py-2 rounded-lg transition-all duration-300 hover:bg-orange-500"
                        >
                            {loading ? <img src="./Loading.gif" alt="loading" className='size-5 mr-2' /> : <FaPaperPlane className="mr-2" />}
                            Publish
                        </button>
                    </form>
                </div>
            </div>

            <div className="blogs">
                {userBlogs.length > 0 && <section className='text-white mt-12'>
                    <AllBlogs blogs={userBlogs} author={true} heading={"Your Blogs"} />
                </section>}
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default UsersBlogs;
