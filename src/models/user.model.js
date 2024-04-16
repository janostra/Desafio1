const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
        type: mongoose.Types.ObjectId,
        ref: 'carts'
      },
    role: {
        type: String,
        default: "user"
    }
})

userSchema.plugin(mongoosePaginate); 
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;