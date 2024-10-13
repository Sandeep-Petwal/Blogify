const {DataTypes} = require("sequelize");
const sequelize = require("../config/database")


const Blogs = sequelize.define("Blogs", {
    blog_id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
    },
    title: {
        type: DataTypes.CHAR,
        unique : true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    slug: {
        type: DataTypes.CHAR,
        unique: true,
        allowNull: false,
    },
    view : {
        type : DataTypes.INTEGER,
        defaultValue : 0,
    }
},
    {
        timestamps: true
    }
)

module.exports = Blogs