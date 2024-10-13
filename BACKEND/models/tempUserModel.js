const sequelize = require("../config/database")
const { DataTypes } = require("sequelize");


const Tempusers = sequelize.define("Tempusers", {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        require: false,
        defaultValue: "",
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verification_otp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    timestamps: true,
})

module.exports = Tempusers;