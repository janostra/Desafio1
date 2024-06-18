const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
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
        enum: ['admin', 'user', 'premium'],
        default: "user"
    },
    resetToken: {
        token: String,
        expiresAt: Date
    },
    documents: [{
        name: String,
        reference: String
    }], 

    last_connection: {
        type: Date, 
        default: Date.now
    }
})

userSchema.plugin(mongoosePaginate); 
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;