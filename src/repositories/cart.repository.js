const cartModel = require("../models/cart.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository;

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
            const producto = await productRepository.traerProductoPorId(productId);

                if (existeProducto){
                    existeProducto.quantity += quantity;
                } else {
                    carrito.products.push({product: productId, quantity});
                }
                if (existeProducto.quantity > producto.stock) {
                    throw new error ("No hay sufiente stock para agregar al carrito");
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

    async obtenerTotalCarrito (cartId) {
        try {
            let total = 0;
            const carrito = await this.traerCarritoPorId(cartId);
            for (const item of carrito.products) {
                const producto = await productRepository.traerProductoPorId(item.product._id);
                total += producto.price * item.quantity;
            }
            return total;
        } catch (error) {
            console.error("Error al obtener el precio total del carrito: ", error);
        }
    }

    async restarStockProductos(products) {
        try {
            for (const item of products) {
                const productId = item.product._id;
                const quantity = item.quantity;
                const producto = item.product;
                producto.stock -= quantity;
                await productRepository.actualizarProducto(productId, { stock: producto.stock });
            }
        } catch (error) {
            console.error("Error al restar el stock de los productos:", error);
        }
    }
    
}

module.exports = cartRepository;