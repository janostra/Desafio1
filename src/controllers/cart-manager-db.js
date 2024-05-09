const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const TicketRepository = require ("../repositories/ticket.repository.js");
const UserRepository = require("../repositories/user.repository.js");
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

class CartManager {

    async addCart(req, res) {
        try {
            const carrito = await cartRepository.crearCarrito();
            res.status(200).send({ message: `Nuevo carrito creado con ID ${carrito._id}` });
        } catch (error) {
            res.status(500).json("error del servidor");
            req.logger.error("error del serivdor");
        }
    }

    async getCarritoById(req, res) {

        const cartId = req.params.cid;

        try {
            const carrito = await cartRepository.traerCarritoPorId(cartId);
            const id = carrito._id
            
            if (carrito !== null) {
                const productos = carrito.products.map(item => ({
                    _id: item.product._id,
                    title: item.product.title,
                    price: item.product.price,
                    description: item.product.description,
                    quantity: item.quantity
                }));
    
                res.render("carts", { productos, id });
            } else {
                res.status(404).json({ error: `no se encontró un carrito con ID ${cartId}` });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos del carrito' });
            req.logger.error("Error al obtener los productos del carrito");
        }
    }

    async addProductToCart(req, res) {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            await cartRepository.agregarProductoAlCarrito(cartId, productId, quantity);
            res.json({ message: `Producto con ID ${productId} agregado al carrito con ID ${cartId}` });
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar producto al carrito' });
            req.logger.error("Error al agregar producto al carrito");
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {
            // Obtener el carrito por su ID
            const cart = await cartRepository.traerCarritoPorId(cartId);

            // Verificar si el carrito existe
            if (!cart) {
               return res.status(404).json(`No se encontró un carrito con ID ${cartId}`);
            }

            // Buscar el índice del producto en el carrito
            const index = cart.products.findIndex(item => item.product._id.toString() === productId);
            // Verificar si el producto está en el carrito
            if (index === -1) {
                return res.status(404).json(`El producto con ID ${productId} no está en el carrito`);
            }

            // Eliminar el producto del carrito
            cart.products.splice(index, 1);
            await cartRepository.guardarCarrito(cart);
            res.json({ message: `Producto con ID ${productId} eliminado del carrito con ID ${cartId}` });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar producto del carrito' });
            req.logger.error("Error al eliminar producto del carrito");
        }
    }
    

    async updateProductsFromCart(req, res){
        const cartId = req.params.cid;
        const newProducts = req.body.products;
    
        try {
            // Buscar el carrito por su ID
            const cart = await cartRepository.traerCarritoPorId(cartId);
    
            // Verificar si el carrito existe
            if (!cart) {
                return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
            }
    
            // Actualizar los productos del carrito con el nuevo arreglo
            cart.products = newProducts;
    
            // Guardar los cambios
            await cartRepository.guardarCarrito(cart);
            res.json({ message: `Carrito con ID ${cartId} actualizado correctamente` });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el carrito' });
            req.logger.error("Error al actualizar el carrito");
        }
    }

    async updateQuantityFromProduct(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
    
        try {
            // Buscar el carrito por su ID
            const cart = await cartRepository.traerCarritoPorId(cartId);
    
            // Verificar si el carrito existe
            if (!cart) {
                return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
            }
    
            // Buscar el índice del producto en el carrito
            const index = cart.products.findIndex(item => item.product._id.toString() === productId);
    
            // Verificar si el producto está en el carrito
            if (index === -1) {
                return res.status(404).json({ error: `El producto con ID ${productId} no está en el carrito` });
            }
    
            // Actualizar la cantidad del producto en el carrito
            cart.products[index].quantity = newQuantity;
    
            // Guardar los cambios
            await cartRepository.guardarCarrito(cart);
            res.json({ message: `Cantidad del producto con ID ${productId} actualizada en el carrito con ID ${cartId}` });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
            req.logger.error("Error al actualizar la cantidad del producto en el carrito");
        }
    }

    async deleteAllProducts (req, res) {
        const cartId = req.params.cid;
        try {
            // Buscar el carrito por su ID
            const cart = await cartRepository.traerCarritoPorId(cartId);
        
            // Verificar si el carrito existe
            if (!cart) {
                return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
            }
        
            // Eliminar todos los productos del carrito
            cart.products = [];
        
            // Guardar los cambios
            await cartRepository.guardarCarrito(cart);
            res.json({ message: `Todos los productos del carrito con ID ${cartId} han sido eliminados` });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
            req.logger.error("Error al eliminar todos los productos del carrito");
        }
    }


    //preguntar porque no me toma user= req.session.user
    async purchaseCart(req, res) {
        const cartId = req.params.cid;
        const user = await userRepository.buscarUsuarioPorCarrito(cartId);
        const carrito = await cartRepository.traerCarritoPorId(cartId);
        const productos = carrito.products
        try {
            const ticket = await ticketRepository.crearTicket(user);
            carrito.products = [];
            await cartRepository.guardarCarrito(carrito);
            await cartRepository.restarStockProductos(productos);
            const { code, purchase_datetime, amount, purchaser } = ticket;
            res.render("ticket", { code, purchase_datetime, amount, purchaser });
        } catch (error) {
            res.status(500).json({ error: 'Error al realizar compra' });
            req.logger.error("Error al realizar compra");
        }
    }

}

module.exports = CartManager;