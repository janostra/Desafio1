const ticketModel = require("../models/ticket.model.js");
const CartRepository = require("./cart.repository.js");
const cartRepository = new CartRepository;
const { generarCodigoUnico } = require("../utils/util.js");
const UserRepository = require("./user.repository.js");
const userRepository = new UserRepository;


class ticketRepository {
    async crearTicket(user) {
        const cartId = await userRepository.obtenerCarritoId(user);
        try {
            const amount = await cartRepository.obtenerTotalCarrito(cartId);
            const code = generarCodigoUnico();
            const purchaseDatetime = new Date();
            const mail = user.email;
        
            const ticket = new ticketModel({
                code: code,
                purchase_datetime: purchaseDatetime,
                amount: amount,
                purchaser: mail
            });

            return await ticketModel.create(ticket);

        } catch (error) {
            console.error("Error al crear el ticket: ", error);
        }
       
    }

}

module.exports = ticketRepository;