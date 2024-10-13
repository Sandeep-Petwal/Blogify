import { Link } from 'react-router-dom'

function Notfound() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="mt-4 text-lg text-gray-600">Oops! Page not found.</p>
                <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
                <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
                    Go Back Home
                </Link>
                
            </div>

        </div>
    )
}

export default Notfound
