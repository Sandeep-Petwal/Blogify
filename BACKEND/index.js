const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const sequelize = require("./config/database");
const routes = require("./routes/routes");
const verificationRoutes = require("./routes/verificationRoutes")
const adminRoutes = require("./routes/adminRoutes");
const { limiter } = require("./middleware/rateLimit")
require('dotenv').config();



app.use(cors());
app.use(express.json());
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api", routes);
app.use("/api/verify", verificationRoutes);
app.use("/api/admin", adminRoutes);

sequelize.sync()
    .then(() => console.log("Models sync success"))
    .catch((err) => console.log("Error sync Models " + err))


app.listen(process.env.PORT || 3000, () => { 
    console.log(`Listening on - http://localhost:${process.env.PORT}`);
})
