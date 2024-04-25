const UserModel = require('../models/user.model.js');

class UserRepository{

    async crearUsuario(user) {
        try {
            return await UserModel.create(user);
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }


    async buscarUsuario(mail) {
        try {
            return await UserModel.findOne({ email: mail });
        } catch (error) {
            console.error("Error al buscar usuario:", error);
        }
    }

    async obtenerCarritoId(user) {
        try {
            // Buscar el usuario por su correo electrónico
            // const usuario = await this.buscarUsuario({ email: user.email });
    
            // Verificar si se encontró el usuario
            if (user) {
                // Obtener el ID del carrito del usuario
                const carritoId = user.cart;
                return carritoId;
            } else {
                // Manejar el caso en que no se encuentra el usuario
                throw new Error("Usuario no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener el ID del carrito:", error);
        }
    }

    
    async buscarUsuarioPorCarrito(cartId) {
        try {
            console.log(cartId);
            const user = await UserModel.findOne({ cart: cartId });
            console.log(user);
            return user;
        } catch (error) {
            console.error("Error al buscar usuario:", error);
        }
    }

}

module.exports = UserRepository;
