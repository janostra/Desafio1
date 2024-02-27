const cartModel = require("../models/cart.model.js");

class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new cartModel({products: []});
            await nuevoCarrito.save(); 
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear nuevo carrito", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await cartModel.findById(cartId);

            if(!carrito){
                console.log ("No hay carrito disponible");
                return null
            }

            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);
            
            if (existeProducto){
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({product: productId, quantity});
            }

            carrito.markModified("products");

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("Error al agregar un producto al carrito", error);
            throw error;
        }
    }

}

module.exports = CartManager;