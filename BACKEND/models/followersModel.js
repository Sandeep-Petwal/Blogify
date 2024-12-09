const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");


const Followers = sequelize.define("followers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
        allowNull: false
    }
}, {
    timestamps: true
})


module.exports = Followers;