const {Sequelize}= require('sequelize')
const config = require("./config");

const sequelize = new Sequelize(config);

// authenticate promise
sequelize.authenticate()
.then(() => console.log("Successfully authenticate the database !"))
.catch((err) => console.log("Error while authenticating the database " + err))


// Syncing Models
// sequelize.sync({alter : true})
//     .then(() => console.log("Models sync success"))
//     .catch((err) => console.log("Error sync Models " + err))


module.exports = sequelize;