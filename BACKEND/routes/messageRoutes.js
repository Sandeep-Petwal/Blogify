const express = require("express");
const messageRoutes = express.Router();
const messageController = require("../controller/messagesController")

// TODO: add middleware to protect routes
messageRoutes.get("/conversation/", messageController.getConversation); // load conversation
messageRoutes.delete("/delete/:id", messageController.deleteMessage);
messageRoutes.put("/edit/:id", messageController.editMessage);    // http://localhost:3000/api/messages/edit/90

module.exports = messageRoutes
