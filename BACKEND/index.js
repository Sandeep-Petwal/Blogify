const express = require("express");
const cors = require("cors");
require('dotenv').config();
const path = require('path');
const { limiter } = require("./middleware/rateLimit")

 
const sequelize = require("./config/database");
const routes = require("./routes/routes")
const adminRoutes = require("./routes/adminRoutes");
// express app 
const app = express();

//middleware
app.use(cors());
app.use(express.json());
// Apply the rate limiter to all requests
app.use(limiter);


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//routes
app.use("/api", routes);
app.use("/api/admin", adminRoutes);

// sync database promise
// sequelize.sync({ alter: true }) // forcefully ulter the table 
sequelize.sync()
    .then(() => console.log("Models sync success"))
    .catch((err) => console.log("Error sync Models " + err))


app.listen(3000, () => {
    console.log(`Listening on - http://localhost:${3000}`);
})