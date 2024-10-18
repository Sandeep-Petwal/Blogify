/* eslint-disable react-hooks/rules-of-hooks */
import {
    FaEdit, FaHome, FaRegTrashAlt, FaCheck, FaUserPlus
} from 'react-icons/fa';
import { HiOutlineLogin } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { Link, useParams } from 'react-router-dom';
import Notfound from './Notfound';
import { useEffect, useState, useContext } from 'react';
import { BlogContext } from '../context/BlogContext';
import { SlClose } from "react-icons/sl";
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";


const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5) for more visibility
    }, content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'white', // Text color inside the modal
        backgroundColor: '#1f2937', // Background color of the modal
        minWidth: '340px', // Set the width you want
        // height: '400px', // Set the height you want

    },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const Blog = () => {
    const { user, verifyUser } = useContext(BlogContext);
    const [isAuthor, setIsAuthor] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [blog, setBlog] = useState([]);
    const [error, setError] = useState(false);
    const { slug } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [modalIsOpen, setIsOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }



    if (!slug) {
        return <Notfound />;
    }

    useEffect(() => {
        console.log("Token availble not varifyieng ");
        const token = localStorage.getItem("token")
        if (token && !user.isLoggedIn) {
            verifyUser(token);
        }
    }, [])

    const checkAuthor = async () => {
        console.log("Inside checkAuthor ");
        try {
            // console.log("user.user_id = " + user.user_id + " blog.user.user_id " + blog.user.user_iD);
            if (user.user_id == blog.user.user_id) {
                setIsAuthor(true);
            }
        } catch (error) {
            console.log("Updading..." + error);
        }

    }

    // check if user is author
    useEffect(() => {
        checkAuthor();
    }, [user.isLoggedIn, blog, user.user_id])


    // get the blog
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${apiUrl}/blogs/slug/${slug}`);
                if (!res.ok) {
                    setError(true);
                    return;
                }
                const data = await res.json();
                setBlog(data[0]);
                checkAuthor();
                console.table(blog);

                // settting data for edit modal 
                setTitle(data[0].title);
                setContent(data[0].content)
            } catch (err) {
                console.error("Fetch error:", err);
                setError(true);
            }
        };
        fetchBlog();
    }, [apiUrl, slug]);

    if (error) {
        return <Notfound />;
    }
    if (!blog) {
        return <div>Loading...</div>;
    }

    const userName = blog.user ? blog.user.name : "";

    // function to handle delete  operation 
    const handleDelete = async () => {
        if (loading) {
            return
        }
        setLoading(true)


        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            const response = await fetch(`${apiUrl}/blogs/${blog.blog_id}`, {
                method: "DELETE",
                headers: {
                    token
                }
            });
            // const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                closeModal();

                if (response.status == 401) {
                    return toast.error("Unauthorized !");
                }
                return toast.error("Unable to delete !");

            }

            setLoading(false);
            closeModal();
            toast.success("Successfully deleted the blog")
            setTimeout(() => {
                navigate("/profile");
            }, 500);


        } catch (error) {
            setLoading(false);
            closeModal();
            toast.error(error)
        }

    }

    // function handle update operation
    const handleEdit = async (e) => {
        e.preventDefault();
        console.log("Editing the post");
        console.log(title, " ", content);
        if (title == blog.title && content == blog.content) {
            return toast.error("Fields can not be the same !")
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please logIn to add post !");
                return navigate("/login");
            }

            console.log(`${apiUrl}/blogs/${blog.blog_id}`);
            const response = await fetch(`${apiUrl}/blogs/${blog.blog_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });
            const data = await response.json();
            if (!response.ok) {
                return toast.error(`Error while adding the post: ${data.message || data.error || "Unknown error"}`);
            }

            console.table(data);

            // to refresh the blogs
            setEditModalOpen(false);
            toast.success("Successfully updated the blog !");
            console.table(data.data);
            if (data.data.slug) {
                navigate(`/blog/${data.data.slug}`)
            } else {
                navigate("/profile")
            }


        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="container px-7">
            {/* react modal delete */}
            <div>
                <Modal
                    isOpen={editModalOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={() => {
                        setEditModalOpen(false);
                    }}
                    style={customStyles}
                    contentLabel="Example Modal"
                    className={""}
                >
                    <div className="content md:w-[700px]  m-1 flex justify-center items-center flex-col">
                        <CiEdit size={50} className='flex justify-center text-white text-4xl' />
                        <div className='text-2xl mt-2 font-bold'>Edit Post</div>

                        <form onSubmit={handleEdit} className="mt-4 w-full md:w-[600px] max-w-lg">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-title">Title</label>
                                <input
                                    maxLength={155}
                                    type="text"
                                    id="edit-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full h-14 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-content">Content</label>
                                <textarea
                                    id="edit-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={10}
                                    maxLength={10000}
                                    className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500 resize-none" // Prevent resizing
                                ></textarea>
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

                            <div className="buttons flex justify-center mt-8 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition">
                                    {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                    {!loading && (
                                        <span className='flex items-center justify-center'>
                                            <FaCheck className="mr-2" />
                                            Edit
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>


                    </div>

                </Modal>
            </div>





            {/* react modal delete */}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    className={""}
                >
                    <div className="content  m-1 flex justify-center items-center flex-col">
                        <FaRegTrashAlt className=' h-24 flex justify-center text-red-600 text-4xl' />
                        <div className='text-3xl font-bold'>Are you sure ?</div>

                        <div className="buttons flex mt-5">
                            <button
                                onClick={closeModal}
                                className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                <SlClose className="mr-2 " />
                                Cencel
                            </button>
                            <button
                                onClick={handleDelete}
                                className=" w-24 flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                                {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                {!loading && <span className='flex items-center justify-center'>
                                    <FaRegTrashAlt className="mr-2 " />
                                    Delete
                                </span>}
                            </button>
                        </div>
                    </div>

                </Modal>
            </div>



            <div style={{ maxWidth: "700px", marginTop: "50px" }} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
                <div className="flex items-center mb-4">
                    {/* <div className="bg-gray-600 rounded-full p-6 w-12 h-12 flex items-center justify-center text-2xl font-bold">
                        {firstCharacter}
                    </div> */}

                    <img src={`${baseUrl}/${blog.user?.profile_picture}`}
                        className="rounded-full w-12 h-12 "
                        alt="profile" />
                    <div className="ml-4">
                        <div className="font-bold">{userName}</div>
                        <div className="text-gray-400 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
                <p className="font-serif">{blog.content}</p>
            </div>

            {/* Button Group for Login/Signup */}
            {!user.isLoggedIn && <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                <Link to={"/login"}>
                    <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        <HiOutlineLogin className="mr-2" />
                        Login
                    </button>
                </Link>
                <Link to={"/signup"}>
                    <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        <FaUserPlus className="mr-2" />
                        Signup
                    </button>
                </Link>
            </div>}

            {/* Button Group for Logged-in Users */}
            <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">

                {/* if user is author  */}
                {isAuthor &&
                    <div className='flex'>
                        <button
                            onClick={() => {
                                setEditModalOpen(true)
                            }}
                            className="w-40 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <FaEdit className="mr-2" />
                            Edit Post
                        </button>
                        <button
                            onClick={openModal}
                            className="w-40 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <FaRegTrashAlt className="mr-2" />
                            Delete
                        </button>
                    </div>
                }



                {/* {user.isLoggedIn && <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>} */}

                <Link to={"/"}>
                    <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        <FaHome className="mr-2" />
                        Home
                    </button>
                </Link>
            </div>

            {/* react hot toast */}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
};

export default Blog;