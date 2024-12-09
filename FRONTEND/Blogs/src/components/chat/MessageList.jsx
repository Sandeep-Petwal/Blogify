/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import Modal from 'react-modal';

import { Toaster, toast } from 'react-hot-toast';
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value (0.5) for more visibility
    }, content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: 'white', // Text color inside the modal
        backgroundColor: '#1f2937', // Background color of the modal
        minWidth: '340px', // Set the width you want
        // height: '400px', // Set the height you want

    },
};
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');


function MessageList({ messages, setMessages, user_id, selectedUser, reloadMessages }) {
    // console.log("User_id = " + user_id + " Selcted user : " + selectedUser.user_id);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState("");
    const [messageIdToEdit, setMessageIdToEdit] = useState(null);

    const [editIndex, setEditIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const dropdownRef = useRef(null);

    const handleEditClick = (index) => {
        setEditIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setEditIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // function to delete the message
    const handleDeleteMsg = async (id) => {
        // console.log("Deleting : " + id);
        try {
            const response = await axios.delete(`${apiUrl}/messages/delete/${id}`);
            response.data && toast.success("Successfully deleted !");
            reloadMessages(selectedUser.user_id);
            // setMessages(prevMessages =>
            //     prevMessages.filter(msg => msg.id !== id)
            // );
        } catch (error) {
            toast.error(error.response.data.error || "Error deleting");
        }
    }

    // fucntion to edit the message
    const handleEditMsg = async (e) => {
        e.preventDefault();
        console.log("Editing the message ! id : " + messageIdToEdit + " message : " + messageToEdit);
        try {
            const response = await axios.put(`${apiUrl}/messages/edit/${messageIdToEdit}`, {
                content: messageToEdit
            });
            toast.success("Successfully Edited !");
            setEditModalIsOpen(false);
            reloadMessages(selectedUser.user_id);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error || "Error Editing");
        }

    }

    return (
        <div className="flex-1 p-4 max-h-screen h-screen bg-gray-800 rounded-lg overflow-y-scroll scrollbar-thin">
            {messages.length === 0 ? (
                <p className="text-gray-400 mt-5 flex justify-center items-center">No messages yet...</p>
            ) : (
                messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 flex ${msg.sender_id === user_id ? "justify-end" : "justify-start"}`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className={`p-2 rounded-lg max-w-xs ${msg.sender_id === user_id ? "bg-green-600 pr-7 text-white" : "bg-gray-700 text-white"}`}>
                            {msg.content}
                        </div>
                        {/* Message edit options */}
                        {msg.sender_id === user_id && hoveredIndex === index && (
                            <div className="absolute mt-2" ref={dropdownRef}>
                                <div
                                    role="button"
                                    onClick={() => handleEditClick(index)}
                                    className="p-1 cursor-pointer  rounded"
                                >
                                    <MdEdit />
                                </div>
                                {editIndex === index && (
                                    <ul className="absolute bg-base-100 rounded-box mr-20 pr-16 z-[1] w-52 p-2 shadow">
                                        <li className="hover:bg-gray-900 bg-gray-800 cursor-pointer p-1 relative right-10"
                                            onClick={() => {
                                                setMessageIdToEdit(msg.id);
                                                console.log("msg.id = " + msg.id);
                                                setMessageToEdit(msg.content);
                                                setEditModalIsOpen(true);
                                            }}
                                        >Edit</li>
                                        <li className="hover:bg-gray-900 bg-gray-800 cursor-pointer p-1 relative right-10"
                                            onClick={() => {
                                                handleDeleteMsg(msg.id)
                                            }}
                                        >Delete</li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Toaster and modal  */}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div>
                <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={() => {
                        setEditModalIsOpen(false);
                    }}
                    style={customStyles}
                    contentLabel="Example Modal"
                    className={""}
                >
                    <div className="content md:w-[600px]  m-1 flex justify-center items-center flex-col">
                        <form className="mt-4 w-full md:w-[600px] max-w-lg">

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-white mb-1" htmlFor="edit-Name">Edit message</label>
                                <input
                                    maxLength={20}
                                    type="text"
                                    id="edit-Name"
                                    value={messageToEdit}
                                    onChange={(e) => setMessageToEdit(e.target.value)}
                                    required
                                    className="w-full h-12 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                                />
                            </div>


                            <div className="buttons flex justify-center mt-8 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setEditModalIsOpen(false)}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleEditMsg}
                                    className="w-24 flex justify-center ml-4 items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                    {loading && "Loading ..."}
                                    {!loading && (
                                        <span className='flex items-center justify-center'>
                                            Edit
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>

        </div>
    );
}

export default MessageList;
