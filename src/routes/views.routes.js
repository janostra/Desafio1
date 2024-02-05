const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager.js');

// Instancia de ProductManager
const productManager = new ProductManager("./src/models/Products.JSON");




router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getAllProducts();
        res.render("home", {productos})
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})


router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})

module.exports = router;