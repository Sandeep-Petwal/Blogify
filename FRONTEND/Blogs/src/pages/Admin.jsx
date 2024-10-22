import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../context/BlogContext';
import { MdOutlineNoEncryptionGmailerrorred } from "react-icons/md";
import { FaHome } from 'react-icons/fa';
import { SlClose } from "react-icons/sl";
import { TiUserDelete } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import SearchBlogs from '../components/SearchBlogs';

// for react modal
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

function Admin() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, logout, verifyUser } = useContext(BlogContext);

    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);

    const [blogs, setBlogs] = useState([]);
    const [blogsCount, setBlogsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogLimit, setBlogLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };



    // react modal 
    const [loading, setLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(0);

    const [userToDelet, setUserToDelete] = useState(0);
    const [userModalOpen, setUserModalOpen] = useState()

    const fetchUsers = async () => {
        console.log("Fetching users !");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/admin/users`, {
                headers: {
                    'token': token,
                }
            });
            // console.table(response.data);
            setUsers(response.data.user);
            setUserCount(response.data.count);

        } catch (error) {
            user.role == "user"
            console.log("Error while fetching the user ", error);
        }
    }

    const fetchBlogs = async () => {
        console.log("Fetching users !");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/blogs?page=${currentPage}&limit=${blogLimit}`, {
                headers: {
                    'token': token,
                }
            });
            // console.table(response.data.blogs);
            setBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
            setBlogsCount(response.data.count);

        } catch (error) {
            console.log("Error while fetching the user ", error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, blogLimit])


    // update the cotext state if token availble
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user.isLoggedIn) {
            console.log("token is availble now calling verifyUser from context");
            verifyUser(token);
        }
    }, [user.isLoggedIn, verifyUser])


    if (!user.role == "admin" || !user.isLoggedIn) {
        return <div className='h-[500px] font-bold text-orange-600 mt-10 flex justify-center items-center flex-col'>
            <MdOutlineNoEncryptionGmailerrorred size={80} />
            <h1>You dont have access to this page !</h1>
            <Link
                to={"/"}
                className=" flex justify-center hover:text-blue-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                aria-current="page"
            >
                <FaHome />
                Home
            </Link>
        </div>
    }


    // handle delete blog
    const handleDeleteBlog = async () => {
        console.log("Deleting the blog -", blogToDelete);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${apiUrl}/admin/blogs/${blogToDelete}`, {
                headers: {
                    'token': token,
                }
            });
            toast.success(response.data.message);
            fetchBlogs();
            setDeleteModalOpen(false);
        } catch (error) {
            console.log("Error while deleting blog ", error);
            toast.error("Error while deleting the blog");
            setDeleteModalOpen(false);
        }
    }

    const handleDeleteUser = async () => {
        console.log("Deleting the user => " + userToDelet)
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${apiUrl}/admin/users/${userToDelet}`, {
                headers: {
                    'token': token,
                }
            });
            toast.success(response.data.message);
            fetchUsers();
            setUserModalOpen(false);

        } catch (error) {
            console.log("Error while deleting user ", error);
            toast.error("Error while deleting the user");
            setUserModalOpen(false);
        }
    }


    return (
        <div className='text-white main mt-10 flex justify-center items-center flex-col gap-10'>
            {(user.role === "user" || user.isLoggedIn === false) &&
                <div className='h-[500px] font-bold text-orange-600 mt-10 flex justify-center items-center flex-col'>
                    <MdOutlineNoEncryptionGmailerrorred size={80} />
                    <h1>You don&apos;t have access to this page!</h1>
                    <Link
                        to={"/"}
                        className="flex justify-center hover:text-blue-500 items-center gap-2 py-2 px-3 text-white rounded md:bg-transparent md:p-0 dark:text-white"
                        aria-current="page"
                    >
                        <FaHome />
                        Home
                    </Link>
                </div>
            }

            {user.role == "admin" && <div className="adminsection">
                <section className='flex justify-center items-center flex-col gap-5'>
                    <RiAdminFill size={150} />
                    <h1 className='text-2xl font-bold text-orange-600'>Admin Dashbord</h1>
                </section>


                {/* search box  */}
                <SearchBlogs />

                {/* Users list  */}
                <div className=" relative overflow-x-auto shadow-md sm:rounded-lg mb-20">
                    <h1 className='font-bold m-3'>Total Users : {userCount - 1}</h1>
                    <table className="overflow-scroll w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    User Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created at
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delete user
                                </th>

                            </tr>
                        </thead>
                        <tbody>

                            {/* iterating the users to table row */}
                            {
                                users.map((e) => {
                                    if (e.user_id == user.user_id) {
                                        return
                                    }
                                    return <tr key={e.user_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{e.user_id}</td>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {e.name}
                                        </th>
                                        <td className="px-6 py-4">{e.email}</td>
                                        <td className="px-6 py-4">
                                            {e.createdAt.split('T')[0]}
                                        </td>
                                        <td
                                            onClick={() => {
                                                setUserModalOpen(true);
                                                setUserToDelete(e.user_id);
                                            }}
                                            className=" w-full h-full cursor-pointer flex justify-center items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition">
                                            <TiUserDelete className="mr-2" />
                                            Delete
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>


                {/* Users list  */}
                <div className=" relative overflow-x-auto shadow-md sm:rounded-lg mb-20">
                    <div className='gap-2 flex justify-center content-center'>
                        <p className='text-white text-lg'>Rows per page:</p>
                        <select
                            value={blogLimit}
                            onChange={(e) => {
                                setBlogLimit(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className='bg-slate-800 w-28 text-white p-1'>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="10">10</option>
                        </select>
                    </div>


                    <h1 className='font-bold m-3'>Total Blogs : {blogsCount}</h1>
                    <table className="overflow-scroll w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created at
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Created by
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delete Blog
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {/* iterating the users to table row */}
                            {
                                blogs && blogs.map((e) => {
                                    return <tr key={Math.random()} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4">{e.blog_id}</td>
                                        <td className="px-6 py-4">{e.title.slice(0, 20)}</td>
                                        <td className="px-6 py-4">{e.createdAt.split('T')[0]}</td>
                                        <td className="px-6 py-4">{e.user.name}</td>
                                        <td
                                            onClick={() => {
                                                setDeleteModalOpen(true);
                                                setBlogToDelete(e.blog_id);
                                            }}
                                            className=" w-full h-full cursor-pointer flex justify-center items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition">
                                            <MdDeleteForever className="mr-2" />
                                            Delete
                                        </td>

                                    </tr>
                                })
                            }
                        </tbody>
                    </table>

                    {/* prev and next btns */}
                    <div className='flex justify-center items-center pb-16 text-white'>
                        <button
                            className={`w-24 flex ${currentPage === 1 && "hidden"} justify-center m-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition`}
                            onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                        <span className='font-bold'>Page {currentPage} of {totalPages}</span>
                        <button
                            className={`w-24 flex ${currentPage === totalPages && "hidden"} justify-center m-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition`}
                            onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>

                </div>



                {/* react modal delete blog*/}
                <div>
                    <Modal
                        isOpen={deleteModalOpen}
                        onRequestClose={() => setDeleteModalOpen(false)}
                        style={customStyles}
                        contentLabel="Example Modal"
                        className={""}
                    >
                        <div className="content  m-1 flex justify-center items-center flex-col">
                            <FaRegTrashAlt className=' h-24 flex justify-center text-red-600 text-4xl' />
                            <div className='mb-3 text-2xl font-bold'>Are you sure</div>
                            <h2>Delete the blog permanently ?</h2>

                            <div className="buttons flex mt-5">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    <SlClose className="mr-2 " />
                                    Cencel
                                </button>
                                <button
                                    onClick={handleDeleteBlog}
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

                {/* react modal delete user*/}
                <div>
                    <Modal
                        isOpen={userModalOpen}
                        onRequestClose={() => setUserModalOpen(false)}
                        style={customStyles}
                        contentLabel="Example Modal"
                        className={""}
                    >
                        <div className="content  m-1 flex justify-center items-center flex-col">
                            <FaRegTrashAlt className=' h-24 flex justify-center text-red-600 text-4xl' />
                            <div className='mb-3 text-2xl font-bold'>Delete user ?</div>
                            <h2>Blogs created by user will be also deleted !</h2>

                            <div className="buttons flex mt-5">
                                <button
                                    onClick={() => setUserModalOpen(false)}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    <SlClose className="mr-2 " />
                                    Cencel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className=" w-24 flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                                    {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                    {!loading && <span className='flex items-center justify-center'>
                                        <TiUserDelete className="mr-2 " />
                                        Delete
                                    </span>}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>

                {/* react hot toast */}
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
            </div>}





        </div>
    )
}

export default Admin
