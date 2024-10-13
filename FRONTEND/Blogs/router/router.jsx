import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../src/App";
import Login from "../src/pages/Login";
import Home from "../src/Home";
import Signup from "../src/pages/Signup";
import Blog from "../src/pages/Blog";
import Notfound from "../src/pages/Notfound"
import Profile from "../src/pages/Profile";
import Admin from "../src/pages/Admin";
import ForgetPassword from "../src/pages/ForgetPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/blog/:slug",
                element: <Blog />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/admin",
                element: <Admin />,
            },
            {
                path: "/reset",
                element: <ForgetPassword />,
            },
            {
                path: "*",
                element: <Notfound />,
            },
        ],
    },
]);

export default router;
