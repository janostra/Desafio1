const express = require("express");
const router = express.Router();
const CartManager = require('../controllers/cart-manager-db.js');

// Instancia de CartManager
const cartManager = new CartManager();

// Endpoint para crear un nuevo carrito
router.post('/', cartManager.addCart);

// Endpoint para tomar un carrito por su ID
router.get('/:cid', cartManager.getCarritoById);

// Endpoint para agregar un producto al carrito
router.post('/:cid/product/:pid', cartManager.addProductToCart);

// Endpoint para quitar un producto del carrito
router.delete('/:cid/product/:pid', cartManager.deleteProductFromCart);

// Endpoint para actualizar productos del carrito
router.put('/:cid', cartManager.updateProductsFromCart);

// Endpoint para actualizar la cantidad de un producto
router.put('/:cid/product/:pid', cartManager.updateQuantityFromProduct);

// Endpoint para borrar todos los productos
router.delete('/:cid', cartManager.deleteAllProducts);

//Endpoint para terminar la compra
router.post('/:cid/purchase', cartManager.purchaseCart);


module.exports = router;