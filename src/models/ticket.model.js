const mongoose = require('mongoose');

// Definir el esquema del modelo Ticket
const ticketSchema = new mongoose.Schema({
    code: {
            type: String, 
            required: true, 
            unique: true 
        },
    purchase_datetime: {
            type: Date, 
            default: Date.now 
        },
    amount: {
            type: Number, 
            required: true 
        },
    purchaser: {
            type: String, 
            required: true 
        }
});

// Definir el modelo Ticket utilizando el esquema definido
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
