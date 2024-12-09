/* eslint-disable no-unused-vars */
import io from "socket.io-client"
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useContext, useState, useCallback } from "react";
import { BlogContext } from "../context/BlogContext";

// chat components
import UserList from '../components/chat/UserList';
import UserProfile from '../components/chat/UserProfile';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import Notfound from "./Notfound";



const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const socket = io('http://localhost:3000', { reconnection: true, reconnectionAttempts: 5 });

function Chat() {
    const { user } = useContext(BlogContext);
    const navigate = useNavigate();
    const { user_params } = useParams();


    const user_id = user.user_id;
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const onStartTyping = () => {
        console.log("You started typing!");
        socket.emit("start_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };

    const onStopTyping = () => {
        console.log("You stopped typing!");
        socket.emit("stop_typing", {
            from: user_id,
            to: selectedUser.user_id
        })
    };

    useEffect(() => {
        socket.on(`startedTyping${user_id}`, ({ from, to }) => {
            console.log(from + " is typing for you");

            setUsers(prevUsers =>
                prevUsers.map(prevUser =>
                    prevUser.user_id == from
                        ? { ...prevUser, typing: true }
                        : { ...prevUser, typing: false }
                )
            );

        })

        socket.on(`stopedTyping${user_id}`, ({ from, to }) => {
            console.log(from + " is stoped typing for you");

            setUsers(prevUsers =>
                prevUsers.map(prevUser =>
                    prevUser.user_id == from
                        ? { ...prevUser, typing: false }
                        : { ...prevUser, typing: false }
                )
            );

        })
    }, [])




    // Load messages
    const loadConversation = useCallback(async (selectedUserId) => {
        try {
            const response = await axios.get(`${apiUrl}/messages/conversation?sender=${selectedUserId}&receiver=${user_id}`);
            setMessages(response.data.data || []);
            console.log("Loading conversation");
            console.table(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch messages');
        }
    }, [user_id]);


    // Refresh messages
    const reloadMessages = (userId) => {
        loadConversation(userId);
    };

    // Send message
    const handleSendMessage = () => {
        if (!message || !selectedUser) return;
        const newMessage = { content: message, sender_id: user_id, receiver_id: selectedUser.user_id };
        socket.emit('message', newMessage);
        setMessages(prev => [...prev, newMessage]);
        setTimeout(() => {
            reloadMessages(selectedUser.user_id);
        }, 2000);
        setMessage('');
    };

    // Handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        navigate(`/chat/${user.user_id}`);
        loadConversation(user.user_id);

        // Set unread to false for the selected user
        // setUsers(prevUsers =>
        //     prevUsers.map(prevUser =>
        //         prevUser.user_id === user.user_id
        //             ? { ...prevUser, unread: false }
        //             : prevUser
        //     )
        // );
    };

    // url parameter handling
    // useEffect(() => {
    //     if (user_params && !isNaN(user_params)) {
    //         console.log("Params available = " + user_params);
    //         const selectedUserId = Number(user_params);
    //         console.log("serching in users");
    //         const userToSelect = users.find(user => user.user_id === selectedUserId);
    //         if (userToSelect) {
    //             handleUserSelect(userToSelect);
    //         } else {
    //             console.log("User not found for ID:", selectedUserId);
    //         }
    //     } else {
    //         console.log("Params not available or not a number.");
    //     }
    // }, [user_params]);


    // Listen for new messages
    useEffect(() => {
        // send the user online info
        socket.emit("online", user_id);

        socket.on("userOnline", (user_id) => {        // listen other users online status and update state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.user_id === user_id ? { ...user, online: true } : user
                )
            )
        })

        socket.on("userOffline", (user_id) => {        // listen other users offline status and update state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.user_id === user_id ? { ...user, online: false } : user
                )
            )
        })

        // recieve messages
        socket.on(user_id, msg => {
            if (msg.sender_id === selectedUser?.user_id) {
                setMessages(prev => [...prev, msg]);
            } else {
                // adding unread propery to true
                // setUsers(prevUsers =>
                //     prevUsers.map(user =>
                //         user.user_id === msg.sender_id
                //             ? { ...user, unread: true }
                //             : user
                //     )
                // );
            }
        });
        return () => socket.off(user_id);
    }, [selectedUser]);


    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            // if (!user.isLoggedIn) return
            try {
                // http://localhost:3000/api/user/all
                const response = await axios.get(`${apiUrl}/user/all`);
                // setUsers(response.data.data || []);
                setUsers(response.data.data.map(obj => ({ ...obj, unread: false })) || [])
                console.log("Users are :: ");
                console.table(response.data.data.map(obj => ({ ...obj, unread: false })));


                if (user_params && !isNaN(user_params)) {
                    const selectedUserId = Number(user_params);
                    console.log("serching in users : " + user_params);
                    console.table(users)
                    const userToSelect = response.data.data.find(user => user.user_id === selectedUserId);
                    if (userToSelect) {
                        setSelectedUser(userToSelect);
                        // handleUserSelect(userToSelect);
                    } else {
                        console.log("User not found for ID:", selectedUserId);
                    }
                } else {
                    console.log("Params not available or not a number.");
                }

            } catch {
                toast.error('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);




    return (
        <div>
            {
                user.isLoggedIn ?
                    <div className="flex flex-col md:flex-row bg-gray-900 text-white">
                        <UserList users={users} user_id={user_id} onSelect={handleUserSelect} selectedUser={selectedUser} />
                        <div style={{ height: 'calc(100vh - 70px)' }} className="flex-1 flex flex-col">
                            {selectedUser ? (
                                <>
                                    <UserProfile user={selectedUser} onBack={() => {
                                        navigate("/chat");
                                        setSelectedUser(null)
                                    }} />
                                    <MessageList messages={messages} selectedUser={selectedUser} reloadMessages={reloadMessages} setMessages={setMessages} user_id={user_id} />
                                    <MessageInput
                                        onStartTyping={onStartTyping}
                                        onStopTyping={onStopTyping}
                                        message={message}
                                        setMessage={setMessage}
                                        onSendMessage={handleSendMessage}
                                    />
                                </>
                            ) : (
                                <div className='hidden md:flex justify-center items-center flex-col p-10'>
                                    <h2 className='text-gray-300'>Select a chat to get started</h2>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-blue-600 mt-8">
                                            <i className="fas fa-comments text-2xl"></i>
                                        </div>
                                        <h2 className='text-white font-extrabold text-4xl font-serif'>Blogify Chat</h2>
                                    </div>
                                    <h3 className="text-3xl font-semibold text-white">Chat with People</h3>
                                </div>
                            )}
                            <Toaster position="top-center" />
                        </div>
                    </div>
                    : <Notfound />
            }
        </div>
    )
}

export default Chat
