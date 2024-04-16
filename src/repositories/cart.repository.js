const cartModel = require("../models/cart.model.js");

class cartRepository {
    async crearCarrito() {
        const nuevoCarrito = new cartModel({products: []});
        try {
            return await cartModel.create(nuevoCarrito);
        } catch (error) {
            console.error("Error al crear nuevo carrito ", error);
        }
    }

    async traerCarritoPorId(_id) {
       try {
        const carrito = await cartModel.findById(_id).populate('products.product');
        return carrito;
       } catch (error) {
        console.error("Error traer carrito ", error);
       }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity) {
        try {
            const carrito = await this.traerCarritoPorId(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId.toString());
                        
            if (existeProducto){
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({product: productId, quantity});
            }
            await this.guardarCarrito(carrito);
        } catch (error) {
            console.error("Error agregar producto al carrito ", error);
        }
    }

    async guardarCarrito(carrito) {
        try {
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al actualizar el carrito", error);
        }
    }
}

module.exports = cartRepository;