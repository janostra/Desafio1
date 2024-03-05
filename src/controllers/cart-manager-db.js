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
            const carrito = await cartModel.findById(cartId).populate('products.product');

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

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            // Obtener el carrito por su ID
            const cart = await this.getCarritoById(cartId);

            // Verificar si el carrito existe
            if (!cart) {
                throw new Error(`No se encontró un carrito con ID ${cartId}`);
            }

            // Buscar el índice del producto en el carrito
            const index = cart.products.findIndex(item => item.product.toString() === productId);

            // Verificar si el producto está en el carrito
            if (index === -1) {
                throw new Error(`El producto con ID ${productId} no está en el carrito`);
            }

            // Eliminar el producto del carrito
            cart.products.splice(index, 1);
            await cart.save();


            return;
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

}

module.exports = CartManager;