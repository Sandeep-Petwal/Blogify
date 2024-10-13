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
    }
}, {

    timestamps: true,
});

// One-to-Many Relationship
Users.hasMany(Blogs, {
    foreignKey: "user_id",     // foreign key ref => Users primary key
    as: 'user',               // for eager loading helpfull on attrubute query
    onDelete: 'CASCADE',     // Cascade delete when a user is deleted

});

// hasOne relationship
Blogs.belongsTo(Users, {
    foreignKey: "user_id", // foreign key in the Blog references => Users primary key
    as: 'user',
    onDelete: 'CASCADE'  //  when the user is deleted, blogs are also deleted
})

 
module.exports = Users