const Blogs = require('./blogsModel');
const Users = require('./userModel');
const Tempusers = require('./tempUserModel');
const Templates = require('./emailTemplatesModel');
const Messages = require("./messagesModel")



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


module.exports = { Blogs, Users, Templates, Tempusers, Messages }