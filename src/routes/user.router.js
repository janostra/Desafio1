const express = require("express");
const router = express.Router();
const passport = require("passport");
const { generarInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");


router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email,
        role:req.user.role,
        cart:req.user.cart
    };

    req.session.login = true;

    res.redirect("/current");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro fallido!"});
})

const arrayUsuarios = [];

router.post("/usererror", async (req, res, next) => {
    const {nombre, apellido, email} = req.body; 
    try {
        if(!nombre || !apellido || !email) {
            throw CustomError.crearError({
                nombre: "Usuario Nuevo", 
                causa: generarInfoError({nombre, apellido, email}),
                mensaje: "Error al intentar crear un usuario",
                codigo: EErrors.TIPO_INVALIDO
            })
        };

        const usuario = {
            nombre,
            apellido, 
            email
        }

        arrayUsuarios.push(usuario);
        console.log(arrayUsuarios);
        res.send({status: "success", payload: usuario});
    } catch (error) {
        next(error);
    }
})

module.exports = router; 