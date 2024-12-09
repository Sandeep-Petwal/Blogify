import toast, { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../context/BlogContext';
import AllBlogs from './AllBlogs';
import { FaPlus, FaPaperPlane } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


function UsersBlogs() {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const navigate = useNavigate();  // Use navigate to redirect


    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, login, logout, updatedUser, updateTheUser, verifyUser } = useContext(BlogContext);
    const [userBlogs, setUserBlogs] = useState([]);



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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) {
            return
        }
        setLoading(true);
        //  showToast("abkk");

        if (!title || !content) {
            alert('Title and Content are required!');
            return;
        }
        // Handle the form submission logic here
        console.log({ title, content, isPublic });
        console.log(user.user_id);


        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please logIn to add post !");
                return navigate("/login");
            }

            const response = await fetch(`${apiUrl}/blogs/${user.user_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });

            if (!response.ok) {
                const errorData = await response.json(); // Optionally parse error response
                return toast.error(`Error while adding the post: ${errorData.message || "Unknown error"}`);
            }
            const data = await response.json();
            console.table(data);

            // to refresh the blogs
            user.temp = Date.now();
            showToast(data.blog.slug);
            // Reset the form
            setTitle('');
            setContent('');
            setIsOpen(false);

        } catch (error) {
            toast.error(error);
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
            })
            if (!response.ok) {
                if (response.status == 404) {
                    // toast.error("You dont have any posts !")
                    return console.log(" Error while fetching the user's post !");

                }
                toast.error("Error Loading the users posts !")
                return console.log(" Error while fetching the user's post !");
            }
            const data = await response.json();
            setUserBlogs(data);
        } catch (error) {
            console.log("Error white fetching user's blog posts." + error);
        }
    }

    // get users blogs
    useEffect(() => {
        if (user.isLoggedIn) {
            getUsersBlogs();
        }
    }, [user.isLoggedIn, user.temp])


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

                <div
                    className={`mt-4 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                >
                    <form onSubmit={handleSubmit} className="bg-gray-800 lg:w-[600px] p-6 rounded-lg shadow-md mt-2 max-w-4xl">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-white mb-1" htmlFor="title">Post Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={155}
                                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-white mb-1" htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                maxLength={10000}
                                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                required
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

export default UsersBlogs











import { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../context/BlogContext';
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEdit } from 'react-icons/fa';
import { FaCheck } from "react-icons/fa";
import { LuFileWarning } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { FaUserPlus } from "react-icons/fa6";
import { HiOutlineLogin } from "react-icons/hi";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import UsersBlogs from "../components/UsersBlogs"
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

function Profile() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, verifyUser } = useContext(BlogContext);

    // update the cotext state if token availble
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user.isLoggedIn) {
            console.log("token is availble now calling verifyUser from context");
            verifyUser(token);
        }
        setName(user.name);
        setEmail(user.email);
        setBio(user.bio);
    }, [user.temp])


    // change password section
    const [loading, setLoading] = useState(false);
    const [passwrordModelOpen, setPasswordModelOpen] = useState(false);
    const [emailToUpdate, setEmailToUpdate] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState(0);
    const [step, setStep] = useState(1);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);



    // function to hanndle password change
    const handlePasswordChange = async (e) => {
        console.log("Email : ", email + " Current pass : " + currentPassword + " new pass : " + newPassword);
        e.preventDefault();
        if (loading) {
            return
        }
        try {
            await axios.post(`${apiUrl}/verify/changepassword`, {
                email,
                currentPassword
            });

            toast.success("OTP sent to your email");
            setStep(2);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error processing !";
            toast.error(errorMessage);
            console.log("Error while fetching the user:", error);
        } finally {
            setLoading(false);
        }
    }

    const removeStateValues = () => {
        setEmail("");
        setEmailToUpdate("");
        setCurrentPassword("");
        setNewPassword("");
        setOtp("");
    }

    const handleSubmitOtp = async (e) => {
        console.log("OTP : " + otp);
        e.preventDefault();
        if (loading) {
            return
        }
        try {
            await axios.post(`${apiUrl}/verify/verifychangepassword`, {
                email,
                newPassword,
                otp
            });

            toast.success("Successfully changed the password !");
            setPasswordModelOpen(false);
            removeStateValues();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error processing email!";
            toast.error(errorMessage);
            console.log("Error while confirming otp:", error);
        } finally {
            setLoading(false);
            setStep(1);

        }
    }

    // image upload
    const [file, setFile] = useState(null);
    const profile_image_url = user.profile_picture ? `${baseUrl}/${user.profile_picture}` : `./avatar.png`;

    const [previewUrl, setPreviewUrl] = useState("");
    const [fileDetails, setFileDetails] = useState({});
    const [fileErrorMsg, setFileErrorMsg] = useState("");


    useEffect(() => {
        setPreviewUrl(user.profile_picture ? `${baseUrl}/${user.profile_picture}` : `./avatar.png`)
    }, [baseUrl, user.profile_picture])

    // function to hadle edit profile 
    const handleEdit = async (e) => {
        e.preventDefault();
        console.log("Editing the profile ! " + name + " " + email + " " + bio);

        if (name === user.name && email === user.email && bio === user.bio && file == null) {
            return toast.error("Fields should not be the same !");
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in to add post !");
                return navigate("/login");
            }

            // Create a FormData object to hold the file data and other fields
            const formData = new FormData();
            // add image if it is a valid file
            if (file && !(file.size > 1000000) && file.type.startsWith('image/')) {
                formData.append('profile_pic', file); // Append the file to FormData
            }
            formData.append('name', name);
            formData.append('email', email);
            formData.append('bio', bio);

            console.log(`${apiUrl}/user/${user.user_id}`);
            const response = await axios.put(`${apiUrl}/user/${user.user_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                    "token": token
                }
            });


            toast.success("Successfully updated the profile");
            setEditModalIsOpen(false);
            user.name = name;
            user.email = email;
            user.bio = bio;

            if (file !== null) {
                user.profile_picture = response.data.profile_picture;
            }
            setFile(null);

        } catch (error) {
            // Handle error based on Axios response structure
            const errorMessage = error.response?.data.message || error.message || "Unknown error";
            toast.error(errorMessage);
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; //  first file
        setFile(selectedFile);
        if (selectedFile) {
            setFileDetails({
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
            });

            if (selectedFile.size > 1000000 || !selectedFile.type.startsWith('image/')) {
                setFile(null);
                setFileErrorMsg("File size must me less then 1Mb and should be an image !")
                return toast.error("Please select a valid file !");
            }
            const objectUrl = URL.createObjectURL(selectedFile);

            const img = new Image();
            img.src = objectUrl;
            img.onload = () => {
                const { width, height } = img;
                console.log(`Image dimensions: ${width}x${height}`);
                if (width !== height) {
                    setFileErrorMsg("Image does not have a 1:1 aspect ratio");
                    return
                }
            };

            setFileErrorMsg("");
            setPreviewUrl(objectUrl);

        }
    };



    return (
        <div>
            <div className="main flex flex-col justify-center items-center">
                {/* edit profile modal  */}
                <div>
                    <Modal
                        isOpen={editModalIsOpen}
                        // onAfterOpen={afterOpenModal}
                        onRequestClose={() => {
                            setEditModalIsOpen(false);
                        }}
                        style={customStyles}
                        contentLabel="Example Modal"
                        className={""}
                    >
                        <div className="content md:w-[700px]  m-1 flex justify-center items-center flex-col">
                            {/* <FaUserEdit size={50} className='flex justify-center text-white text-4xl' />
                            <div className='text-2xl mt-2 font-bold text-orange-600'>Edit Profile</div> */}

                            <form onSubmit={handleEdit} className="mt-4 w-full md:w-[600px] max-w-lg">
                                {/* upload image  */}

                                <div className="flex items-center flex-col space-x-6 mb-4 ">
                                    <div className="shrink-0">
                                        <img
                                            id="preview_img"
                                            className="h-28 mb-4 w-28 object-cover rounded-full border"
                                            // src={user.profile_picture ? `${baseUrl}/${user.profile_picture}` : `./avatar.png`}
                                            src={previewUrl}
                                            alt="Current profile photo"
                                        />
                                    </div>
                                    <label className="block">
                                        <span className="sr-only">Choose profile photo</span>
                                        <input
                                            accept="image/*" onChange={handleFileChange}
                                            type="file"
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        />

                                        {file &&
                                            <div className='mt-2 text-center'>
                                                <p>{(fileDetails.size / 1024 / 1024).toFixed(2)} Mb
                                                    <span> ({fileDetails.type})</span></p>
                                                {/* {fileDetails.size > 1000000 && <p className='text-center text-yellow-400'>Max Size : 1Mb</p>}
                                                {!fileDetails.type.startsWith('image/') && <p className='text-center text-yellow-400'>Only images are allowed !</p>} */}
                                            </div>
                                        }
                                        <p className='text-center text-yellow-400 mt-3 font-bold flex justify-center items-center flex-col' >
                                            {fileErrorMsg.trim() !== "" && <LuFileWarning size={50} />}
                                            {fileErrorMsg}</p>
                                    </label>
                                </div>



                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-Name">Name</label>
                                    <input
                                        maxLength={20}
                                        type="text"
                                        id="edit-Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-email">Email</label>
                                    <input
                                        maxLength={30}
                                        type="email"
                                        id="edit-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="bio">Bio</label>
                                    <input
                                        maxLength={30}
                                        type="text"
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>



                                <div className="buttons flex justify-center mt-8 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditModalIsOpen(false)}
                                        className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
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



                {/* change password modal  */}
                <div>
                    <Modal
                        isOpen={passwrordModelOpen}
                        // onAfterOpen={afterOpenModal};
                        onRequestClose={() => {
                            setPasswordModelOpen(false);
                        }}
                        style={customStyles}
                        contentLabel="Password Modal"
                        className={""}
                    >

                        {/* step 1  */}
                        {step == 1 && <div className="content md:w-[700px]  m-1 flex justify-center items-center flex-col">
                            <RiLockPasswordFill size={50} className='flex justify-center text-white text-4xl' />
                            <div className='text-2xl mt-2 font-bold text-orange-600'>Change Password</div>

                            <form onSubmit={handlePasswordChange} className="mt-4 w-full md:w-[600px] max-w-lg">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-email">Email</label>
                                    <input
                                        maxLength={30}
                                        type="email"
                                        id="edit-email"
                                        value={emailToUpdate}
                                        onChange={(e) => setEmailToUpdate(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="currentpass">Current Password</label>
                                    <input
                                        maxLength={30}
                                        type="password"
                                        id="currentpass"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="newpass">New Password</label>
                                    <input
                                        maxLength={30}
                                        type="password"
                                        id="newpass"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>


                                <div className="buttons flex justify-center mt-8 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setPasswordModelOpen(false)}
                                        className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className=" flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                                        {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                        {!loading && (
                                            <span className='flex items-center justify-center'>
                                                {loading && <img src="/Loading.gif" alt="Loading" className="h-5" />}
                                                {!loading && "Send OTP"}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>}


                        {/* step 2  */}
                        {step == 2 && <div className="content md:w-[700px]  m-1 flex justify-center items-center flex-col">
                            <RiLockPasswordFill size={50} className='flex justify-center text-white text-4xl' />
                            <div className='text-2xl mt-2 font-bold'>Change Password</div>

                            <form onSubmit={handleSubmitOtp} className="mt-4 w-full md:w-[600px] max-w-lg">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-white mb-1" htmlFor="otp">OTP</label>
                                    <input
                                        maxLength={30}
                                        type="number"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="XXXXXX"
                                        max={999999}
                                        min={99}
                                        required
                                        className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                    />
                                </div>
                                <div className="buttons flex justify-center mt-8 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className=" flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                        Go Back
                                    </button>
                                    <button
                                        type='submit'
                                        className=" flex justify-center ml-4 items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                                        {loading && <img src="/Loading.gif" alt="Loading" className='w-4' />}
                                        {!loading && (
                                            <span className='flex items-center justify-center'>
                                                Confirm
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>}





                    </Modal>
                </div>

                {/* if not logged in show login and signup  */}
                {!user.isLoggedIn && <div > <h1 className='text-white p-4 text-2xl mt-60 font-extrabold'>
                    Please log in first to view your profile !
                </h1>
                    <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
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
                    </div>

                </div>
                }

                {/* if logged in show profile  */}
                {user.isLoggedIn && <div className="mt-36 mx-4 flex flex-col items-center p-8 bg-gray-800 text-white shadow-md rounded-lg w-fit">


                    {/* {!user.profile_picture && <div className="flex items-center justify-center w-24 h-24 bg-orange-600 text-white text-5xl font-bold rounded-full">
                        {user.name.charAt(0)}
                    </div>} */}

                    <div className="shrink-0">
                        <img
                            id="profile_img"
                            className="h-28 mb-4 w-28 object-cover rounded-full border"
                            src={profile_image_url}
                            alt={profile_image_url}
                        />
                    </div>


                    <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                    <p className="mt-2 text-gray-200">{user.email}</p>
                    <p className="mt-2 text-gray-200">{user.bio}</p>

                    {/* Button Group */}
                    <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                        <button
                            onClick={() => {
                                setEditModalIsOpen(true);
                            }}
                            className="w-40 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <FaEdit className="mr-2" />
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setPasswordModelOpen(true)}
                            className=" flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <RiLockPasswordFill className="mr-2" />
                            Change Password
                        </button>
                        {/* <Link to={"/"}>
                            <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                <FaHome className="mr-2" />
                                Home
                            </button>
                        </Link> */}
                    </div>
                </div>}

                {user.isLoggedIn && <UsersBlogs />}
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default Profile


//  ______________________________________________________________________________________________
// Follow syste m 
{user.isLoggedIn && <div className="mt-4 flex justify-center items-center flex-col gap-2 space-x-4">
<button
    className=" flex justify-center gap-3 items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition">
    <FaUserPlus />
    Follow
</button>
<button
    className=" flex justify-center gap-3 items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition">
    <FaUserClock />
    Pending...
</button>
<button
    className=" flex justify-center gap-3 items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition">
    <FaUserCheck />
    Following
</button>





{/* followers tab  */}
<div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
            <div
                href="#"
                className={`inline-block p-4  ${activeTab == "followers" ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}  border-b-2 border-transparent rounded-t-lg  cursor-pointer`}
            >
                Followers
            </div>
        </li>
        <li className="me-2">
            <div
                href="#"
                className={`inline-block p-4  ${activeTab == "following" ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-gray-600 hover:border-gray-300'}  border-b-2 border-transparent rounded-t-lg cursor-pointer `}
                aria-current="page"
            >
                Following
            </div>
        </li>
    </ul>
</div>
</div>}

