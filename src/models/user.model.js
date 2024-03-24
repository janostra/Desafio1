const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, 
        index: true
    },
    password: {
        type: String, 
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
      },
    role: {
        type: String,
        default: "user"
    }
})

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;