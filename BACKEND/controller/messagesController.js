const { Messages } = require("../models");
const { Op, where } = require("sequelize");

const response = require("../util/response")
const validate = require('../middleware/validators');


exports.getConversation = async (req, res) => {
    const { sender: sender_id, receiver: receiver_id } = req.query;
    const rules = {
        sender_id: "required|integer",
        receiver_id: "required|integer"
    }
    let { status, message } = await validate({ sender_id, receiver_id }, rules);
    if (!status) return response.failed(res, "Provide currect information.", message)

    try {
        const messages = await Messages.findAll({
            where: {
                [Op.or]: [
                    { sender_id, receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id }
                ]
            },
            order: [['createdAt', 'ASC']] // latest message last
        });

        if (messages.length > 0) {
            return res.json({ data: messages })
        }
        res.json({ message: "No conversation found", data: [] })
    } catch (error) {
        console.log(error);
        return response.serverError(res, error)
    }
};



// store messages function
exports.storeMessage = async (sender_id, receiver_id, content) => {
    console.log("Inside storeMessage");
    // store message to database
    try {
        const message = await Messages.create({ sender_id, receiver_id, content });
        // console.table(message);
    } catch (error) {
        console.log("Error while storing message to db !", error);
    }
}



// delete message by its id
exports.deleteMessage = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return response.failed(res, "Id not provided")
    }
    try {
        const deletedCount = await Messages.destroy({ where: { id } });
        if (deletedCount === 0) {
            console.log('No Message found with that ID.');
            return response.failed(res, "No Message found with id")
        }
        return response.success(res, "Message Deleted")
    } catch (error) {
        console.log(error);
        return response.serverError(res, error)
    }
}

// Edit message by its id
exports.editMessage = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const rules = {
        content: "required|string",
        id: "required|integer"
    }
    let { status, message } = await validate({ content, id }, rules);
    if (!status) return response.failed(res, "Provide currect information.", message)

    try {
        const [affectedCount] = await Messages.update({ content }, { where: { id } });
        if (affectedCount === 0) {
            console.log('No Message found with that ID.');
            return response.failed(res, "No Message found with that ID");
        }
        return response.success(res, "Message Edited");
    } catch (error) {
        console.error(error);
        return response.serverError(res, error);
    }
}


