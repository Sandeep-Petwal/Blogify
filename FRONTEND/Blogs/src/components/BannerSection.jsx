import { FaUserPlus } from "react-icons/fa6";
import { HiOutlineLogin } from "react-icons/hi";
import { Link } from 'react-router-dom'

function BannerSection() {
  return (
    <div className="section">

      <div className="mt-12 top-container w-full flex justify-center items-center">
        <div
          href="/"
          className="m-6 p-12 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl  dark:border-gray-700 dark:bg-gray-800 "
        >
          <div className="flex flex-col justify-between p-6 leading-normal">
            <h5 className="mb-3 text-3xl font-bold tracking-tight text-orange-600">
              Discover, express, connect
            </h5>
            <p className="mb-4 font-normal text-lg text-gray-700 dark:text-gray-400">
              Welcome to Blogify, a blogging platform where writers and thinkers share their ideas, experiences, and perspectives. Our community is dedicated to fostering creativity, sparking conversation, and inspiring new perspectives. Browse our latest articles, join the discussion, and become a part of our vibrant community of writers and readers
            </p>

            <div className="mt-6 flex justify-center items-center flex-wrap gap-4 space-x-6">

              <Link to={"/login"}>
                <button className="w-48 flex justify-center items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg  transition">
                  <HiOutlineLogin className="mr-2" />
                  Login
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="w-48 flex justify-center items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg  transition">
                  <FaUserPlus className="mr-2" />
                  Signup
                </button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BannerSection