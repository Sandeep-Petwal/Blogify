import { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { MdChat } from "react-icons/md";
import { FaUserPlus, FaUserClock, FaUserCheck } from "react-icons/fa";

// check if user_id is a positive integer
const isPositiveInteger = (value) => {
    const number = parseInt(value, 10);
    return /^\d+$/.test(value) && number > 0 && Number.isInteger(number);
};

function PublicProfile() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const { user } = useContext(BlogContext);

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState([]);
    const [error, setError] = useState("");
    const { user_id } = useParams();

    // followers tab
    // const [activeTab, setActiveTab] = useState("")

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
            {
                !error && <div className="mt-8 min-w-96 mx-4 flex flex-col items-center p-8 bg-gray-800 text-white shadow-md rounded-lg w-fit">
                    <img
                        id="profile_img"
                        className="h-28 mb-4 w-28 object-cover rounded-full border"
                        src={profile.profile_picture_url}
                        alt={"avatar"}
                    />

                    <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
                    <p className="mt-2 text-gray-200">{profile.email}</p>
                    <p className="mt-2 text-gray-200">{profile.bio}</p>

                    {user.isLoggedIn &&
                        <Link
                            to={`/chat/${user_id}`}
                        >
                            <MdChat size={30} />
                        </Link>
                    }
                </div>
            }






            {/* react hot toast  */}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default PublicProfile
