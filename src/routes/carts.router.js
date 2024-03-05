const express = require("express");
const router = express.Router();
const CartManager = require('../controllers/cart-manager-db.js');

// Instancia de CartManager
const cartManager = new CartManager();

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCartId = await cartManager.crearCarrito();
        res.json({ message: `Nuevo carrito creado con ID ${newCartId}` });
    } catch (error) {
        console.error('Error al crear un nuevo carrito:', error);
        res.status(500).json({ error: 'Error al crear un nuevo carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);
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
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// Endpoint para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json({ message: `Producto con ID ${productId} agregado al carrito con ID ${cartId}` });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await cartManager.eliminarProductoDelCarrito(cartId, productId);
        res.json({ message: `Producto con ID ${productId} eliminado del carrito con ID ${cartId}` });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const newProducts = req.body.products;
    console.log(newProducts);

    try {
        // Buscar el carrito por su ID
        const cart = await cartManager.getCarritoById(cartId);

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
        }

        // Actualizar los productos del carrito con el nuevo arreglo
        cart.products = newProducts;

        // Guardar los cambios
        await cart.save();

        res.json({ message: `Carrito con ID ${cartId} actualizado correctamente` });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});


router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        // Buscar el carrito por su ID
        const cart = await cartManager.getCarritoById(cartId);

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
        }

        // Buscar el índice del producto en el carrito
        const index = cart.products.findIndex(item => item.product.toString() === productId);

        // Verificar si el producto está en el carrito
        if (index === -1) {
            return res.status(404).json({ error: `El producto con ID ${productId} no está en el carrito` });
        }

        // Actualizar la cantidad del producto en el carrito
        cart.products[index].quantity = newQuantity;

        // Guardar los cambios
        await cart.save();

        res.json({ message: `Cantidad del producto con ID ${productId} actualizada en el carrito con ID ${cartId}` });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});


router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        // Buscar el carrito por su ID
        const cart = await cartManager.getCarritoById(cartId);

        // Verificar si el carrito existe
        if (!cart) {
            return res.status(404).json({ error: `No se encontró un carrito con ID ${cartId}` });
        }

        // Eliminar todos los productos del carrito
        cart.products = [];

        // Guardar los cambios
        await cart.save();

        res.json({ message: `Todos los productos del carrito con ID ${cartId} han sido eliminados` });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});


module.exports = router;