const express = require("express");
const router = express.Router();
const passport = require("passport");

//Login 
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     //Definimos al admin
//     const admin = {
//         first_name: 'Admin',
//         last_name: 'Coder',
//         email: 'adminCoder@coder.com', 
//         password: 'adminCod3r123',
//         age: 99999,
//         admin: true
//     }
//     try {
//         //Primero buscamos al usuario: 
//         const usuario = await UserModel.findOne({ email: email });

//         // Verificar si el usuario es el admin o si el usuario es encontrado en la base de datos
//         if (email === admin.email) {
//             //No se usa isValid password porque el admin no esta en la base de datos
//             if (password === admin.password) {
//                 req.session.login = true;
//                 req.session.user = { ...admin };
//                 res.redirect("/api/products");
//                 return;
//             } else {
//                 res.status(401).send({ error: "Contraseña incorrecta" });
//             }
//         } else if (usuario) {
//             if (isValidPassword(password, usuario)){
//                 req.session.login = true;
//                 req.session.user = { ...usuario._doc };
//                 res.redirect("/api/products");
//                 return;
//             }
//         } else {
//             res.status(401).send({ error: "Credenciales no válidas" });
//         }
        
//     } catch (error) {
//         res.status(400).send({ error: "Error en el login" });
//     }
// })

router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email:req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");

})

//Falla del login

router.get("/faillogin", async (req, res) => {
    res.send({error: "Fallo todoooooo el login"});
})

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

//Version para GitHub:

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res)=> {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}) ,async (req, res)=> {
    //La estrategia de GitHub me va a retornar el usuario, entonces lo agregamos a nuestra session. 
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

module.exports = router;