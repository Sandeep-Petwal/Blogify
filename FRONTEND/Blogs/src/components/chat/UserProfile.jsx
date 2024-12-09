/* eslint-disable react/prop-types */
import { IoVideocam, IoCloseCircle } from "react-icons/io5";
import { Toaster, toast } from 'react-hot-toast';




function UserProfile({ user, onBack }) {

    return (
        <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">

            {/* user detail profile */}
            <div className="w-12 h-12  text-white rounded-full flex items-center justify-center mr-3">
                <img className='rounded-full object-contain w-full h-full' src={user.profile_picture_url} alt={user.profile_picture_url} />
                {/* {user.name[0].toUpperCase()} */}
            </div>


            <h2 className="text-xl font-semibold">
                {user.name}
                <p className="text-green-400 ">{user.online && "Online"}</p>
            </h2>
            <div className="ml-auto flex space-x-4 text-blue-400">
                {/* <IoVideocam size={30} onClick={() => toast.error("Calling feature is not available yet!")} /> */}
                <IoCloseCircle size={30} onClick={onBack} />
            </div>
            <Toaster position="top-center" />
        </div>
    );
}

export default UserProfile;
