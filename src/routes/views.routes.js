const express = require("express");
const router = express.Router();
const ProductRepository = require("../repositories/product.repository");
const {passportCall, authorization, generarProductos} = require("../utils/util.js");
const UserDTO = require("../dto/user.dto.js");

// Instancia de ProductManager
const productRepository = new ProductRepository();

router.get("/", (req, res) => {
    res.redirect("/login")
})

router.get("/home", async (req, res) => {
    try {
        const productos = await productRepository.traerTodo();
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


router.get("/realtimeproducts", passportCall("session"), authorization(["admin","premium"]),async (req, res) => {
    const user = req.user;
    try {
        res.render("realtimeproducts",{role: user.role, email: user.email});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
})

router.get("/chat", passportCall("session"), authorization(["user","premium"]), async (req, res) => {
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


router.get("/current", passportCall("session"), authorization(["user", "premium"]), (req, res) => {
    const userdto = new UserDTO(req.user.first_name, req.user.last_name, req.user.age, req.user.role);
    res.send(userdto);
  })


router.get('/mockingproducts', (req,res) => {
    const productos = [];
    for(let i = 0; i < 100; i++) {
        productos.push(generarProductos());
    }
    res.json(productos);
})


router.get("/reset-password", async (req, res) => {
    res.render("passwordreset");
});
router.get("/password", async (req, res) => {
    res.render("passwordcambio");
});
router.get("/confirmacion-envio", async (req, res) => {
    res.render("confirmacion-envio");
});








module.exports = router;