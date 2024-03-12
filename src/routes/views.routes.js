const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/product-manager-db');

// Instancia de ProductManager
const productManager = new ProductManager();

router.get("/", (req, res) => {
    res.redirect("/login")
})

router.get("/home", async (req, res) => {
    try {
        const productos = await productManager.getProduct();

        const productosMapeados = productos.map(producto => {
            return {
                title: producto.title,
                description: producto.description,
                price: producto.price,
                stock: producto.stock,
                _id: producto._id,
            };
        });

        res.render("home", {productosMapeados})
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

router.get("/chat", async (req, res) => {
    try {
        res.render("chat");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})

// Ruta para el formulario de login
router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
    if (!req.session.login) {
        return res.redirect("/login");
    }
    res.render("profile", { user: req.session.user });
});

module.exports = router;