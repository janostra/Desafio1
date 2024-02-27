const mongoose  = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
 
    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: [String],
    },
    status: {
        type: Boolean,
        required: true
    }

})

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;