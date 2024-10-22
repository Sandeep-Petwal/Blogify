require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const routes = require("./routes/routes");
const adminRoutes = require("./routes/adminRoutes");
const { limiter } = require("./middleware/rateLimit")
const verificationRoutes = require("./routes/verificationRoutes")

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // use /upload as static path


// Routes
app.use("/api", routes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);

    
// Listning Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on - http://localhost:${port}`);
})
