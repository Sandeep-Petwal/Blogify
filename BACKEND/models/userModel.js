//import { DataTypes } from "sequelize";
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")
const Blogs = require("./blogsModel")


const Users = sequelize.define("Users", {
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
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'uploads/default_profile.jpg',
    },
    profile_picture_url: {
        type: DataTypes.VIRTUAL,
        get() {
            const baseUrl = process.env.SERVER_URL || 'http://localhost:3000/';
            return this.getDataValue('profile_picture') ? baseUrl + this.getDataValue('profile_picture') : baseUrl + "uploads/default_profile.jpg";
        }
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
    otp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    online: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true,
});


module.exports = Users