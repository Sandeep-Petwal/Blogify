const {Sequelize}= require('sequelize')
const config = require("./config");

const sequelize = new Sequelize(config);

// authenticate promise
sequelize.authenticate()
.then(() => console.log("Successfully authenticate the database !"))
.catch((err) => console.log("Error while authenticating the database " + err))

module.exports = sequelize;