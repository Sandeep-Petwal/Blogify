import { Link } from 'react-router-dom'
import SearchBlogs from '../components/SearchBlogs'

function Notfound() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-40 mt-14 mb-5 max-w-lg mx-auto  text-white text-center">
                <h1 className="text-9xl font-bold text-orange-600">404</h1>
                <p className="mt-4 text-lg ">Oops! Page not found.</p>
                <p className="mt-2 ">The page you are looking for does not exist.</p>



                <Link to="/" className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition">
                    Go Back Home
                </Link>

            </div>
            <SearchBlogs />

        </div>
    )
}

export default Notfound
