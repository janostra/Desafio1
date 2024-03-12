const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js"); 

//Login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    //Definimos al admin
    const admin = {
        first_name: 'Admin',
        last_name: 'Coder',
        email: 'adminCoder@coder.com', 
        password: 'adminCod3r123',
        age: 99999,
        admin: true
    }
    try {
        //Primero buscamos al usuario: 
        const usuario = await UserModel.findOne({ email: email });

        // Verificar si el usuario es el admin o si el usuario es encontrado en la base de datos
        if (email === admin.email) {
            if (password === admin.password) {
                req.session.login = true;
                req.session.user = { ...admin };
                res.redirect("/api/products");
                return;
            } else {
                res.status(401).send({ error: "Contraseña incorrecta" });
            }
        } else if (usuario) {
            if (password === usuario.password) {
                req.session.login = true;
                req.session.user = { ...usuario._doc };
                res.redirect("/api/products");
                return;
            }
        } else {
            res.status(401).send({ error: "Credenciales no válidas" });
        }
        
    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;