require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const routes = require("./routes/routes");
const { limiter } = require("./middleware/rateLimit")
const adminRoutes = require("./routes/adminRoutes");
const verificationRoutes = require("./routes/verificationRoutes")
const messageRoutes = require("./routes/messageRoutes")


// socket
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: "*" });
const { socketConnection } = require("./socket/socket")


// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // use /upload as static path


// Routes
app.use("/api", routes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes)

// socket connection in different file
socketConnection(io);



// Listning Server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on - http://localhost:${port}`);
})
