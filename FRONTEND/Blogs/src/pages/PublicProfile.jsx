import { useEffect, useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

// check if user_id is a positive integer
const isPositiveInteger = (value) => {
    const number = parseInt(value, 10);
    return /^\d+$/.test(value) && number > 0 && Number.isInteger(number);
};



function PublicProfile() {

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([]);
    const [error, setError] = useState("");

    const { user_id } = useParams();


    const fetchProfile = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/user/profile/${user_id}`);
            setProfile(response.data.data);
            console.log(response.data.data);
            console.log(response.data.data.profile_picture_url);
        } catch (err) {
            console.log("User not found" + err);
            setError("User not found !")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isPositiveInteger(user_id)) {
            setError("Invalid params !")
        } else {
            fetchProfile();
        }
    }, [])

    if (loading) {
        return <h1 className='text-white h-full flex justify-center content-center font-bold'>
            <img src="/Loading.gif" alt="Loading" className='h-40' />

        </h1>
    }
    return (
        <div className='text-white flex justify-center'>

            {/* if theire is any error  */}
            {
                error &&
                <div className='flex justify-center mt-10 font-bold text-4xl text-orange-500'>
                    {error}
                </div>
            }

            {/* profile card  */}
            {!error && <div className="mt-8 min-w-72 mx-4 flex flex-col items-center p-8 bg-gray-800 text-white shadow-md rounded-lg w-fit">
                    <img
                        id="profile_img"
                        className="h-28 mb-4 w-28 object-cover rounded-full border"
                        src={profile.profile_picture_url}
                        alt={"avatar"}
                    />


                <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                <p className="mt-2 text-gray-200">{profile.email}</p>
                <p className="mt-2 text-gray-200">{profile.bio}</p>

                {/* Button Group */}
                {/* <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                    <button

                        className="w-40 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        Edit Profile
                    </button>
                    <button
                        className=" flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        Change Password
                    </button>
                </div> */}


            </div>}

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default PublicProfile
