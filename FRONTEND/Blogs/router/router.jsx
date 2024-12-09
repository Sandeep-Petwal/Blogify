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
import PublicProfile from "../src/pages/PublicProfile";
import Chat from "../src/pages/Chat";

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
                path: "/profile",  //  logged in profile
                element: <Profile />,
            },
            {
                path: "/profile/:user_id",   // public profile of user
                element: <PublicProfile />
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
                path: "/chat/:user_params",
                element: <Chat />
            },
            {
                path: "/chat",
                element: <Chat />
            },
            {
                path: "/404",
                element: <Notfound />
            },
            {
                path: "*",
                element: <Notfound />,
            },
        ],
    },
]);

export default router;
