const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        //Verificar si el correo ya esta registrado
        const existeUsuario = await UserModel.findOne({email:email});
        if(existeUsuario) {
            return res.status(400).send({error: "El email ya esta registrado"});
        }

        //Si no lo encuentra, creamos el nuevo usuario: 
        const nuevoUsuario = await UserModel.create({
            first_name,
            last_name, 
            email,
            password,
            age,
            admin: false
        }); 

        //Almacenamos la info del usuario en la session:
        req.session.login = true; 
        req.session.user = {...nuevoUsuario._doc};

        res.redirect("/profile");
    } catch (error) {
        console.log("Error al crear el usuario:", error);
        res.status(500).send({error: "Error al guardar el usuario nuevo"});
    }
});
module.exports = router; 