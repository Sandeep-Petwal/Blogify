import { useContext, useEffect, useState } from 'react';
import { BlogContext } from './context/BlogContext';
import BannerSection from './components/BannerSection';
import AllBlogs from './components/AllBlogs';
import UsersBlogs from './components/UsersBlogs';
import SearchBlogs from './components/SearchBlogs';

const Home = () => {
    // context 
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, verifyUser } = useContext(BlogContext);

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [blogLimit, setBlogLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(1);

    const getAllBlogs = async (page, limit) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/blogs?page=${page}&limit=${limit}`);

            if (!response.ok) {
                console.log("Response is not ok");
                throw new Error("Error fetching blogs!");
            }

            const data = await response.json();
            if (data.blogs.length === 0) {
                alert("No public blogs found");
            }

            setBlogs(data.blogs);
            setTotalPages(data.totalPages);
            // console.table(data);
        } catch (error) {
            console.error("An error occurred while fetching blogs:", error);
            alert("An error occurred while fetching blogs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllBlogs(currentPage, blogLimit);
    }, [currentPage, blogLimit]);

    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user.isLoggedIn) {
            setUserLoading(true);
            verifyUser(token).finally(() => setUserLoading(false));
        } else {
            setUserLoading(false);
        }
    }, [user.isLoggedIn, verifyUser]);

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


    return (
        <>
            {(loading || userLoading) && <div>Loading...</div>}

            {/* If not logged in */}
            {!user.isLoggedIn && !userLoading && <BannerSection />}

            {/* search blogs component  */}
            <SearchBlogs />

            {/* If logged in */}
            {user.isLoggedIn && !userLoading && <UsersBlogs />}


            {/* Always show public blogs*/}
            <AllBlogs blogs={blogs} author={false} heading={"Public Blogs"} />

            <div className='gap-2 m-10 flex justify-center content-center'>
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
        </>
    );
};

export default Home;
