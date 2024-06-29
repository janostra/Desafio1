const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");
const userRepository = require("../repositories/user.repository.js")
const UserRepository = new userRepository();

//Tercer Integradora: 
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class UserController {
    
    //Tercer integradora: 
    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Generar un token 
            const token = generateResetToken();

            // Guardar el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            res.redirect("/confirmacion-envio");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordcambio");
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            // Renderizar la vista de confirmación de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }


    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        try {
            const user = await UserModel.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificamos si el usuario tiene la documentacion requerida: 
            const documentacionRequerida = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];

            const userDocuments = user.documents.map(doc => doc.name);

            const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));

            if (!tieneDocumentacion) {
                return res.status(400).send("El usuario tiene que completar toda la documentacion requerida o no tendra feriados la proxima semana");
            }

            const nuevoRol = user.role === "user" ? "premium" : "user";

            const actualizado = await UserModel.findByIdAndUpdate(uid, { role: nuevoRol }, { new: true })

            res.send(nuevoRol); 

        } catch (error) {
            res.status(500).send("Error del servidor, Hector tendra gripe dos semanas mas");
        }
    }

     async UploadDocuments(req, res) {
        const { uid } = req.params;
        const uploadedDocuments = req.files;
    
        try {
            const user = await UserModel.findById(uid);
    
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
    
            //Ahora vamos a verificar si se suben los documentos y se actualiza el usuario: 
    
            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
    
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
    
                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
            }
    
            //Guardamos los cambios en la base de datos: 
    
            await user.save();
    
            res.status(200).send("Documentos cargados exitosamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Error interno del servidor, los mosquitos seran cada vez mas grandes");
        }
    }

    async getUsers (req, res) {
        try {
            const users = await UserRepository.traerUsuarios();
            const usuarios = users.map(({ password, ...rest }) => rest);
            console.log(usuarios)
            res.render('adminuser', { usuarios });
        } catch (error) {
            res.send("Error interno del servidor");
        }
        
    }

    async deleteUser (req, res) {
        try {
            const userId = req.params.uid;
            await UserRepository.borrarUsuario(userId);
            res.status(200).send("Usuario eliminado correctamente n.n")
        } catch (error) {
            res.send("Error interno del servidor");
        }
    }
    
}

module.exports = UserController;