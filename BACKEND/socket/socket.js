
const {storeMessage} = require("../controller/messagesController")


const socketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log("New Connection connected!\n");
        io.emit("connection", "A new user connected!");

        socket.on("start_typing", ({ from, to }) => {
            console.log(from + " is started typing for " + to);
            io.emit(`startedTyping${to}`, ({ from, to })); 
        })

        socket.on("stop_typing", ({ from, to }) => {
            console.log(from + " is stoped typing for " + to);
            io.emit(`stopedTyping${to}`, ({ from, to }));
        });

        // listen messages
        socket.on("message", ({ sender_id, receiver_id, content }) => {
            console.table({ sender_id, receiver_id, content });
            console.log("Message received from: " + sender_id + ", xto: " + receiver_id);

            // send to receiver only
            io.emit(receiver_id, { sender_id, receiver_id, content });
            
            // store message to db
            storeMessage(sender_id, receiver_id, content);
        });

        // error handling
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
};

module.exports = { socketConnection };
