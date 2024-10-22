/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

function debounce(functionToDebounce, delayInMs) {
    let timerID;
    // return function that wraps the original function
    return function (...args) {
        // clear any existing timer
        clearTimeout(timerID);

        // set a new timer
        timerID = setTimeout(() => {
            // call original function with passes args
            functionToDebounce(...args);
        }, delayInMs);
    };
}

function SearchBlogs() {
    const [searchValue, setSearchValue] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    // Original function
    const fetchBlogs = async (query) => {
        if (!query.trim()) {
            setBlogs([]);
            setIsFetching(false);
            return;
        }

        setIsFetching(true);
        try {
            const response = await fetch(`http://localhost:3000/api/search/${query}`);
            const data = await response.json();
            if (response.ok) {
                setBlogs(data);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.log(error);
            setBlogs([]);
        } finally {
            setIsFetching(false);
        }
    };

    //  memoized debounced  fetchBlogs function
    const debouncedFetchBlogs = useCallback(debounce(fetchBlogs, 1000), []);


    
    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setIsFetching(true);
        debouncedFetchBlogs(value);
        setBlogs([]);
        setSearchValue(value);
    };

    // highlight
    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi')); // array saparating the query
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <span key={index} className="bg-yellow-400 dark:bg-yellow-700 ">{part}</span> : part
        );
    };


    return (
        <div className="mt-20">
            {/* Search bar */}
            <section >
                <form className="max-w-lg mx-auto " onSubmit={(e) => e.preventDefault()}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full h-16 p-4 ps-10 text-lg caret-orange-600 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Blogs"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="text-white mb-1 absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {
                                isFetching ?
                                    <img src="Loading.gif" alt="Loading" className="size-5" />
                                    : "Search"
                            }
                            {/* Search */}
                        </button>
                    </div>
                </form>
            </section>

            <section className="max-w-md mx-auto mt-2 mb-32">
                {isFetching && <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>}

                {/* Results list */}
                {blogs.length > 0 ? (
                    <ul>
                        {blogs.map((blog) => (
                            <li key={blog.blog_id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-slate-700 hover:border transition duration-300">
                                <Link
                                    to={`blog/${blog.slug}`}>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {/* {blog.title.slice(0, 50)} */}
                                        {highlightText(blog.title.slice(0, 42), searchValue)} 
                                        {blog.title.length > 50 && " . . . "}

                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {blog.content.slice(0, 60)}...
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                                        Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    searchValue.trim() != "" && !isFetching && !isFetching && <p className="text-center text-orange-500 text-xl font-bold">No blogs found</p>
                )}
            </section>
        </div>
    );
}

export default SearchBlogs;