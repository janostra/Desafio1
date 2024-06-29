const UserModel = require('../models/user.model.js');
const EmailManager = require ("../services/email.js");
const emailManager = new EmailManager();

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

    async traerUsuarios() {
        try {
            const users = await UserModel.find();
            return users
        } catch (error) {
            console.error("Error al traer usuarios:", error);
        }
    }

    async borrarUsuario(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (user.role === "admin") {
                return res.status(403).send("No se puede eliminar un usuario con rol de admin");
            }
            emailManager.enviarCorreoEliminados(user.email, user.first_name);
            await UserModel.findByIdAndDelete(userId);
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    }

}

module.exports = UserRepository;
