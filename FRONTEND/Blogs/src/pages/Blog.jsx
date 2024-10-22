/* eslint-disable react-hooks/rules-of-hooks */
import {
    FaEdit, FaHome, FaRegTrashAlt, FaCheck, FaUserPlus
} from 'react-icons/fa';
import { LuShare } from "react-icons/lu";
import { MdPublic } from "react-icons/md";
import { HiOutlineLogin } from "react-icons/hi";
import { CiEdit, CiLock } from "react-icons/ci";
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
        // width: '400px'

    },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const Blog = () => {
    const { slug } = useParams();
    const { user, verifyUser } = useContext(BlogContext);
    const [isAuthor, setIsAuthor] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const copy_url = import.meta.env.VITE_HOST_URL + `blog/${slug}` || `http://127.0.0.1:5173/blog/${slug}`
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [blog, setBlog] = useState([]);
    const [error, setError] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [modalIsOpen, setIsOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    //share model
    const [shareModelOpen, setShareModelOpen] = useState(false);
    function openShareModel() {
        setShareModelOpen(true);
    }
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copy_url);
            toast.success("Copied to clipboard");
            closeModal();
        } catch (err) {
            toast.error(err)
        }
    };



    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
        setShareModelOpen(false)
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
                // console.table(blog);

                // settting data for edit modal 
                setTitle(data[0].title);
                setContent(data[0].content)
                setIsPublic(data[0].active)

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
        if (loading) {
            return
        }
        e.preventDefault();
        console.log("Editing the post");
        console.log(title, " ", content);
        if (title == blog.title && content == blog.content && isPublic == blog.active) {
            return toast.error("Fields can not be the same !")
        }


        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please logIn to add post !");
                return navigate("/login");
            }

            setLoading(true);
            console.log(`${apiUrl}/blogs/${blog.blog_id}`);
            const response = await fetch(`${apiUrl}/blogs/${blog.blog_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify({ title, content, active : isPublic })
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container px-7">

            {/* pop up models  */}
            <div className="models">
                {/* react modal edit */}
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

                {/* react modal share */}
                <div>
                    <Modal
                        isOpen={shareModelOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                        className={""}
                    >
                        <div className="flex items-center pb-3 border-b border-gray-300">
                            <h3 className="text-xl font-bold flex-1 text-white">Share Blog</h3>
                            <svg
                                onClick={closeModal}
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
                                viewBox="0 0 320.591 320.591"
                            >
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"
                                />
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"
                                />
                            </svg>
                        </div>
                        <div className="my-8">
                            <h6 className="text-base text-white">Share this link via</h6>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
                                >
                                    <svg
                                        onClick={() => {
                                            window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${copy_url}`
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        fill="#fff"
                                        viewBox="0 0 155.139 155.139"
                                    >
                                        <path
                                            d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"
                                            data-original="#010002"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#03a9f4] hover:bg-[#03a1f4] active:bg-[#03a9f4]"
                                >
                                    <svg
                                        onClick={() => {
                                            window.open(`https://twitter.com/intent/tweet?url=${copy_url}`, '_blank', 'noopener, noreferrer');
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        fill="#fff"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            d="M512 97.248c-19.04 8.352-39.328 13.888-60.48 16.576 21.76-12.992 38.368-33.408 46.176-58.016-20.288 12.096-42.688 20.64-66.56 25.408C411.872 60.704 384.416 48 354.464 48c-58.112 0-104.896 47.168-104.896 104.992 0 8.32.704 16.32 2.432 23.936-87.264-4.256-164.48-46.08-216.352-109.792-9.056 15.712-14.368 33.696-14.368 53.056 0 36.352 18.72 68.576 46.624 87.232-16.864-.32-33.408-5.216-47.424-12.928v1.152c0 51.008 36.384 93.376 84.096 103.136-8.544 2.336-17.856 3.456-27.52 3.456-6.72 0-13.504-.384-19.872-1.792 13.6 41.568 52.192 72.128 98.08 73.12-35.712 27.936-81.056 44.768-130.144 44.768-8.608 0-16.864-.384-25.12-1.44C46.496 446.88 101.6 464 161.024 464c193.152 0 298.752-160 298.752-298.688 0-4.64-.16-9.12-.384-13.568 20.832-14.784 38.336-33.248 52.608-54.496z"
                                            data-original="#03a9f4"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#0077b5] hover:bg-[#0055b5] active:bg-[#0077b5]"
                                >
                                    <svg
                                        onClick={() => {
                                            window.open(`https://twitter.com/intent/tweet?url=${copy_url}`, '_blank', 'noopener, noreferrer');
                                        }}

                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        fill="#fff"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M23.994 24v-.001H24v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07V7.976H8.489v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243V24zM.396 7.977h4.976V24H.396zM2.882 0C1.291 0 0 1.291 0 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909A2.884 2.884 0 0 0 2.882 0z"
                                            data-original="#0077b5"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center rounded-full border-none outline-none bg-[#ea0065] hover:bg-[#ea0065d6] active:bg-[#ea0065]"
                                >
                                    <svg
                                        onClick={() => {
                                            window.open(`https://twitter.com/intent/tweet?url=${copy_url}`, '_blank', 'noopener, noreferrer');
                                        }}

                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        fill="#fff"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            d="M301 256c0 24.852-20.148 45-45 45s-45-20.148-45-45 20.148-45 45-45 45 20.148 45 45zm0 0"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M332 120H180c-33.086 0-60 26.914-60 60v152c0 33.086 26.914 60 60 60h152c33.086 0 60-26.914 60-60V180c0-33.086-26.914-60-60-60zm-76 211c-41.355 0-75-33.645-75-75s33.645-75 75-75 75 33.645 75 75-33.645 75-75 75zm86-146c-8.285 0-15-6.715-15-15s6.715-15 15-15 15 6.715 15 15-6.715 15-15 15zm0 0"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M377 0H135C60.562 0 0 60.563 0 135v242c0 74.438 60.563 135 135 135h242c74.438 0 135-60.563 135-135V135C512 60.562 451.437 0 377 0zm45 332c0 49.625-40.375 90-90 90H180c-49.625 0-90-40.375-90-90V180c0-49.625 40.375-90 90-90h152c49.625 0 90 40.375 90 90zm0 0"
                                            data-original="#000000"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div>
                            <h6 className="text-base text-white">Or copy link</h6>
                            <div className="w-full rounded-lg overflow-hidden border border-gray-300 flex items-center mt-4">
                                <p className="text-sm text-gray-200 flex-1 ml-4">
                                    {/* {import.meta.env.VITE_HOST_URL} */}
                                    {`blog/${slug.slice(0, 24)}`}
                                </p>
                                <button
                                    onClick={handleCopy}
                                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm text-white">
                                    Copy
                                </button>
                            </div>
                        </div>

                    </Modal>
                </div>
            </div>


            <div style={{ maxWidth: "700px", marginTop: "50px" }} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
                <div className='flex justify-between '>
                    <div className="flex items-center mb-4">

                        <img src={`${baseUrl}/${blog.user?.profile_picture}`}
                            className="rounded-full w-12 h-12 "
                            alt="profile" />
                        <div className="ml-4">
                            <div className="font-bold">{userName}</div>
                            <div className="text-gray-400 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</div>
                        </div>

                    </div>
                    <LuShare onClick={openShareModel} size={30} className='text-orange-600 hover:text-orange-700' />
                </div>


                <h1 className="text-2xl flex gap-3     font-bold mb-2">
                    {blog.active 
                    ? <MdPublic className='inline-block text-green-500'/> 
                    : <CiLock className='text-red-600'/>}
                    {blog.title}</h1>
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