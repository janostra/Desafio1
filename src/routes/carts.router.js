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

        if (carrito !== null) {
            res.json({ carrito });
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

module.exports = router;