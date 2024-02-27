const mongoose  = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {
        type: String
    },

    message: {
        type: String
    } 

})

const MessageModel = mongoose.model("message", messageSchema);

module.exports = MessageModel;