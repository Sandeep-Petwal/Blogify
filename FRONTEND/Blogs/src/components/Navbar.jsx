import { useState, useContext, useEffect } from 'react';
import { BlogContext } from '../context/BlogContext';
import { RiAdminLine } from "react-icons/ri";
import { FaEdit, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import { FaUserPlus } from "react-icons/fa6";
import { HiOutlineLogin } from "react-icons/hi";


import { Link, NavLink } from 'react-router-dom';


function Navbar() {
    const { user, login, logout, updatedUser, updateTheUser, verifyUser } = useContext(BlogContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    if (!user.isLoggedIn && localStorage.getItem("token")) {
        console.log("\nverifyieng user\n");
        verifyUser(localStorage.getItem("token"));
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-800">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <span className="self-center font-serif text-2xl font-semibold whitespace-nowrap text-orange-500 hover:text-orange-400">
                        Blogify
                    </span>
                </a>
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-default"
                    aria-expanded={isOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium items-center flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-bg-gray-800">
                        <li>
                            <NavLink
                                to={"/"}
                                className={({ isActive }) =>
                                    `flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3   rounded md:bg-transparent  md:p-0 
                                  ${isActive ? 'text-orange-600 bg-gray-600 font-bold' : 'text-white'}`
                                }
                                //  className=" flex justify-center {} hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                aria-current="page"
                            >
                                <FaHome />
                                Home
                            </NavLink>

                        </li>


                        {/* if logged in  */}
                        {user.isLoggedIn &&
                            <div className='flex items-center flex-wrap justify-center gap-5'>
                                <li>
                                    <NavLink
                                        to={"/profile"}
                                        className={({ isActive }) =>
                                            `flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3   rounded md:bg-transparent  md:p-0 
                                          ${isActive ? 'text-orange-600 bg-gray-600 font-bold' : 'text-white'}`
                                        }

                                        // className=" flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                        aria-current="page"
                                    >
                                        <FaRegCircleUser />
                                        Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to={"/chat"}
                                        className={({ isActive }) =>
                                            `flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3   rounded md:bg-transparent  md:p-0 
                                          ${isActive ? 'text-orange-600 bg-gray-600 font-bold' : 'text-white'}`
                                        }

                                        // className=" flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                        aria-current="page"
                                    >
                                        <IoChatbubbleEllipsesSharp />
                                        Chat
                                    </NavLink>
                                </li>
                                {user.role == "admin" && <li>
                                    <NavLink
                                        to={"/admin"}
                                        className={({ isActive }) =>
                                            `flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3   rounded md:bg-transparent  md:p-0 
                                          ${isActive ? 'text-orange-600 bg-gray-600 font-bold' : 'text-white'}`
                                        }

                                        // className=" flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                        aria-current="page"
                                    >
                                        <RiAdminLine />
                                        Admin Dashbord
                                    </NavLink>
                                </li>}
                                <button
                                    onClick={logout}
                                    type="button" className="mr-3 flex items-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                    <FaSignOutAlt className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        }

                        {/* if not logged in  */}
                        {!user.isLoggedIn && <div className='flex gap-4 flex-wrap justify-center'>
                            <li>
                                <Link
                                    to={"/login"}
                                    className=" flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                    aria-current="page"
                                >
                                    <button type="button" className="flex items-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center  dark:focus:ring-orange-800">
                                        <HiOutlineLogin className="mr-2" />
                                        Login
                                    </button>

                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={"/signup"}
                                    className=" flex justify-center hover:text-orange-500 items-center gap-2 py-2 px-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white "
                                    aria-current="page"
                                >

                                    <button type="button" className="mr-3 flex items-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center  dark:focus:ring-orange-800">
                                        <FaUserPlus className="mr-2" />
                                        Signup

                                    </button>
                                </Link>
                            </li>
                        </div>}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
