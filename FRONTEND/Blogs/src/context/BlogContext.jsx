import { createContext } from "react";
export const BlogContext = createContext();
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;


export const BlogContextProvider = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, user_id: null, email: null, name: null, bio: null, temp: Date.now(), role: "user", profile_picture : null });
    const [updatedUser, setUpdatedUser] = useState({
        Updatedsername: null,
        UpdatedEemail: null
    });

    const login = (user_id, email, name, bio) => {
        setUser({
            isLoggedIn: true,
            user_id,
            email,
            name,
            bio
        });
    };

    const updateTheUser = (name, email) => {
        setUpdatedUser({ Updatedsername: name, UpdatedEemail: email })
    }

    const logout = () => {
        setUser({
            isLoggedIn: false,
            user_id: null,
            email: null,
            name: null,
            role: "user"
        });
        localStorage.removeItem("token");
    };

    // Function to verify user with token from localStorage
    const verifyUser = async (token) => {
        try {
            const response = await fetch(`${apiUrl}/verify`, {
                headers: {
                    token
                }
            });
            if (!response.ok) {
                localStorage.removeItem("token");
                return console.log(" coudn't verify the token")
            }

            // If verified, update the user context
            const data = await response.json();
            const { user_id, email, name, bio, role, profile_picture } = data;
            setUser({
                isLoggedIn: true,
                user_id,
                email,
                name,
                bio,
                role,
                profile_picture
            });
        } catch (error) {
            console.error("Error verifying user:", error);
            // logout();
        }
    };


    const refreshUserDetail = async (token) => {
        verifyUser();
    }

    return (
        <BlogContext.Provider value={{ user, login, logout, updatedUser, updateTheUser, verifyUser, refreshUserDetail }}>
            {children}
        </BlogContext.Provider>
    );
};
